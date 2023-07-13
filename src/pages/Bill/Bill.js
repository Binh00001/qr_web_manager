import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/Bill/Bill.scss";
import moment from "moment";
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Bill() {
  const [listCart, setListCart] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://117.4.194.207:3003/cart/menu/all?time=120")
        .then((response) => {
          setListCart(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Fragment>
      <div className="Wrapper">
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("mTopBar")}>
              <div className={cx("mText")}>
                Tất Cả Hoá Đơn:
                  <nav></nav>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("bBody")}>
          <div className={cx("bMarginTop")}></div>
          {listCart.map((cart, index) => (
            <div key={index} className={cx("bItem")}>
              <div className={cx("bItemLeftContainer")}>
                <div className={cx("bId")}>ID: {cart._id}</div>

                <div className={cx("bTable")}>Bàn: {cart.table}</div>

                <div className={cx("bNote")}>Ghi Chú: {cart.note}</div>

                <div className={cx("bTotalBill")}>
                  Tổng Tiền:{" "}
                  <span style={{ color: "#f04d4d" }}>
                    {cart.total.toLocaleString()} vnđ
                  </span>
                </div>
                <div className={cx("bCreateTime")}>
                  Thời Gian Tạo:{" "}
                  <span style={{ color: "#f04d4d" }}>
                    {moment(cart.createdAt).format("h:mm A")}
                  </span>
                </div>
              </div>
              <div className={cx("bItemRightContainer")}>
                <div>
                  <div className={cx("bTopTitle")}>
                    <div className={cx("bTitleText")}>Tên Món</div>
                    <div className={cx("bTitleText")}>Tuỳ Chọn</div>
                    <div className={cx("bTitleText")}>Số Lượng</div>
                  </div>
                  {cart.order.map((order, orderIndex) => (
                    <div className={cx("bFoodItem")} key={orderIndex}>
                      <div className={cx("bFoodName")}>{order.dish_name}</div>
                      <div className={cx("bFoodOption")}>
                        {/* {Array.isArray(order.options) &&
                          order.options.map((option, optionIndex) => ( */}
                        <span>{order.options}</span>
                        {/* ))} */}
                      </div>
                      <div className={cx("bFoodQuantity")}>{order.number}</div>
                    </div>
                  ))}
                </div>

                <div className={cx("bPrintButton")}>
                  <button className={cx("PrintBillButton")}>In Hoá Đơn</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Bill;
