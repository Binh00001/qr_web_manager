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

import extendArrow from "~/components/assets/image/extend down arrow.png"
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
    const [tablePicked, setTablePicked] = useState([]);
    const [choosedTime, setChoosedTime] = useState("time=3600");
    const [totalBillInProgress, setTotalBillInProgress] = useState("0");
    const [totalBillWaitPay, setTotalBillWaitPay] = useState("0");
    const [choosedStatus, setChoosedStatus] = useState("IN_PROGRESS");
    const [cartStatusChange, setCartStatusChange] = useState(true);
    const [showTotalPayBill, setShowTotalPayBill] = useState(true);
    const [cartPaidChange, setCartPaidChange] = useState(true);
    const [showTableMap, setShowTableMap] = useState(true);
    const [showImage, setShowImage] = useState("");

    const navigate = useNavigate();
    const currentDate = new Date();

    const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    //handle setting for staff / manager
    useEffect(() => {
        if (isAdmin === "MANAGER") {
            setChoosedStatus("IN_PROGRESS")
        } else if (isAdmin === "STAFF") {
            setChoosedStatus("WAITPAY")
            setShowTotalPayBill(false)
        }
    }, [isAdmin])

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
        setShowImage("")
        const fetchData = () => {
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/cart/menu/allByCashier/${cashier.group_id}?${choosedTime}`
                )
                .then((response) => {
                    if (response.data.length !== 0 && response.data !== "No carts created") {
                        setListCart(response.data);
                        response.data.forEach((cart) => {
                            const inProgressCarts = response.data.filter(cart => cart.status === "IN_PROGRESS");
                            setTotalBillInProgress(inProgressCarts.length);
                            const waitPayCart = response.data.filter(cart => cart.status === "WAITPAY");
                            setTotalBillWaitPay(waitPayCart.length)
                        })
                        if (tablePicked.length !== 0) {
                            setListCartPicked(response.data.filter(cart => (cart.table === tablePicked && cart.status === choosedStatus)))
                        }
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
    }, [cartStatusChange, newCart, cartPaidChange, choosedStatus, tablePicked]);

    //get tablelist
    useEffect(() => {
        axios
            // .get(`http://117.4.194.207:3003/table/allByCashier/%{cashier.id}`)
            .get(
                `${process.env.REACT_APP_API_URL}/table/allByCashier/${cashier.group_id}`
            )
            .then((response) => {
                setTables(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleClickTableName = (value) => {
        setTablePicked(value)
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

    const calcBillWaitPay = (tableName) => {
        if (listCart.filter(cart => (cart.table === tableName && cart.status === "WAITPAY")).length === 0) {
            return 0
        } else if (listCart.filter(cart => (cart.table === tableName && cart.status === "WAITPAY")).length < 99) {
            return listCart.filter(cart => (cart.table === tableName && cart.status === "WAITPAY")).length
        } else {
            return "99+"
        }
    }

    // Inside the handleSetPaidBill function
    const handleSetPaidBill = (cartId) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/cart/payByStaff/${cartId}`,
                { "staffId" : cashier.cashierId },
            )
            .then((response) => {
                setCartPaidChange(prevCartPaidChange => !prevCartPaidChange);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSetDoneBill = (cartId) => {
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/cart/status/${cartId}`,
                { status: "COMPLETED" },
                config
            )
            .then((response) => {
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
                setCartStatusChange(!cartStatusChange);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleGetStatusFilter = (value) => {
        setChoosedStatus(value)
    }

    const handleReturnToTableMap = () => {
        setShowTableMap(true)
        setTablePicked([])
        setListCartPicked([])
        setShowImage("")
        if (isAdmin === "MANAGER") {
            setChoosedStatus("IN_PROGRESS")
        } else if (isAdmin === "STAFF") {
            setChoosedStatus("WAITPAY")
        }
    }

    const handleShowImage = (id) => {
        if (showImage !== id) {
            setShowImage(id)
        } else if (showImage === id) {
            setShowImage("")
        }
    }

    return (
        <Fragment>
            <Fragment>
                <div className={cx("sbtBlackBar")}>
                    {isAdmin === "MANAGER" && (
                        <Fragment>
                            {!showTableMap && (
                                <Fragment>
                                    <div className={cx("sbtBlackBarItem")} onClick={() => { handleReturnToTableMap() }}>
                                        Trở lại
                                    </div>
                                    <div className={cx("sbtBlackBarText")}>
                                        còn <span>{totalBillInProgress}</span> Đơn đang chờ
                                    </div>
                                </Fragment>
                            )}
                            {showTableMap && (
                                <Fragment>
                                    <button id="switchShowPayBill" onClick={() => setShowTotalPayBill(!showTotalPayBill)}>
                                        Đơn Chưa Thu: {showTotalPayBill ? "Số Lượng" : "Giá Tiền"}
                                    </button>
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                    {isAdmin === "STAFF" && (
                        <Fragment>
                            {!showTableMap && (
                                <Fragment>
                                    <div className={cx("sbtBlackBarItem")} onClick={() => { handleReturnToTableMap() }}>
                                        Trở lại
                                    </div>
                                    <div className={cx("sbtBlackBarText")}>
                                        còn <span>{totalBillWaitPay}</span> Đơn Chưa Thu Tiền
                                    </div>
                                </Fragment>
                            )}
                            {/* {showTableMap && (
                                <Fragment>
                                    <div className={cx("sbtBlackBarText")}>
                                        Hiện đang có <span>{totalBillWaitPay}</span> Đơn Chưa Thu Tiền
                                    </div>
                                </Fragment>
                            )} */}
                        </Fragment>
                    )}
                </div>
                {showTableMap && (
                    <Fragment>

                        <div className={cx("GroupBox")}>
                            <div className={cx("firstGroup")}>
                                {tables.filter(table => ["1", "2", "3"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>


                            <div className={cx("secondGroup")}>
                                {tables.filter(table => ["4", "5", "6"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className={cx("thirdGroup")}>
                                {tables.filter(table => ["7"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div className={cx("totalBillText")}>
                                    Còn<span>{" " + totalBillWaitPay + " "}</span> Đơn Chưa Thu Tiền
                                </div>
                            </div>

                            <div className={cx("fourthGroup")}>
                                {tables.filter(table => ["8"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div className={cx("totalBillText")}>
                                    Có <span>{" " + totalBillInProgress + " "}</span> Đơn Đang Chờ
                                </div>
                            </div>

                            <div className={cx("fifthGroup")}>
                                {tables.filter(table => ["9", "10"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            <div className={cx("sixthGroup")}>
                                {tables.filter(table => ["11", "12", "13"].includes(table.name))
                                    .map((table, index) => {
                                        const hasAddEffect1 = calcBillInProGress(table.name) !== 0;
                                        const hasAddEffect2 = calcBillWaitPay(table.name) !== 0;
                                        const className = cx(
                                            "sbtItem",
                                            `table${table.name}`,
                                            hasAddEffect1 ? "addEffect1" : "",
                                            hasAddEffect2 ? "addEffect2" : "",
                                            hasAddEffect1 && hasAddEffect2 ? "addEffect3" : ""
                                        );

                                        return (
                                            <div
                                                className={className}
                                                key={index}
                                                onClick={() => { handleClickTableName(table.name) }}
                                            >
                                                <div className={cx("sbtIconBorder")}>
                                                    <div className={cx("sbtName")}>{table.name}</div>
                                                    <div className={cx("reddot", !hasAddEffect1 ? "hided" : "")}>
                                                        {hasAddEffect1 ? calcBillInProGress(table.name) : ""}
                                                    </div>
                                                    <div className={cx("Paydot", !hasAddEffect2 ? "hided" : "")}>
                                                        {!showTotalPayBill && (
                                                            <Fragment>
                                                                {listCart
                                                                    .filter(cart => cart.table === table.name && cart.status === "WAITPAY")
                                                                    .map((cartItem, cartIndex) => (
                                                                        <div key={cartIndex}>
                                                                            {new Intl.NumberFormat("vi-VN").format(cartItem.total / 1000)}K
                                                                        </div>
                                                                    ))}
                                                            </Fragment>
                                                        )}
                                                        {showTotalPayBill && (
                                                            <span>{calcBillWaitPay(table.name)}</span>
                                                        )}
                                                    </div>
                                                    <img src={tableIcon} alt="Table" />
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                            active: choosedStatus === "WAITPAY",
                                        })}
                                        onClick={() => {
                                            handleGetStatusFilter("WAITPAY");
                                        }}
                                    >
                                        Chưa Thu Tiền
                                    </button>
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
                                                                <div className={cx("hItemTable")}>
                                                                    Thanh Toán: {cart.paymentMethod === "BANK" && "Chuyển Khoản"}
                                                                    {cart.paymentMethod === "CASH" && "Tiền Mặt"}
                                                                </div>
                                                                {cart.paymentMethod === "CASH" && (
                                                                    <div className={cx("hItemTable")}>
                                                                        Nhân Viên: {cart.paymentStaff}

                                                                    </div>
                                                                )}
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
                                                                    {cart.status === "WAITPAY" && (
                                                                        <span style={{ color: "#3498db" }}>
                                                                            CHỜ THU TIỀN
                                                                        </span>
                                                                    )}
                                                                    {cart.status === "IN_PROGRESS" && (
                                                                        <span style={{ color: "#3498db" }}>
                                                                            Đang Làm
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
                                                                Tổng:{" "}
                                                                <span style={{ color: "#f04d4d" }}>
                                                                    {cart.total.toLocaleString()} vnđ
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isAdmin === "MANAGER" && (
                                                            <Fragment>
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
                                                            </Fragment>
                                                        )}
                                                        {/* {isAdmin === "STAFF" && ( */}
                                                            <Fragment>
                                                                {cart.status === "WAITPAY" && (
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
                                                                                id="PayButton"
                                                                                className={cx("readyBillButton")}
                                                                                onClick={() => handleSetPaidBill(cart._id)}
                                                                            >
                                                                                THU TIỀN
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Fragment>
                                                        {/* )} */}
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
