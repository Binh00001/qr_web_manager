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
  const [needsClick, setNeedsClick] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCashierName, setSelectedCashierName] = useState("");
  const navigate = useNavigate();
  const currentDate = new Date();
  const [datePush, setDatePush] = useState(currentDate);
  const [reload, setReload] = useState(true);
  const [displayCart, setDisplayCart] = useState([]);
  const isAdmin = useIsAdminContext();
  // const [isTodayEmpty, setIsTodayEmpty] = useState(false);
  const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (isAdmin === "cashier") {
      navigate(`/`);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/all`)
      .then((response) => {
        setLishCashier(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!isSubmited) {
      setDisplayCart(listCart)
    } else {
      setDisplayCart(dateCart)
    }
  }, [isSubmited, listCart, dateCart]);

  useEffect(() => {
    let cartsToUse = isSubmited ? dateCart : listCart;

    const completedCarts = cartsToUse.filter((cart) => cart.status === "COMPLETED");

    const money = completedCarts.reduce((total, cart) => total + cart.total, 0);

    setTotalIncome(money);
  }, [isSubmited, dateCart, listCart]);

  const handleDateChange = (event) => {
    setDatePush(event.target.value);
    setNeedsClick(true)
    // setSelectedDate(event.target.value);
  };

  const handleDate = (event) => {
    event.preventDefault();
    setNeedsClick(false)
    setDateCart([]);
    // Convert the input value to a Date object
    const inputDate = new Date(datePush);
    // Extract the day, month, and year components
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = inputDate.getFullYear();
    // Create the formatted date string
    const formattedDate = `${day}/${month}/${year}`;
    if (selectedCashierName !== "") {
      console.log(selectedCashierName);
      const selectedCashier = listCashier.find(
        (cashier) => cashier.cashierName === selectedCashierName
      );
      if (selectedCashier) {
        const cashierId = selectedCashier.id;
        axios
          .get(
            `http://117.4.194.207:3003/cart/menu/allByCashier/${cashierId}?date=${formattedDate}`
            // config
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
    } else {
      console.log(formattedDate);
      axios
        .get(
          `http://117.4.194.207:3003/cart/menu/all/?date=${formattedDate}`
          // config
        )
        .then((response) => {
          setIsSubmited(true);
          console.log(response);
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

  useEffect(() => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = currentDate.getFullYear();
    // Create the formatted date string
    const formattedCurrentDate = `${day}/${month}/${year}`;
    if (selectedCashierName === "") {
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
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = (value) => {
    if(value === ""){
      setSelectedValue("Tất Cả");
      setSelectedCashierName(value);
      toggleDropdown();
      setNeedsClick(true);
    }else{
      setSelectedValue(value);
      setSelectedCashierName(value);
      toggleDropdown();
      setNeedsClick(true);
    }
  };

  const handleConvertCashierId = (ID) => {
    let cashierName = ""; // Use 'let' instead of 'const'

    listCashier.forEach(item => {
      if (item.id === ID) {
        cashierName = item.cashierName;
      }
    });

    return cashierName;
  }

  const handleButtonClick = () => {
    setNeedsClick(false);
    // ... any other logic you might have
  };

  return (
    <Fragment>
      <div className="bWrapper">
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("mTopBar")}>
              <div className={cx("bText")}>
                <label for="billDay">Chọn Ngày</label>
                <input
                  type="date"
                  id="billDay"
                  name="billDay"
                  onChange={handleDateChange}
                />
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
                          .filter((user) => user.cashierName !== "admin")
                          .map((user, index) => (
                            <div
                              key={index}
                              className={cx("dropdownContent")}
                              onClick={() =>
                                handleDropdownItemClick(user.cashierName)
                              }
                            >
                              {user.cashierName}
                            </div>
                          ))}
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
                <button
                  id="submitButton"
                  className={needsClick ? 'needClick' : 'Hiden'}
                  onClick={(event) => handleDate(event)}
                >
                  Submit
                </button>
              </div>
              <div className={cx("bText")}>
                <div className={cx("bTotalIncome")}>
                  Doanh Thu: {totalIncome.toLocaleString("vi-VN")} vnđ
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("bBody")}>
          <div className={cx("bMarginTop")}></div>
          {isEmpty && (
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
                <div className={cx("bId")}>Chi Nhánh: {handleConvertCashierId(cart.cashier_id)}</div>

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
                <div className={cx("bId")}>
                  Trạng Thái:{" "}
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
