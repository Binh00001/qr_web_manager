import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import logo from "~/components/assets/image/food-logo-design-template-restaurant-free-png.webp";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useReddotShowContext, useIsAdminContext } from "~/App";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "moment/locale/vi";
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const showReddot = useReddotShowContext();
  const isAdmin = useIsAdminContext();
  const [isNewPing, setIsNewPing] = useState(false);
  const singOut = useSignOut();
  let cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate(`/`);
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


  const logout = () => {
    singOut();
    navigate("/login");
  };


  return (
    <div className={cx("dWrapper")}>
      <div className={cx("dContent")}>
        <div className={cx("dLeftContainer")}>
          <div className={cx("LogoBorder")}>
            <img onClick={handleClickLogo} src={logo} alt="LOGO"></img>
          </div>
          {isAdmin === "admin" && (
            <Fragment>
              <div className={cx("dItemAdmin")} onClick={handleClickBill}>
                Hoá Đơn
              </div>
              <div className={cx("dItemAdmin")} onClick={handleClickTableManager}>
                Quản Lý Bàn
              </div>
              <div className={cx("dItemAdmin")} onClick={handleClickSignUp}>
                Tài Khoản
              </div>
            </Fragment>

          )}
          {isAdmin === "cashier" && (
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
          <div className={cx("dCashierName")}>{cashier.cashierName}</div>
          {/* <div className={cx("UserName dItem")}></div> */}
          <button className={cx("dLogout")} onClick={logout}>
            Đăng Xuất
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default DefaultLayout;
