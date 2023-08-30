import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames/bind";
import styles from "./Cart.scss";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function Cart() {
    const navigate = useNavigate();
    const [cartStored, setCartStored] = useState([]);
    const [pushData, setPushData] = useState({
        note: "",
        total: "",
        table: "",
        customer_name: "",
        order: [
            {
                dish_id: "",
                number: "",
                options: [], 
            },
        ],
    });
    let customer_name_session = sessionStorage.getItem("name") || [];
    let storedSession = JSON.parse(sessionStorage.getItem("obj")) || [];
    const tableStored = sessionStorage.getItem("table") || 0;

    const cashier = JSON.parse(localStorage.getItem("token_state"))

    useEffect(() => {
        setCartStored(storedSession);
    }, []);

    useEffect(() => {
        setPushData((prevState) => ({
            ...prevState,
            total: getTotalBill(),
            order: getOrderData(),
            table: tableStored,
            customer_name: customer_name_session,
        }));
    }, [cartStored, tableStored, customer_name_session]);

    const submitHandler = () => {
        if (cartStored.length === 0) {
            // Handle empty cart case if needed
        } else {
            axios
                .get(
                    `${process.env.REACT_APP_API_URL}/dish/menu/activedByCashier/64ec7b6688d76eb8fbefae41`
                )
                .then((response) => {
                    const availableDishes = response.data;
                    const unavailableItems = [];
                    for (const cartItem of cartStored) {
                        const totalQuantity = cartStored.reduce((total, item) => {
                            if (item.id === cartItem.id) {
                                return total + item.number;
                            }
                            return total;
                        }, 0);
                        const activeItem = availableDishes.find(
                            (item) => item._id === cartItem.id
                        );

                        if (!activeItem || activeItem.amount < totalQuantity) {
                            unavailableItems.push(cartItem);
                        }
                    }

                    if (unavailableItems.length > 0) {
                        const firstUnavailableItem = unavailableItems[0];
                        const foodFailName = firstUnavailableItem.name;
                        const amountRemain =
                            availableDishes.find(
                                (item) => item._id === firstUnavailableItem.id
                            )?.amount || 0;

                        // Handle the case where some items are unavailable
                    } else {
                        axios
                            .post(
                                `${process.env.REACT_APP_API_URL}/cart/create/64ec7b6688d76eb8fbefae41`,
                                pushData
                            )
                            .then((response) => {
                                // Handle the successful response from the server
                                console.log(response);
                                sessionStorage.clear();
                                navigate("/sortedbytable")
                            })
                            .catch((error) => {
                                // Handle the error response from the server
                                console.log(error);
                            });
                    }
                })
                .catch((error) => {
                    // Handle the error response from the server
                    console.log(error);
                });
        }
    };

    const getTotalBill = () => {
        return cartStored.reduce(
            (total, food) => total + food.price * food.number,
            0
        );
    };
    const getOrderData = () => {
        return cartStored.map((food) => ({
            dish_id: food.id,
            number: food.number,
            options: food.options,
        }));
    };

    const deleteCartHandle = () => {
        sessionStorage.clear();
        navigate("/")
    }

    const removeFromObj = (itemId) => {
        const updatedCart = cartStored.filter(item => item.id !== itemId);
        setCartStored(updatedCart);
    
        // Update the session storage
        sessionStorage.setItem("obj", JSON.stringify(updatedCart));
    }

    return (
        <Fragment>
            <div className={cx("cartWrapper")}>
                <div className={cx("blackBar")}>
                    <div className={cx("TopBar")}>
                        <div className={cx("cartTopBar")}>
                            <div className={cx("cartDeleteBill")} onClick={deleteCartHandle}>Huỷ/Xoá Hoá Đơn</div>
                            <div className={cx("cartSendBill")} onClick={submitHandler}>
                                Gửi Hoá Đơn
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx("mBody")}>
                    {cartStored.map((food, index) => (
                        <div className={cx("cartItem")} key={index}>
                            <div className={cx("imageBorder")}>
                                <img className={cx("")} src={food.img} alt="Dish" />
                            </div>
                            <div className={cx("infoBox")}>
                                <div className={cx("name")}>Tên Món: {food.name}</div>
                                <div className={cx("options")}>Tuỳ Chọn: {food.options}</div>
                                <div className={cx("number")}>Số Lượng: {food.number}</div>
                                <div className={cx("price")}>Đơn Giá:
                                    {" " + food.price.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}</div>
                            </div>
                            <div className={cx("deleteItem")} onClick={() => removeFromObj(food.id)}>Xóa</div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
}

export default Cart;
