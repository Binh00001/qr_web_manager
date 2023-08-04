import { Fragment, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import Loading from "~/components/loadingScreen/loadingScreen";
import { useIsAdminContext } from "~/App";
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  const [requests, setRequests] = useState([]);
  const [listTenMin, setListTenMin] = useState([]);
  const [isNewRequest, setIsNewRequest] = useState([]);
  const [listCart, setListCart] = useState([]);
  const [readRequestIds, setReadRequestIds] = useState([]);
  const [cartStatusChange, setCartStatusChange] = useState(true);
  const currentDate = new Date();

  const navigate = useNavigate();

  const isAdmin = useIsAdminContext();

  const areRequestsOrListTenMinEmpty = () => {
    return requests.length === 0 && listTenMin.length === 0;
  };

  const [showContent, setShowContent] = useState(
    !areRequestsOrListTenMinEmpty()
  );

  const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("newCallStaff", (response) => {
      setIsNewRequest(response);
    });
  }, []);

  useEffect(() => {
    if (isAdmin === "admin") {
      navigate(`/bill`);
    }
  }, [isAdmin, navigate]);


  useEffect(() => {
    const fetchData = () => {
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const formattedCurrentDate = `${day}/${month}/${year}`;
      axios
        .get(`${process.env.REACT_APP_API_URL}/cart/menu/all?date=${formattedCurrentDate}`)
        .then((response) => {
          setListCart(response.data);
          // console.log(response.data);
          // if (response.data.length === 0) {
          //   setIsTodayEmpty(true)
          // } else {
          //   setIsTodayEmpty(false)
          // }
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
  }, [cartStatusChange]);

  useEffect(() => {
    const fetchData = () => {
      axios
        // .get("http://117.4.194.207:3003/call-staff/all?time=60")
        .get(
          `${process.env.REACT_APP_API_URL}/call-staff/all/${cashier.cashierId}?time=60`
        )
        .then((response) => {
          if (response.data === "No call staff created") {
            setRequests([]);
          } else {
            const newRequests = response.data;
            setRequests(newRequests);
          }
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
  }, [isNewRequest]);

  useEffect(() => {
    if (areRequestsOrListTenMinEmpty()) {
      setShowContent(false);
      return;
    }
    const updatedListTenMin = listTenMin.filter((request) => {
      const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment
        .duration(currentTime.diff(requestTime))
        .asMinutes();
      return timeDifference <= 10;
    });

    setListTenMin(updatedListTenMin);
    requests.forEach((request) => {
      const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment
        .duration(currentTime.diff(requestTime))
        .asMinutes();
      // console.log(timeDifference);
      if (
        timeDifference <= 10 &&
        !listTenMin.some((listRequest) => listRequest._id === request._id)
      ) {
        setListTenMin((prevListTenMin) => [...prevListTenMin, request]);
      } else if (
        timeDifference > 10 &&
        listTenMin.some((listRequest) => listRequest._id === request._id)
      ) {
        setListTenMin((prevListTenMin) =>
          prevListTenMin.filter(
            (listRequest) => listRequest._id !== request._id
          )
        );
      }
    });
    setShowContent(true);
  }, [requests]);


  const removeRedDot = (request) => {
    if (requests.length > 0 && request) {
      const createdAt = request.createdAt || moment().format("DD/MM/YYYY, HH:mm:ss");
      const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment.duration(currentTime.diff(requestTime)).asMinutes();

      // Check if the request is in the list of read requests
      return timeDifference <= 1 && !readRequestIds.includes(request._id);
    }
    return false;
  };

  const handleNotificationClick = (request) => {
    // Add the request ID to the list of read requests
    setReadRequestIds((prevIds) => [...prevIds, request._id]);
  }

  const isWithin10Minutes = (createdAt) => {
    const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();

    return timeDifference <= 10;
  };

  const handleSetDoneBill = (cartId) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/cart/status/${cartId}`, { status: "COMPLETED" }, config)
      .then((response) => {
        console.log("Cart marked as complete:", response.data);
        setCartStatusChange(!cartStatusChange)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSetCancelBill = (cartId) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/cart/status/${cartId}`, { status: "CANCEL" }, config)
      .then((response) => {
        console.log("Cart marked as complete:", response.data);
        setCartStatusChange(!cartStatusChange)
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <Fragment>
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("hLeftContainer")}>
            </div>
            <div className={cx("hRightContainer")}>
              <div className={cx("hText")}>
                Quản Lý Yêu Cầu(ẩn sau 10 phút):
              </div>
            </div>
          </div>
        </div>
        <div className={cx("hBody")}>
          <div className={cx("hLeftContainer")}>
            {listCart === "No carts created" && (
              <Fragment>
                <div className={cx("NoCartsNotification")}>
                  Hiện Chưa Có Đơn
                </div>
                <div className={cx("hListBill")}>
                  <div className={cx("hItem")}>
                    <div className={cx("hItemContent")}>
                      <div className={cx("hItemInfo")}>
                        <div className={cx("hItemTitleName")}>Tên Món</div>
                        <div className={cx("hItemTitleOption")}>Tuỳ Chọn</div>
                        <div className={cx("hItemTitleQuantity")}>Số Lượng</div>
                      </div>

                      <div className={cx("hItemInfo")}>
                        <div className={cx("hItemName")}>BBB BBBBB BBB BBB</div>
                        <div className={cx("hItemOption")}>
                          <span>BB BB</span>
                        </div>
                        <div className={cx("hItemQuantity")}>B</div>
                      </div>

                    </div>
                    <div className={cx("hItemDetailWrapper")}>
                      <div className={cx("hItemDetail")}>
                        <div className={cx("hItemBuyerName")}>Khách Hàng: BBBBB</div>
                        <div className={cx("hItemTable")}>Bàn: B</div>
                        <div className={cx("hItemTime")}>
                          Thời Gian Tạo: <span style={{ color: "#f04d4d" }}>B:BB BB</span>
                        </div>
                        <div className={cx("hItemStatus")}>Trạng Thái:
                          {/* {cart.status === "IN_PROGRESS" && (<span style={{ color: "#3498db" }}>Đang Chờ</span>)} */}
                          {/* {cart.status === "COMPLETED" && (<span style={{ color: "#2ecc71" }}>Đã Xong</span>)} */}
                          {/* {cart.status === "CANCEL" && (<span style={{ color: "#f04d4d", textDecoration: "line-through" }}>Đã Huỷ</span>)} */}
                        </div>
                      </div>
                      <div className={cx("hItemTotalPrice")}>
                        Tổng Tiền: <span style={{ color: "#f04d4d" }}>BBBBBBBB vnđ</span>
                      </div>
                    </div>

                    <div className={cx("hItemButtonGroup")}>
                      <div className={cx("")}>
                        <button className={cx("cancelBillButton")}>Huỷ Đơn</button>
                      </div>
                      <div className={cx("")}>
                        <button className={cx("readyBillButton")}>Hoàn Thành</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>

            )}
            {(listCart.length !== 0 && listCart !== "No carts created") &&
              <div className={cx("hListBill")}>
                {listCart.map((cart, index) => (
                  <Fragment key={index}>
                    <div className={cx("hItem", cart.status)} key={index}>
                      <div className={cx("hItemContent")}>
                        <div className={cx("hItemInfo")}>
                          <div className={cx("hItemTitleName")}>Tên Món</div>
                          <div className={cx("hItemTitleOption")}>Tuỳ Chọn</div>
                          <div className={cx("hItemTitleQuantity")}>Số Lượng</div>
                        </div>
                        {cart.order.map((order, orderIndex) => (
                          <div className={cx("hItemInfo")} key={orderIndex}>
                            <div className={cx("hItemName")}>{order.dish_name}</div>
                            <div className={cx("hItemOption")}>
                              <span>{order.options}</span>
                            </div>
                            <div className={cx("hItemQuantity")}>{order.number}</div>
                          </div>
                        ))}
                      </div>
                      <div className={cx("hItemDetailWrapper")}>
                        <div className={cx("hItemDetail")}>
                          <div className={cx("hItemBuyerName")}>Khách Hàng: {cart.customer_name}</div>
                          <div className={cx("hItemTable")}>Bàn: {cart.table}</div>
                          <div className={cx("hItemTime")}>
                            Thời Gian Tạo: <span style={{ color: "#f04d4d" }}>{moment(cart.createAt, "DD/MM/YYYY, HH:mm:ss").format("HH:mm A")}</span>
                          </div>
                          <div className={cx("hItemStatus")}>Trạng Thái:
                            {cart.status === "IN_PROGRESS" && (<span style={{ color: "#3498db" }}>Đang Chờ</span>)}
                            {cart.status === "COMPLETED" && (<span style={{ color: "#2ecc71" }}>Đã Xong</span>)}
                            {cart.status === "CANCEL" && (<span style={{ color: "#f04d4d", textDecoration: "line-through" }}>Đã Huỷ</span>)}
                          </div>
                        </div>
                        <div className={cx("hItemTotalPrice")}>
                          Tổng Tiền: <span style={{ color: "#f04d4d" }}>{cart.total.toLocaleString()} vnđ</span>
                        </div>
                      </div>
                      {cart.status === "IN_PROGRESS" && (
                        <div className={cx("hItemButtonGroup")}>
                          <div className={cx("")}>
                            <button
                              className={cx("cancelBillButton")}
                              onClick={() => handleSetCancelBill(cart._id)}
                            >Huỷ Đơn</button>
                          </div>
                          <div className={cx("")}>
                            <button
                              className={cx("readyBillButton")}
                              onClick={() => handleSetDoneBill(cart._id)}
                            >Hoàn Thành</button>
                          </div>
                        </div>

                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            }

          </div>
          <div className={cx("hRightContainer")}>
            <div className={cx("hAllNotification")}>
              {listTenMin.length === 0 && (
                <div className={cx("hEmptyNotification")}>
                  Không có yêu cầu nào trong 10 phút
                </div>
              )}
              {requests
                .filter((request) => isWithin10Minutes(request.createdAt))
                .map((request, index) => (
                  <div
                    key={index}
                    className={cx("hNotification")}
                    onClick={() => handleNotificationClick(request)}>
                    <div className={cx("hInfo")}>
                      <div>Bàn {request.table}</div>
                      <div>{request.customer_name}</div>
                    </div>
                    <div>
                      {moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss").format(
                        "hh:mm A"
                      )}
                    </div>
                    <div
                      className={cx("redDot", {
                        redDotHided: !removeRedDot(request),
                      })}
                    ></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;

