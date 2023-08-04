import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/Bill/Bill.scss";
import moment from "moment";
import { useIsAdminContext } from "~/App";
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Bill() {
  const [listCart, setListCart] = useState([]);
  const [dateCart, setDateCart] = useState([]);
  const [listCashier, setLishCashier] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedCashierName, setSelectedCashierName] = useState('');
  const navigate = useNavigate();

  const isAdmin = useIsAdminContext();
  // const [isTodayEmpty, setIsTodayEmpty] = useState(false);
  const currentDate = new Date();

  const completedCarts = listCart.filter((cart) => cart.status === "COMPLETED");
  const totalIncome = completedCarts.reduce((total, cart) => total + cart.total, 0);

  const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (isAdmin === false) {
      navigate(`/`);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/all`)
      .then((response) => {
        setLishCashier(response.data)
      })
      .catch((error) => {
        console.log(error);
      });

  }, [])

  const handleDate = (event) => {
    event.preventDefault();
    const date = document.getElementById("billDay").value;

    // Convert the input value to a Date object
    const inputDate = new Date(date);

    // Extract the day, month, and year components
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = inputDate.getFullYear();

    // Create the formatted date string
    const formattedDate = `${day}/${month}/${year}`;
    // console.log(formattedDate);
    if (selectedCashierName !== '') {
      axios
        .get(
          `http://117.4.194.207:3003/cart/menu/allByCashier/${selectedCashierName}?date=${formattedDate}`,
          config
        )
        .then((response) => {
          setIsSubmited(true);
          if (
            response.data.length === 0 ||
            response.data === "No carts created"
          ) {
            setIsEmpty(true);
          } else {
            setDateCart(response.data);
            setIsEmpty(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };
  // console.log(listCart);

  useEffect(() => {
    const fetchData = () => {
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const year = currentDate.getFullYear();
      // Create the formatted date string
      const formattedCurrentDate = `${day}/${month}/${year}`;
      if(selectedCashierName === ''){
        axios
        .get(
          `http://117.4.194.207:3003/cart/menu/all/?date=${formattedCurrentDate}`
        )
        .then((response) => {
          if (response.data === "No carts created") {
            setListCart([]);
          } else {
            setListCart(response.data);
          }
          // if (response.data.length === 0) {
          //   setIsTodayEmpty(true)
          // } else {
          //   setIsTodayEmpty(false)
          // }
        })
        .catch((error) => {
          console.log(error);
        });
      }
      if(selectedCashierName !== ''){
        axios
        .get(
          `http://117.4.194.207:3003/cart/menu/allByCashier/${selectedCashierName}?date=${formattedCurrentDate}`,
          config
        )
        .then((response) => {
          setIsSubmited(true);
          if (
            response.data.length === 0 ||
            response.data === "No carts created"
          ) {
            setIsEmpty(true);
          } else {
            setDateCart(response.data);
            setIsEmpty(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  let displayCart = [];
  if (!isSubmited) {
    displayCart = listCart;
  } else {
    displayCart = dateCart;
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = (value) => {
    setSelectedValue(value);
    setSelectedCashierName(value);
    toggleDropdown();
  };

  return (
    <Fragment>
      <div className="bWrapper">
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("mTopBar")}>
              <div className={cx("bText")}>
                <label for="billDay">Chọn Ngày</label>
                <input type="date" id="billDay" name="billDay" />
              </div>
              <div className={cx("bText")}>
                <div className={cx("dropdown")} onClick={toggleDropdown}>
                  <div id="cashier">{selectedValue || "Tất Cả Chi Nhánh"}</div>
                  {isOpen && (
                    <div>
                      <div className={cx("dropdownWrapper")}>
                        <div
                          className={cx("dropdownContent")}
                          onClick={() => handleDropdownItemClick("")}
                        >
                          Tất Cả
                        </div>
                        {listCashier
                          .filter((user) => (user.cashierName !== "admin"))
                          .map((user, index) => (
                            <div
                              key={index}
                              className={cx("dropdownContent")}
                              onClick={() => handleDropdownItemClick(user.cashierName)}
                            >
                              {user.cashierName}
                            </div>
                          ))
                        }

                      </div>

                      {/* <div
                        className={cx("dropdownContent")}
                        onClick={() => handleDropdownItemClick("NV1")}
                      >
                        NV1
                      </div> */}
                    </div>
                  )}
                </div>
                <input id="subbmitButton" type="submit" onClick={(event) => handleDate(event)} />
              </div>
              <div className={cx("bText")}>
                <div className={cx("bTotalIncome")}>Doanh Thu: {totalIncome.toLocaleString()} vnđ</div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("bBody")}>
          <div className={cx("bMarginTop")}></div>
          {(isEmpty) && (
            <div className={cx("emptyCart")}>
              <p>Ngày Này Không Có Hoá Đơn</p>
            </div>
          )}
          {/* {isTodayEmpty &&
            <div className={cx("emptyCart")}>
              <p>Hôm Nay Chưa Có Hoá Đơn</p>
            </div>
          } */}
          {displayCart.map((cart, index) => (
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
                    {moment(cart.createAt, "DD/MM/YYYY, HH:mm:ss").format(
                      "HH:mm A"
                    )}
                  </span>
                </div>
                <div className={cx("bId")}>Trạng Thái:
                  {cart.status === "IN_PROGRESS" && "Đang Chờ"}
                  {cart.status === "COMPLETED" && "Đã Xong"}
                  {cart.status === "CANCEL" && "Đã Huỷ"}
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
                        <span>{order.options}</span>
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
