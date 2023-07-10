import { AuthProvider } from "react-auth-kit";
import refreshApi from "./components/RefreshToken/RefreshToken";
import MainRoutes from "./routes";

function App() {
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
