import { Fragment, useEffect, useRef } from "react";
import io from 'socket.io-client';
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState } from "react";
import axios from "axios";
import tabelNonActive from "~/components/assets/image/table_and_chair_non_active.png";
import tabelActive from "~/components/assets/image/table_and_chair_active.png";
import moment from "moment";
import Loading from "~/components/loadingScreen/loadingScreen"
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  // const [tables, setTables] = useState([]);

  const [requests, setRequests] = useState([]);
  const [listTenMin, setListTenMin] = useState([]);
  const [isNewRequest, setIsNewRequest] = useState([]);
  // const [clickAddTable, setClickAddTable] = useState(true);
  // const [tableNewNumber, setTableNewNumber] = useState({ table: "" });
  // const [tableChanged, setTableChanged] = useState(false);
  const [listCart, setListCart] = useState([]);
  const [readRequestIds, setReadRequestIds] = useState([]);


  const currentDate = new Date();
  const areRequestsOrListTenMinEmpty = () => {
    return requests.length === 0 && listTenMin.length === 0;
  };

  const [showContent, setShowContent] = useState(!areRequestsOrListTenMinEmpty());



  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on('newCallStaff', (response) => {
      setIsNewRequest(response)
      // console.log(isNewRequest._id);
    });
  }, []);

  useEffect(() => {

    const fetchData = () => {
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const year = currentDate.getFullYear();
      // Create the formatted date string
      const formattedCurrentDate = `${day}/${month}/${year}`;
      axios
        .get(`http://117.4.194.207:3003/cart/menu/all?date=${formattedCurrentDate}`)
        .then((response) => {
          setListCart(response.data);
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
  }, []);


  // useEffect(() => {
  //   axios
  //     // .get("http://117.4.194.207:3003/table/all")
  //     .get(`${process.env.REACT_APP_API_URL}/table/all`)
  //     .then((response) => {
  //       setTables(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [tableChanged]);

  useEffect(() => {
    const fetchData = () => {
      axios
        // .get("http://117.4.194.207:3003/call-staff/all?time=60")
        .get(`${process.env.REACT_APP_API_URL}/call-staff/all?time=60`)
        .then((response) => {
          const newRequests = response.data;
          setRequests(newRequests);
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
      console.log(timeDifference);
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

  // const removeRedDot = (request) => {
  //   if (requests.length > 0 && request) {
  //     // If the 'createdAt' property is missing in 'request', provide a default value.
  //     // Here, we set it to the current time (moment()).
  //     const createdAt = request.createdAt || moment().format("DD/MM/YYYY, HH:mm:ss");

  //     const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
  //     const currentTime = moment();
  //     const timeDifference = moment
  //       .duration(currentTime.diff(requestTime))
  //       .asMinutes();
  //     return timeDifference <= 1;
  //   }
  //   return false;
  // };

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
  };


  // const handleAddTable = () => {
  //   if (tables.some((table) => table.name === tableNewNumber.table)) {
  //     alert("Bàn này đã được tạo rồi");
  //     return;
  //   }
  //   axios
  //     .post(`${process.env.REACT_APP_API_URL}/table/create`, {
  //       name: tableNewNumber.table,
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //       const updatedNewTable = response.data;
  //       setClickAddTable(!clickAddTable);
  //       setTableNewNumber({ table: "" });
  //       setTableChanged(!tableChanged);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const changeHandler = (e) => {
  //   setTableNewNumber({ [e.target.name]: e.target.value });
  // };
  // const { table } = tableNewNumber;

  // const clickHandler = (table) => {
  //   const updatedTable = {
  //     isActive: !table.isActive,
  //   };
  //   axios
  //     .put(`${process.env.REACT_APP_API_URL}/table/active/${table.name}`, updatedTable)
  //     .then((response) => {
  //       const updatedTable = response.data;
  //       setTables((prevTables) => {
  //         const updatedTables = prevTables.map((prevTable) => {
  //           if (prevTable.name === updatedTable.name) {
  //             return updatedTable;
  //           }
  //           return prevTable;
  //         });
  //         return updatedTables;
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const isWithin10Minutes = (createdAt) => {
    const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();

    return timeDifference <= 10;
  };

  // if (showContent) {
  //   return <div>{<Loading />}</div>;
  // }

  console.log(listCart.length);

  return (
    <Fragment>
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("hLeftContainer")}>
              {/* <div className={cx("hText")}>Tất Cả Các Bàn:</div> */}
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
            {listCart.length !== 0 &&
              <div className={cx("hListBill")}>
                {listCart.map((cart, index) => (
                  <div className={cx("hItem")} key={index}>
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
                      {/* <div className={cx("hItemName")}>ID: {cart._id}</div> */}
                      {/* <div className={cx("hItemQuantity")}>Bàn: {cart.table}</div> */}
                      {/* <div className={cx("hItemNote")}>Ghi Chú: {cart.note}</div> */}
                      {/* <div className={cx("hItemOption")}>
                              </div> */}

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
                          {/* {cart.status === "COMPLETE" && (<span style={{ color: "#2ecc71" }}>Đã Xong</span>)} */}
                          {cart.status === "CANCEL" && (<span style={{ color: "#f04d4d", textDecoration: "line-through" }}>Đã Huỷ</span>)}
                        </div>
                      </div>
                      <div className={cx("hItemTotalPrice")}>
                        Tổng Tiền: <span style={{ color: "#f04d4d" }}>{cart.total.toLocaleString()} vnđ</span>
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
                ))}
              </div>
            }

            {/* <div className={cx("hAllTable")}>
              {tables.map((table, index) => (
                <button
                  onClick={() => clickHandler(table)}
                  key={index}
                  className={cx("table")}
                >
                  {table.isActive && <img src={tabelActive} alt="Table"></img>}
                  {!table.isActive && <img src={tabelNonActive} alt="Table"></img>}
                  <p>{table.name}</p>
                </button>
              ))}
              {clickAddTable && (
                <button
                  onClick={() => setClickAddTable(!clickAddTable)}
                  className={cx("hAddTable")}
                >
                  <p>+</p>
                </button>
              )}
              {!clickAddTable && (
                <Fragment>
                  <div className={cx("hAddTableBox")}>
                    <input
                      id="table"
                      type="text"
                      name="table"
                      // value={amount}
                      onChange={changeHandler}
                      placeholder="Số Bàn:..."
                      required
                    ></input>
                    {table && (
                      <div
                        className={cx("hAcpBtn")}
                        // onClick={() => submitAddAmountHandler(food._id)}
                        onClick={handleAddTable}
                      >
                        <p>OK</p>
                      </div>
                    )}
                    {!table && (
                      <div
                        className={cx("hAcpBtn")}
                        onClick={() => setClickAddTable(!clickAddTable)}
                      // onClick={handleAddTable}
                      >
                        <p>Huỷ</p>
                      </div>
                    )}
                  </div>
                </Fragment>
              )}
            </div> */}
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
                    // onClick={() => handleNotificationClick(request)} // Call the click handler here
                  >
                    <div className={cx("hInfo")}>
                      <div>Bàn {request.table}</div>
                      <div>{request.customer_name}</div>
                    </div>
                    <div>{moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss").format("hh:mm A")}</div>
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
