import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import ting from "~/components/assets/sound/ting.mp3";
import axios from "axios";

const NewPingContext = createContext();

const IsAdminContext = createContext();
export function useNewPingContext() {
  return useContext(NewPingContext);
}

export function useIsAdminContext() {
  return useContext(IsAdminContext);
}

function App() {
  const [newPing, setNewPing] = useState(null);
  const [isAdmin, setIsAdmin] = useState("loading");
  const cashierInfo = JSON.parse(localStorage.getItem("token_state")) || [];
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/${cashierInfo.cashierId}`)
      .then((response) => {
        if (
          cashierInfo.cashierName === "admin" &&
          cashierInfo.cashierName === response.data.cashierName
        ) {
          setIsAdmin("admin");
          // console.log(cashierInfo.cashierName === "admin" && cashierInfo.cashierName === response.data.cashierName);
        } else {
          setIsAdmin("cashier");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("newCallStaff", (response) => {
      if (isAdmin === "cashier") {
        console.log(response);
        if (response.cashier_id === cashierInfo.cashierId) {
          playSound();
          setNewPing(response);
        }
      }
    });
    socket.on("newCart", (response) => {
      if (isAdmin === "cashier") {
        if (response.cashier_id === cashierInfo.cashierId) {
          playSound();
          setNewPing(response);
        }
      }
    });
   
    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/call-staff/all?time=60`)
      .then((response) => {
        const newRequests = response.data;
        setNewPing(newRequests[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const playSound = () => {
    const audio = new Audio(ting);
    audio.play();
  };

  return (
    <AuthProvider
      authType={"localstorage"}
      authName={"token"}
      refresh={refreshApi}
    >
      <IsAdminContext.Provider value={isAdmin}>
        <NewPingContext.Provider value={newPing}>
          <MainRoutes />
        </NewPingContext.Provider>
      </IsAdminContext.Provider>
    </AuthProvider>
  );
}

export default App;
