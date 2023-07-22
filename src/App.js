import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";
import { useEffect } from "react";
import io from 'socket.io-client';
import ting from "~/components/assets/sound/Herta Kurukuru Kururin 1 (mp3cut.net) (5).mp3";

function App() {
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('newCallStaff', () => {
      playSound();
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
      <MainRoutes />
    </AuthProvider>
  );
}

export default App;