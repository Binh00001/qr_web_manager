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
    const [choosedTime, setChoosedTime] = useState("time=360");
    const [totalBillInProgress, setTotalBillInProgress] = useState("")
    const [cartStatusChange, setCartStatusChange] = useState(true);


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
    //admin check
    //   useEffect(() => {
    //     if (isAdmin === "admin") {
    //       navigate(`/bill`);
    //     }
    //   }, [isAdmin, navigate]);

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
    }, [cartStatusChange, newCart, choosedTime]);

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
        console.log(value);
    }

    return (
        <Fragment>
            <Fragment>
                <div className={cx("GroupBox")}>
                    <div className={cx("firstGroup")}>
                        {tables.filter(table => ["1", "2", "3"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={cx("secondGroup")}>
                        {tables.filter(table => ["4", "5", "6"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={cx("thirdGroup")}>
                        {tables.filter(table => ["7"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={cx("fourthGroup")}>
                        {tables.filter(table => ["8"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={cx("fifthGroup")}>
                        {tables.filter(table => ["9", "10"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className={cx("sixthGroup")}>
                        {tables.filter(table => ["11", "12", "13"].includes(table.name))
                            .map((table, index) => (
                                <div className={cx("sbtItem", `table${table.name}`)} key={index} onClick={() => { handleClickTableName(table.name) }}>
                                    <div className={cx("sbtIconBorder")}>
                                        <div className={cx("sbtName")}>{table.name}</div>
                                        <div className={cx("reddot")}></div>
                                        <img src={tableIcon} alt="Table"></img>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Fragment>
        </Fragment>
    )
}

export default SortedByTable;
