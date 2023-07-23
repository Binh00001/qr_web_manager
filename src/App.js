import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";
import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import ting from "~/components/assets/sound/kururing.mp3";

const NewPingContext = createContext();

export function useNewPingContext() {
  return useContext(NewPingContext);
}

function App() {

  const [newPing, setNewPing] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('newCallStaff', (response) => {
      playSound();
      setNewPing(response)
    });
    return () => {
      socket.disconnect();
    };
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