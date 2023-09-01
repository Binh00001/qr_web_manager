import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import logo from "~/components/assets/image/food-logo-design-template-restaurant-free-png.webp";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useReddotShowContext, useIsAdminContext } from "~/App";
import { Fragment, useEffect, useState } from "react";
// import io from "socket.io-client";
// import ting from "~/components/assets/sound/ting.mp3";
// import moment from "moment";
// import axios, { all } from "axios";
import "moment/locale/vi";
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const showReddot = useReddotShowContext();
  const isAdmin = useIsAdminContext();
  const [isOpenNav, setIsOpenNav] = useState(false);
  const signOut = useSignOut();
  let cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate(`/sortedbytable`);
  };
  const handleClickMenu = () => {
    navigate(`/menu`);
  };
  const handleClickBill = () => {
    navigate(`/bill`);
  };
  const handleClickTableManager = () => {
    navigate(`/tableManager`);
  };
  const handleClickCreateBill = () => {
    navigate(`/createbill`);
  };
  const handleClickSignUp = () => {
    navigate(`/signup`);
  };
  const handleClickSignUpOwner = () => {
    navigate(`/signupowner`);
  };

  const logout = () => {
    signOut();
    navigate("/login");
  };

  const openNavMenu = () => {
    setIsOpenNav(!isOpenNav)
  }

  return (
    <div className={cx("dWrapper")}>
      <div className={cx("dContent")}>
        <div className={cx("dLeftContainer")}>
          {isAdmin === "ADMIN" && (
            <Fragment>
              <div className={cx("dItemAdmin")} onClick={handleClickSignUp}>
                Tài Khoản
              </div>
            </Fragment>

          )}

          {isAdmin === "OWNER" && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickBill}>
                Hoá Đơn
              </div>
              <div className={cx("dItemAdmin")} onClick={handleClickSignUpOwner}>
                Tài Khoản
              </div>
            </Fragment>
          )}

          {isAdmin === "STAFF" && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickLogo}>
                Trang Chủ
                <div className={cx("reddot", { redDotHided: !showReddot })}></div>
              </div>
              <div className={cx("dItem")} onClick={handleClickCreateBill}>
                Tạo Đơn
              </div>
            </Fragment>
          )}

          {isAdmin === "MANAGER" && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickLogo}>
                Trang Chủ
                <div className={cx("reddot", { redDotHided: !showReddot })}></div>
              </div>
              <div className={cx("dItem")} onClick={handleClickMenu}>
                Thực Đơn
              </div>
              <div className={cx("dItem")} onClick={handleClickCreateBill}>
                Tạo Đơn
              </div>
            </Fragment>
          )}
        </div>
        <div className={cx("dRightContainer")}>
          {!isOpenNav && (
            <Fragment >
              <div className={cx("barGroup")} onClick={() => openNavMenu()}>
                <div className={cx("bar")}></div>
                <div className={cx("bar")}></div>
                <div className={cx("bar")}></div>
              </div>
            </Fragment>
          )}
          {isOpenNav && (
            <Fragment>
              <div className={cx("barGroup")} onClick={() => openNavMenu()}>
                <div className={cx("bar")}></div>
                <div className={cx("bar")}></div>
                <div className={cx("bar")}></div>
              </div>
              <div className={cx("grayOverlay")} onClick={() => openNavMenu()}></div>
              <div className={cx("navBoxWhite")}>
                <div className={cx("accountName")}>{cashier.cashierName}</div>
                <div className={cx("logout")} onClick={logout}>Đăng Xuất</div>
              </div>
            </Fragment>
          )}

        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default DefaultLayout;

