import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import logo from "~/components/assets/image/food-logo-design-template-restaurant-free-png.webp";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useNewPingContext, useIsAdminContext } from "~/App";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "moment/locale/vi";
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const newPing = useNewPingContext();
  const isAdmin = useIsAdminContext();
  const [isNewPing, setIsNewPing] = useState(false);

  useEffect(() => {
    const removeRedDot = () => {
      if (newPing === null || !newPing) {
        setIsNewPing(false);
      } else {
        const requestTime = moment(newPing.createdAt, "DD/MM/YYYY, HH:mm:ss");
        const currentTime = moment();
        const timeDifference = moment
          .duration(currentTime.diff(requestTime))
          .asMinutes();
        setIsNewPing(timeDifference <= 0.9);
      }
    };

    removeRedDot();

    const interval = setInterval(removeRedDot, 5000); 
    return () => clearInterval(interval);
  }, [newPing]);

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
              <div className={cx("dItem")} onClick={handleClickBill}>
                Tất Cả Hoá Đơn
              </div>
              <div className={cx("dItem")} onClick={handleClickTableManager}>
                Quản Lý Bàn
              </div>
              <div className={cx("dItem")} onClick={handleClickSignUp}>
                Tài Khoản
              </div>
            </Fragment>

          )}
          {isAdmin === "cashier" && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickLogo}>
                Trang Chủ
                <div className={cx("reddot", { redDotHided: !isNewPing })}></div>
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
