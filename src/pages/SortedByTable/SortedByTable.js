import { Fragment, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import classNames from "classnames";
import styles from "~/pages/SortedByTable/SortedByTable.scss";
import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { useIsAdminContext, useReddotShowContext, useBillInProgress } from "~/App";
import "moment/locale/vi";

import tableIcon from "~/components/assets/image/dinning-table.png"

const cx = classNames.bind(styles);

function SortedByTable() {
    const showReddot = useReddotShowContext();
    const billInProgress = useBillInProgress();
    const isAdmin = useIsAdminContext();

    const [tables, setTables] = useState([]);
    const [newCallStaff, setNewCallStaff] = useState([]);
    const [newCart, setNewCart] = useState([]);
    const [listCart, setListCart] = useState([]);
    const [listCartPicked, setListCartPicked] = useState([]);
    const [choosedTime, setChoosedTime] = useState("time=3600");
    const [totalBillInProgress, setTotalBillInProgress] = useState("0");
    const [choosedStatus, setChoosedStatus] = useState("IN_PROGRESS");
    const [cartStatusChange, setCartStatusChange] = useState(true);
    const [showTableMap, setShowTableMap] = useState(true);

    const navigate = useNavigate();
    const currentDate = new Date();

    const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    //socket
    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_URL);

        socket.on("newCallStaff", (response) => {
            setNewCallStaff(response);
        });
        socket.on("newCart", (response) => {
            setNewCart(response);
        });
    }, []);

    //get listcart, get toltal bill in progress
    useEffect(() => {
        const fetchData = () => {
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${cashier.cashierId}?${choosedTime}`
                )
                .then((response) => {
                    setListCart(response.data);
                    if (response.data.length !== 0 && response.data !== "No carts created") {
                        response.data.forEach((cart) => {
                            const inProgressCarts = response.data.filter(cart => cart.status === "IN_PROGRESS");
                            setTotalBillInProgress(inProgressCarts.length);
                        })
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
    }, [cartStatusChange, newCart]);

    useEffect(() => {
        axios
            // .get(`http://117.4.194.207:3003/table/allByCashier/%{cashier.id}`)
            .get(
                `${process.env.REACT_APP_API_URL}/table/allByCashier/${cashier.cashierId}`
            )
            .then((response) => {
                setTables(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleClickTableName = (value) => {
        setShowTableMap(false)
        setListCartPicked(listCart.filter(cart => (cart.table === value)))
    }

    const calcBillInProGress = (tableName) => {
        if (listCart.filter(cart => (cart.table === tableName && cart.status === "IN_PROGRESS")).length === 0) {
            return 0
        } else if (listCart.filter(cart => (cart.table === tableName && cart.status === "IN_PROGRESS")).length < 99) {
            return listCart.filter(cart => (cart.table === tableName && cart.status === "IN_PROGRESS")).length
        } else {
            return "99+"
        }
    }

    const handleSetDoneBill = (cartId) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/cart/status/${cartId}`,
                { status: "COMPLETED" },
                config
            )
            .then((response) => {
                // console.log("Cart marked as complete:", response.data);
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

    const handleGetStatusFilter = (value) => {
        if (value) {
            setChoosedStatus(value)
        } else {

        }
    }

    const handleReturnToTableMap = () => {
        setShowTableMap(true)
        setListCartPicked([])
        setChoosedStatus("IN_PROGRESS")
    }

    return (
        <Fragment>
            <Fragment>
                <div className={cx("sbtBlackBar")}>
                    {!showTableMap && (
                        <Fragment>
                            <div className={cx("sbtBlackBarItem")} onClick={() => {handleReturnToTableMap()}}>
                                Trở lại
                            </div>
                            <div className={cx("sbtBlackBarText")}>
                                còn <span>{totalBillInProgress}</span> Đơn đang chờ
                            </div>
                        </Fragment>
                    )}
                    {showTableMap && (
                        <Fragment>
                            <div className={cx("sbtBlackBarText")}>
                                Hiện đang có <span>{totalBillInProgress}</span> Đơn đang chờ
                            </div>

                        </Fragment>
                    )}
                </div>
                {showTableMap && (
                    <Fragment>

                        <div className={cx("GroupBox")}>
                            <div className={cx("firstGroup")}>
                                {tables.filter(table => ["1", "2", "3"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className={cx("secondGroup")}>
                                {tables.filter(table => ["4", "5", "6"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className={cx("thirdGroup")}>
                                {tables.filter(table => ["7"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className={cx("fourthGroup")}>
                                {tables.filter(table => ["8"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className={cx("fifthGroup")}>
                                {tables.filter(table => ["9", "10"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className={cx("sixthGroup")}>
                                {tables.filter(table => ["11", "12", "13"].includes(table.name))
                                    .map((table, index) => (
                                        <div className={cx("sbtItem", `table${table.name}`, calcBillInProGress(table.name) === 0 ? "" : "addEffect")} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                            <div className={cx("sbtIconBorder")}>
                                                <div className={cx("sbtName")}>{table.name}</div>
                                                <div className={cx("reddot", calcBillInProGress(table.name) === 0 ? "hided" : "")}>{calcBillInProGress(table.name)}</div>
                                                <img src={tableIcon} alt="Table"></img>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Fragment>
                )}
                {!showTableMap && (
                    <Fragment>
                        <div className={cx("hBody")}>
                            <div className={cx("hBillContainer")}>
                                <nav className={cx("sbtFilterBar")}>
                                    <button
                                        className={cx("sbtFilterItem", {
                                            active: choosedStatus === "IN_PROGRESS",
                                        })}
                                        onClick={() => {
                                            handleGetStatusFilter("IN_PROGRESS")
                                        }}
                                    >
                                        Đang Làm
                                    </button>
                                    <button
                                        className={cx("sbtFilterItem", {
                                            active: choosedStatus === "COMPLETED",
                                        })}
                                        onClick={() => {
                                            handleGetStatusFilter("COMPLETED");
                                        }}
                                    >
                                        Đã Hoàn Thành
                                    </button>
                                    <button
                                        className={cx("sbtFilterItem", {
                                            active: choosedStatus === "CANCEL",
                                        })}
                                        onClick={() => {
                                            handleGetStatusFilter("CANCEL");
                                        }}
                                    >
                                        Đã Huỷ
                                    </button>
                                </nav>

                                {(listCartPicked === "No carts created" || listCartPicked.length === 0) && (
                                    <Fragment>
                                        <div className={cx("NoCartsNotification")}>
                                            Hiện Chưa Có Đơn
                                        </div>
                                    </Fragment>
                                )}
                                {listCartPicked.length !== 0 && listCart !== "No carts created" && (
                                    <div className={cx("hListBill")}>
                                        {listCartPicked
                                            .filter(cart => cart.status === choosedStatus)
                                            .map((cart, index) => (
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
                        </div>
                    </Fragment>
                )}
            </Fragment>
        </Fragment>
    )
}

export default SortedByTable;
