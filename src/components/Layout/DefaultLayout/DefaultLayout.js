import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import logo from "~/components/assets/image/food-logo-design-template-restaurant-free-png.webp";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import { useNewPingContext } from '~/App';
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const newPing = useNewPingContext()
  const [isNewPing, setIsNewPing] = useState(false)
  useEffect(() => {
    const removeRedDot = () => {
      if (newPing === null) {
        setIsNewPing(false);
      } else {
        const requestTime = moment(newPing.createdAt, "DD/MM/YYYY, HH:mm:ss");
        const currentTime = moment();
        const timeDifference = moment.duration(currentTime.diff(requestTime)).asMinutes();
        setIsNewPing(timeDifference <= 0.9);
      }
    };

    removeRedDot();

    // Set up the interval to check for new ping every 1 minute
    const interval = setInterval(removeRedDot, 5000); // 60000 milliseconds = 1 minute

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [newPing]);

  console.log(isNewPing);

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
          <div className={cx("dItem")} onClick={handleClickLogo}>
            Trang Chủ
            <div className={cx("reddot", { redDotHided: !isNewPing })}>
          </div>
          </div>
          <div className={cx("dItem")} onClick={handleClickMenu}>
            Thực Đơn
          </div>
          <div className={cx("dItem")} onClick={handleClickBill}>
            Hoá Đơn
          </div>
          <div className={cx("dItem")} onClick={handleClickTableManager}>
            Quản Lý Bàn
          </div>
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
