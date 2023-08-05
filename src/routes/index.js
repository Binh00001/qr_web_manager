import Home from "~/pages/home/home.js";
import Menu from "~/pages/menu/menu";
import AddDish from "~/pages/AddDish/index";
import Bill from "~/pages/Bill/Bill";
import HiddenMenu from "~/pages/hidden_menu/hidden_menu";
import Login from "~/pages/Login/login";
import Signup from "~/pages/signup/signup";
import TableManager from "~/pages/TableMananger/TableManager";

import Test from "~/components/loadingScreen/loadingScreen";

import { RequireAuth, useSignOut } from "react-auth-kit";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "~/components/Layout/DefaultLayout/DefaultLayout";
import { useEffect } from "react";
import io from "socket.io-client";

function MainRoutes() {
  const signOut = useSignOut();
  const token = localStorage.getItem("token");
  const cashierInfo = JSON.parse(localStorage.getItem("token_state"));
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    if (token && cashierInfo) {
      const handleTokenChange = (response) => {
        if (response.cashier.id === cashierInfo.cashierId) {
          if (response.token.accessToken !== token) {
            alert("Tài khoản của bạn đã bị đăng nhập từ nơi khác");
            signOut();
          }
        }
      };
      socket.on("anotherLogin", (response) => {
        setTimeout(() => {
          handleTokenChange(response);
        }, 5000);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, cashierInfo]);

  return (
    <BrowserRouter>
      {/* <div className="App"> */}
      <Routes>
        <Route
          path={"/login"}
          element={
            // <DefaultLayout>
            <Login />
            // </DefaultLayout>
          }
          exact
        />
        <Route
          path={"/signup"}
          element={
            <DefaultLayout>
              <Signup />
            </DefaultLayout>
          }
          exact
        />
        <Route
          path={"/"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/menu"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Menu />
              </DefaultLayout>
            </RequireAuth>
          }
        />
        <Route
          path={"/hidden-menu"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <HiddenMenu />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/addDish"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <AddDish />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/bill"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <Bill />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/tableManager"}
          element={
            <RequireAuth loginPath={"/login"}>
              <DefaultLayout>
                <TableManager />
              </DefaultLayout>
            </RequireAuth>
          }
          exact
        />
        <Route
          path={"/test"}
          element={
            <RequireAuth loginPath={"/login"}>
              {/* <DefaultLayout> */}
              <Test />
              {/* </DefaultLayout> */}
            </RequireAuth>
          }
          exact
        />
      </Routes>
      {/* </div> */}
    </BrowserRouter>
  );

  // { path: "/", component: Home },
  // { path: "/menu", component: Menu },
  // { path: "/hidden-menu", component: HiddenMenu },
  // { path: "/addDish", component: AddDish },
  // { path: "/bill", component: Bill },
  // { path: "/login", component: Login },
}
export default MainRoutes;
