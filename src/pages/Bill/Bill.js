import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/Bill/Bill.scss";
import moment from "moment";
import { useIsAdminContext } from "~/App";
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Bill() {
  const [listGroup, setListGroup] = useState([]);
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
  const [pickedGroupId, setPickedGroupId] = useState([]);
  const [paidMethod, setPaidMethod] = useState("CASH")
  const [showImage, setShowImage] = useState("");

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

  //get group id
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/group/allByOwner`, config
      )
      .then((response) => {
        setListGroup(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  //get list cart today
  useEffect(() => {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = currentDate.getFullYear();
    // Create the formatted date string
    const formattedCurrentDate = `${day}/${month}/${year}`;
    if (pickedGroupId.length > 0) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${pickedGroupId}?date=${formattedCurrentDate}`, config
        )
        .then((response) => {
          if (response.data === "No carts created") {
            setListCart([]);
          } else {
            setListCart(response.data.filter((cart) => cart.status !== "CANCEL"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(
          // `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${pickedGroupId}?date=${formattedCurrentDate}`, config
          `${process.env.REACT_APP_API_URL}/cart/menu/all/?date=${formattedCurrentDate}`, config
        )
        .then((response) => {
          if (response.data === "No carts created") {
            setListCart([]);
          } else {
            setListCart(response.data.filter((cart) => cart.status !== "CANCEL"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [paidMethod]);

  //choose which cart to display
  useEffect(() => {
    if (!isSubmited) {
      setDisplayCart(listCart)
    } else {
      setDisplayCart(dateCart)
    }
  }, [isSubmited, listCart, dateCart, paidMethod]);

  useEffect(() => {
    let cartsToUse = isSubmited ? dateCart : listCart;

    const completedCarts = cartsToUse.filter((cart) => cart.status === "COMPLETED");

    const money = completedCarts.reduce((total, cart) => total + cart.total, 0);

    setTotalIncome(money);
  }, [isSubmited, dateCart, listCart, paidMethod]);

  const handleDateChange = (event) => {
    setDatePush(event.target.value);
    setNeedsClick(true)
  };

  //get DateCart
  const handleDate = (event) => {
    event.preventDefault();
    setNeedsClick(false)
    setDateCart([]);
    const inputDate = new Date(datePush);
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    if (pickedGroupId.length > 0) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${pickedGroupId}?date=${formattedDate}`,
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
            setDateCart(response.data.filter((cart) => cart.status !== "CANCEL" ));
            setIsEmpty(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(
          // `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${pickedGroupId}?date=${formattedCurrentDate}`, config
          `${process.env.REACT_APP_API_URL}/cart/menu/all/?date=${formattedDate}`, config
        )
        .then((response) => {
          setIsSubmited(true);
          if (response.data === "No carts created") {
            setDateCart([]);
          } else {
            setDateCart(response.data.filter((cart) => cart.status !== "CANCEL"));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleShowImage = (id) => {
    if (showImage !== id) {
        setShowImage(id)
    } else if (showImage === id) {
        setShowImage("")
    }
}

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = (value) => {
    if (value === "") {
      setSelectedValue("Tất Cả");
      setPickedGroupId([])
      toggleDropdown();
      setNeedsClick(true);
    } else {
      setSelectedValue(value);
      let group = listGroup.filter(group => (group.name === value))
      setPickedGroupId(group[0]._id)
      toggleDropdown();
      setNeedsClick(true);
    }
  }

  const handleButtonClick = () => {
    setNeedsClick(false);
    // ... any other logic you might have
  };

  console.log(listCart);

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
                        {listGroup
                          .map((user, index) => (
                            <div
                              key={index}
                              className={cx("dropdownContent")}
                              onClick={() =>
                                handleDropdownItemClick(user.name)
                              }
                            >
                              {user.name}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  id="submitButton"
                  className={needsClick ? 'needClick' : 'Hiden'}
                  onClick={handleDate}
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
          <div className={cx("filterPaymentBox")}>
            <div className={cx("payByCash", paidMethod === "CASH" ? "active" : "")} onClick={() => setPaidMethod("CASH")}>Tiền Mặt</div>
            <div className={cx("payByBank", paidMethod === "BANK" ? "active" : "")} onClick={() => setPaidMethod("BANK")}>Chuyển Khoản</div>
          </div>
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
          {displayCart
            .filter((cart) => cart.status !== "CANCEL" && cart.paymentMethod === paidMethod)
            .map((cart, index) => (
              <div key={index} className={cx("bItem")}>
                <div className={cx("bItemLeftContainer")}>

                  <div className={cx("bTable")}>Bàn: {cart.table}</div>

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
                    {cart.status === "IN_PROGRESS" ? "Đang Chờ" : cart.status === "COMPLETED" ? "Đã Xong" : "Chưa Thu Tiền"}
                  </div>
                  <div className={cx("bNote")}>Thanh Toán: {cart.paymentMethod === "CASH" ? "Tiền Mặt" : "Chuyển Khoản"}</div>
                  {cart.paymentMethod === "CASH" && (
                    <div className={cx("bNote")}>Nhân Viên: {cart.paymentStaff}</div>
                  )}
                  <div className={cx("bNote")}>Tên Khách: {cart.customer_name}</div>

                  <div className={cx("bNote")}>Ghi Chú: {cart.note}</div>


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
                {cart.paymentMethod === "BANK" && (
                  <Fragment>
                    <div className={cx("extendPayBill")} onClick={() => handleShowImage(cart.image_payment.id)}>
                      {/* <img src={extendArrow} alt="Xem Bill"></img> */}
                      <span>
                        {showImage === cart.image_payment.id && "Ẩn Bill"}
                        {showImage !== cart.image_payment.id && "Xem Bill"}
                      </span>
                    </div>
                    {showImage === cart.image_payment.id && (
                      <div className={cx("payBillBorder")}>
                        <img src={cart.image_payment.path}></img>
                      </div>
                    )}

                  </Fragment>
                )}
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
}

export default Bill;
