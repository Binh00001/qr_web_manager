import { Fragment, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import Loading from "~/components/loadingScreen/loadingScreen";
import TableActive from "~/components/TableActive";
import { useIsAdminContext, useReddotShowContext, useBillInProgress } from "~/App";

import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  const showReddot = useReddotShowContext();
  const billInProgress = useBillInProgress();
  const [requests, setRequests] = useState([]);
  const [listTenMin, setListTenMin] = useState([]);
  const [reload, setReload] = useState(false);
  const [newCallStaff, setNewCallStaff] = useState([]);
  const [newCart, setNewCart] = useState([]);
  const [listCart, setListCart] = useState([]);
  const [readRequestIds, setReadRequestIds] = useState([]);
  const [cartStatusChange, setCartStatusChange] = useState(true);
  const [tableActive, setTableActive] = useState(false);
  const [callStaff, setCallStaff] = useState(false);
  const [choosedTime, setChoosedTime] = useState("time=60");

  const navigate = useNavigate();
  const currentDate = new Date();
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
      setNewCallStaff(response);
    });
    socket.on("newCart", (response) => {
      setNewCart(response);
    });
  }, []);

  useEffect(() => {
    if (isAdmin === "admin") {
      navigate(`/bill`);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${cashier.cashierId}?${choosedTime}`
        )
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
  }, [cartStatusChange, newCart, choosedTime]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/call-staff/all/${cashier.cashierId}?time=3360`
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
  }, [newCallStaff]);

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

  const handleNotificationClick = (request) => {
    setReadRequestIds((prevIds) => [...prevIds, request._id]);
  };

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
      .put(
        `${process.env.REACT_APP_API_URL}/cart/status/${cartId}`,
        { status: "COMPLETED" },
        config
      )
      .then((response) => {
        console.log("Cart marked as complete:", response.data);
        setCartStatusChange(!cartStatusChange);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSetCancelBill = (cartId) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/cart/status/${cartId}`,
        { status: "CANCEL" },
        config
      )
      .then((response) => {
        console.log("Cart marked as complete:", response.data);
        setCartStatusChange(!cartStatusChange);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGetTimeFilter = (value) => {
    if (value) {
      setChoosedTime(value);
    } else {
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const formattedCurrentDate = `${day}/${month}/${year}`;
      setChoosedTime(`date=${formattedCurrentDate}`);
    }
  };

  const handleOpenFunction = (value) => {
    if (value === "CheckBill") {
      setTableActive(false);
      setCallStaff(false);
    } else if (value === "CallStaff") {
      setCallStaff(true);
      setTableActive(false);
    } else if (value === "TableManager") {
      setTableActive(true);
      setCallStaff(false);
    }
  };

  const handleRequestCheck = (request) => {
    const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();
    console.log(timeDifference <= 1);
    return (timeDifference <= 1);
  }

  return (
    <Fragment>
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("hContainer")}>
              <div
                className={cx("hText", {
                  onActive: !tableActive && !callStaff,
                })}
              >
                <div
                  className={cx("redDot", {
                    redDotHided: !billInProgress,
                  })}
                ></div>
                <button
                  onClick={() => {
                    handleOpenFunction("CheckBill");
                  }}
                >
                  Quản Lý Hoá Đơn
                </button>
              </div>
              <div className={cx("hText", { onActive: callStaff })}>
                <div
                  className={cx("redDot", {
                    redDotHided: !showReddot,
                  })}
                ></div>
                <button
                  onClick={() => {
                    handleOpenFunction("CallStaff");
                  }}
                >
                  Quản Lý Yêu Cầu
                </button>
              </div>
              <div className={cx("hText", { onActive: tableActive })}>
                <button
                  onClick={() => {
                    handleOpenFunction("TableManager");
                  }}
                >
                  Quản Lý Bàn
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={cx("hBody")}>
          {!tableActive && !callStaff && (
            <Fragment>
              <div className={cx("hBillContainer")}>
                <nav className={cx("timeFilterBar")}>
                  <button
                    className={cx("timeFilterItem", {
                      active: choosedTime === "time=60",
                    })}
                    onClick={() => {
                      handleGetTimeFilter("time=60");
                    }}
                  >
                    1 Giờ
                  </button>
                  <button
                    className={cx("timeFilterItem", {
                      active: choosedTime === "time=360",
                    })}
                    onClick={() => {
                      handleGetTimeFilter("time=360");
                    }}
                  >
                    6 Giờ
                  </button>
                  <button
                    className={cx("timeFilterItem", {
                      active: !choosedTime.startsWith("time="),
                    })}
                    onClick={() => {
                      handleGetTimeFilter();
                    }}
                  >
                    Hôm Nay
                  </button>
                </nav>
                {(listCart === "No carts created" || listCart.length === 0) && (
                  <Fragment>
                    <div className={cx("NoCartsNotification")}>
                      Hiện Chưa Có Đơn
                    </div>
                  </Fragment>
                )}
                {listCart.length !== 0 && listCart !== "No carts created" && (
                  <div className={cx("hListBill")}>
                    {listCart.map((cart, index) => (
                      <Fragment key={index}>
                        <div className={cx("hItem", cart.status)} key={index}>
                          <div className={cx("hItemContent")}>
                            <div className={cx("hItemInfo")}>
                              <div className={cx("hItemTitleName")}>
                                Tên Món
                              </div>
                              <div className={cx("hItemTitleOption")}>
                                Tuỳ Chọn
                              </div>
                              <div className={cx("hItemTitleQuantity")}>
                                Số Lượng
                              </div>
                            </div>
                            {cart.order.map((order, orderIndex) => (
                              <div className={cx("hItemInfo")} key={orderIndex}>
                                <div className={cx("hItemName")}>
                                  {order.dish_name}
                                </div>
                                <div className={cx("hItemOption")}>
                                  <span>{order.options}</span>
                                </div>
                                <div className={cx("hItemQuantity")}>
                                  {order.number}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className={cx("hItemDetailWrapper")}>
                            <div className={cx("hItemDetail")}>
                              <div className={cx("hItemBuyerName")}>
                                Khách Hàng: {cart.customer_name}
                              </div>
                              <div className={cx("hItemTable")}>
                                Bàn: {cart.table}
                              </div>
                              <div className={cx("hItemTime")}>
                                Thời Gian Tạo:{" "}
                                <span style={{ color: "#f04d4d" }}>
                                  {moment(
                                    cart.createAt,
                                    "DD/MM/YYYY, HH:mm:ss"
                                  ).format("HH:mm A")}
                                </span>
                              </div>
                              <div className={cx("hItemStatus")}>
                                Trạng Thái:
                                {cart.status === "IN_PROGRESS" && (
                                  <span style={{ color: "#3498db" }}>
                                    Đang Chờ
                                  </span>
                                )}
                                {cart.status === "COMPLETED" && (
                                  <span style={{ color: "#2ecc71" }}>
                                    Đã Xong
                                  </span>
                                )}
                                {cart.status === "CANCEL" && (
                                  <span
                                    style={{
                                      color: "#f04d4d",
                                      textDecoration: "line-through",
                                    }}
                                  >
                                    Đã Huỷ
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={cx("hItemTotalPrice")}>
                              Tổng Tiền:{" "}
                              <span style={{ color: "#f04d4d" }}>
                                {cart.total.toLocaleString()} vnđ
                              </span>
                            </div>
                          </div>
                          {cart.status === "IN_PROGRESS" && (
                            <div className={cx("hItemButtonGroup")}>
                              <div className={cx("")}>
                                <button
                                  className={cx("cancelBillButton")}
                                  onClick={() => handleSetCancelBill(cart._id)}
                                >
                                  Huỷ Đơn
                                </button>
                              </div>
                              <div className={cx("")}>
                                <button
                                  className={cx("readyBillButton")}
                                  onClick={() => handleSetDoneBill(cart._id)}
                                >
                                  Hoàn Thành
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </Fragment>
          )}
          {callStaff && (
            <Fragment>
              <div className={cx("hCallStaffContainer")}>
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
                        onClick={() => handleNotificationClick(request)}
                      >
                        <div className={cx("hInfo")}>
                          <div>Bàn {request.table}</div>
                          <div>{request.customer_name}</div>
                        </div>
                        <div>
                          {moment(
                            request.createdAt,
                            "DD/MM/YYYY, HH:mm:ss"
                          ).format("hh:mm A")}
                        </div>
                        <div
                          className={cx("redDot", {
                            redDotHided: (!handleRequestCheck(request)),
                          })}
                        ></div>
                      </div>
                    ))}
                </div>
              </div>
            </Fragment>
          )}
          {tableActive && (
            <Fragment>
              <TableActive></TableActive>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
