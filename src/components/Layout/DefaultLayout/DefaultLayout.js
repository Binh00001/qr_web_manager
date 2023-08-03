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
  // const cashierInfo = JSON.parse(localStorage.getItem("token_state")) || [];

  // // console.log(cashierInfo);
  // useEffect(() => {
  //   axios
  //     // .get("http://117.4.194.207:3003/call-staff/all?time=60")
  //     .get(
  //       `${process.env.REACT_APP_API_URL}/cashier/all`
  //     )
  //     .then((response) => {
  //       if (cashierInfo.cashierId === response.data[0].id) {
  //         setIsAdmin(true)
  //       }
  //       // console.log(response.data[0].id);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  // }, [])

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

    // Set up the interval to check for new ping every 1 minute
    const interval = setInterval(removeRedDot, 5000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component is unmounted
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
          {isAdmin && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickBill}>
                Tất Cả Hoá Đơn
              </div>
              <div className={cx("dItem")} onClick={handleClickTableManager}>
                Quản Lý Bàn
              </div>
              <div className={cx("dItem")} onClick={handleClickSignUp}>
                Đăng Kí 
              </div>
            </Fragment>

          )}
          {!isAdmin && (
            <Fragment>
              <div className={cx("dItem")} onClick={handleClickLogo}>
                Trang Chủ
                <div className={cx("reddot", { redDotHided: !isNewPing })}></div>
              </div>
              <div className={cx("dItem")} onClick={handleClickMenu}>
                Thực Đơn
              </div>
              <div className={cx("dItem")} onClick={handleClickCreateBill}>
                Tạo Hoá Đơn
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
