import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import ting from "~/components/assets/sound/kururing.mp3";
import axios from "axios";

const NewPingContext = createContext();

export function useNewPingContext() {
  return useContext(NewPingContext);
}

function App() {
  const [newPing, setNewPing] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on("newCallStaff", (response) => {
      playSound();
      setNewPing(response);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    axios
      // .get("http://117.4.194.207:3003/call-staff/all?time=60")
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
      <NewPingContext.Provider value={newPing}>
        <MainRoutes />
      </NewPingContext.Provider>
    </AuthProvider>
  );
}

export default App;
