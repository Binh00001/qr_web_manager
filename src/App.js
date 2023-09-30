import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import ting from "~/components/assets/sound/ting.mp3";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";

const ReddotShowContext = createContext();

const CallStaffListContext = createContext();

const IsAdminContext = createContext();

const BillInProgressContext = createContext();

export function useReddotShowContext() {
  return useContext(ReddotShowContext);
}

export function useCallStaffListContext() {
  return useContext(CallStaffListContext);
}

export function useBillInProgress() {
  return useContext(BillInProgressContext);
}

export function useIsAdminContext() {
  return useContext(IsAdminContext);
}

function App() {
  const [requests, setRequests] = useState([]);
  const [listCart, setListCart] = useState([]);
  const [newPing, setNewPing] = useState(null);
  const [checkBill, setCheckBill] = useState();
  const [reddotShow, setReddotShow] = useState(false);
  const [billInProgress, setBillInProgress] = useState(false);
  const [isAdmin, setIsAdmin] = useState("loading");

  const cashierInfo = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const allBillDone = () => {
      return !listCart.some((cartItem) => {
        return cartItem.status === "IN_PROGRESS";
      });
    }
    const anyBillInProgress = !allBillDone();
    setBillInProgress(anyBillInProgress);
  }, [listCart]);

  //socket
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("newCallStaff", (response) => {
      if (isAdmin === "cashier") {
        if (response.cashier_id === cashierInfo.cashierId) {
          setNewPing(response);
        }
      }
    });
    socket.on("newCart", (response) => {
      if (isAdmin === "cashier") {
        if (response.cashier_id === cashierInfo.cashierId) {
          setNewPing(response);
        }
      }
    });
    socket.on("status", (response) => {
      if (isAdmin === "cashier") {
        setCheckBill(response._id);
        console.log(response._id);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  //get role
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/${cashierInfo.cashierId}`)
      .then((response) => {

        if (
          cashierInfo.role === "ADMIN" &&
          cashierInfo.role === response.data.role
        ) {
          setIsAdmin("ADMIN");
        } else {
          setIsAdmin(response.data.role);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //get call staff list everytime its have new ping
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/call-staff/all/${cashierInfo.group_id}?time=10`
      )
      .then((response) => {
        if (response.data === "No call staff created") {
          setRequests([]);
        } else {
          const newRequests = response.data;
          setRequests(newRequests);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [newPing]);



  //show reddot if there is atleast 1 not checked
  useEffect(() => {
    const anyRedDot = requests.some((request) => request.isChecked === false);
    setReddotShow(anyRedDot);
  }, [requests]);

  //get list cart
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${cashierInfo.cashierId}?time=0`
        )
        .then((response) => {
          if (response.data !== "No carts created") {
            setListCart(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
    return () => {
      clearInterval(interval);
    };
  }, [newPing, checkBill]);

  //remove reddot after 1 min
  const removeRedDot = (request) => {
    if (requests.length > 0 && request) {
      const createdAt =
        request.createdAt || moment().format("DD/MM/YYYY, HH:mm:ss");
      const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment
        .duration(currentTime.diff(requestTime))
        .asMinutes();

      // Check if the request is in the list of read requests
      return (timeDifference <= 1)
    }
    return false;
  };

  return (
    <AuthProvider
      authType={"localstorage"}
      authName={"token"}
      refresh={refreshApi}
    >
      <IsAdminContext.Provider value={isAdmin}>
        <ReddotShowContext.Provider value={reddotShow}>
          <BillInProgressContext.Provider value={billInProgress}>
            <CallStaffListContext.Provider value={requests}>
              <MainRoutes />
            </CallStaffListContext.Provider>
          </BillInProgressContext.Provider>
        </ReddotShowContext.Provider>
      </IsAdminContext.Provider>
    </AuthProvider>
  );
}

export default App;
