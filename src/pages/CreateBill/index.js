import { Fragment, useEffect, useState, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/CreateBill/CreateBill.scss"
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

function CreateBill() {
    const [cartNumber, setCartNumber] = useState(0);
    const [userName, setUserName] = useState(sessionStorage.getItem("name") || "");
    const [tableName, setTableName] = useState(sessionStorage.getItem("table") || "");
    const [category, setCategory] = useState([]);
    const [listDish, setListDish] = useState([]);
    const [type, setType] = useState(null);
    const [needInfo, setNeedInfo] = useState(false);
    const [add, setAdd] = useState(false);
    const [reload, setReload] = useState(false);
    const [addFood, setAddFood] = useState(false);
    const [overlay, setOverlay] = useState(false);
    const [notEnoughQuantity, setNotEnoughQuantity] = useState(false);
    const [addInfo, setAddInfo] = useState(false);
    const [obj, setObj] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [check, setCheck] = useState("");
    const [foodFailName, setFoodFailName] = useState("");
    const [amoutRemain, setAmountRemain] = useState(0);
    const arrayFood = [];

    const navigate = useNavigate();

    const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    useEffect(() => {
        const storageCart = JSON.parse(sessionStorage.getItem("obj"))
        console.log(storageCart);
        if(storageCart !== null){
            setCartNumber(storageCart.reduce((total, item) => total + item.number, 0) )
        }
    }, [])

    useEffect(() => {
        if (userName !== null && tableName !== null) {
            setNeedInfo(userName.trim().length > 0 && tableName.trim().length > 0);
        } else {
            setNeedInfo(false)
        }
    }, [addInfo]);

    useEffect(() => {
        let timer;
        if (add) {
            timer = setTimeout(() => {
                cancelHandler()
            }, 500);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [add]);

    function decrease() {
        if (quantity === 1) {
            setQuantity(1);
        } else {
            setQuantity(quantity - 1);
        }
    }

    function increase(id) {
        let data = JSON.parse(sessionStorage.getItem("obj")) || [];
        let dish = listDish.find((item) => item._id === id);
        let availableQuantity = dish.amount;
        let existingItems = data.filter((item) => item.id === id); // Lọc ra tất cả các existingItem có cùng id
        if (existingItems) {
            let totalExistingQuantity = 0;
            existingItems.forEach((existingItem) => {
                totalExistingQuantity += existingItem.number; // Cộng dồn số lượng của từng existingItem
            });
            if (quantity + totalExistingQuantity >= availableQuantity) {
                const foodFailName = dish.name;
                setFoodFailName(foodFailName);
                setAmountRemain(availableQuantity);
                setNotEnoughQuantity(true);
            } else {
                setQuantity(quantity + 1);
            }
        } else {
            if (quantity > availableQuantity) {
                const foodFailName = dish.name;
                setFoodFailName(foodFailName);
                setAmountRemain(availableQuantity);
                setNotEnoughQuantity(true);
            } else {
                setQuantity(quantity + 1);
            }
        }
        // setQuantity(quantity + 1);
    }

    useEffect(() => {
        axios
            .get(
                `http://117.4.194.207:3003/category/allByCashier/${cashier.cashierId}`, config
            )
            .then((response) => {
                const data = response.data;
                if (!data || data === "No categories created") {
                    setCategory([]);
                } else {
                    setCategory(data);
                }
                // setType(data[0]);
            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get(
                `http://117.4.194.207:3003/dish/menu/activedByCashier/${cashier.cashierId}`, config
            )
            .then((response) => {
                setListDish(response.data.filter((dish) => (dish.amount !== 0)));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reload]);

    function addDetail() {
        let food = {
            id: obj._id,
            img: obj.image_detail.path,
            name: obj.name,
            price: obj.price,
            category: obj.category,
            number: quantity,
            options: check,
        };
        let data = JSON.parse(sessionStorage.getItem("obj"));
        if (data === null) {
            arrayFood.push(food);
            sessionStorage.setItem("obj", JSON.stringify(arrayFood));
        } else {
            let existingItem = data.find(
                (item) => item.id === food.id && item.options === food.options
            );
            if (existingItem) {
                existingItem.number += food.number;
            } else {
                data.push(food);
            }
            sessionStorage.setItem("obj", JSON.stringify(data));
        }
        setAdd(true);
        setCartNumber(JSON.parse(sessionStorage.getItem("obj")).reduce((total, item) => total + item.number, 0))
    }

    const cancelHandler = () => {
        setAdd(false);
        setAddFood(false);
        setObj({});
        setOverlay(false);
        setQuantity(1);
        setCheck("")
    };

    const handleSetInfo = () => {
        if (userName.trim().length > 0 && tableName.trim().length > 0) {
            setAddInfo(true)
            sessionStorage.setItem("name", userName);
            sessionStorage.setItem("table", tableName);
            setOverlay(false)
        }
    }

    return (
        <div className={cx("cbWrapper")}>
            {!needInfo && (
                <Fragment>
                    <div className={cx("inputContainer")}>
                        <div className={cx("inputGroup")}>
                            {/* <div className={cx("inputLabel")}>Nhập Tên:</div> */}
                            <input
                                placeholder="Nhập Tên"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className={cx("inputGroup")}>
                            {/* <div className={cx("inputLabel")}>Nhập Số Bàn:</div> */}
                            <input
                                placeholder="Nhập Số Bàn"
                                type="text"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                            />
                        </div>
                        <div className={cx("buttonGroup")}>
                            <button onClick={() => { navigate("/") }}>Huỷ</button>
                            <button onClick={handleSetInfo}>Xác Nhận</button>
                        </div>
                    </div>
                </Fragment>
            )}
            {(overlay) && (
                <div
                    className={cx("overlay")}
                    onClick={() => (
                        cancelHandler()
                    )}
                ></div>
            )}
            {(!needInfo) && (
                <div
                    className={cx("overlay")}
                ></div>
            )}
            <div className={cx("Wrapper")}>
                <div className={cx("blackBar")}>
                    <div className={cx("TopBar")}>
                        <div className={cx("cbTopBar")}>
                            <div className={cx("cbCustomerName")}>Khách Hàng: {userName}</div>
                            <div className={cx("cbCustomerTable")}>Bàn: {tableName}</div>
                            <div className={cx("cbCart")} onClick={() => { navigate("/cart") }}>Thanh Toán: {cartNumber } Món</div>
                        </div>
                    </div>
                </div>
                <div className={cx("mBody")}>
                    <div className={cx("mNavBar")}>
                        <button
                            className={cx("mNavButton", { active: type === null })}
                            onClick={() => setType(null)}
                        >
                            Tất Cả
                        </button>
                        <button
                            className={cx("mNavButton", { active: type === "bestseller" })}
                            onClick={() => setType("bestseller")}
                        >
                            Bestseller
                        </button>
                        {category.map((cat, index) => (
                            <button
                                key={index}
                                className={cx("mNavButton", { active: type === cat })}
                                onClick={() => setType(cat)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className={cx("mContent")} >
                        {(addFood && obj !== {}) && (
                            <Fragment>
                                <div className={cx("addFoodWrapper")}>
                                    <div className={cx("addFoodFlexBox")}>
                                        <div className={cx("addFoodImageBorder")}>
                                            <img className={cx("addFoodImage")} src={obj.image_detail.path}></img>
                                        </div>
                                        <div className={cx("addFoodInfo")}>
                                            <div className={cx("addFoodName")}>{obj.name}</div>
                                            <div className={cx("addFoodQuantity")}>số lượng:
                                                <button onClick={decrease}>
                                                    -
                                                </button>
                                                <div className={cx("quantity")}>{quantity}</div>
                                                <button
                                                    onClick={() => increase(obj._id)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cx("addFoodOption")}>
                                        {obj.options
                                            .map((item, index) => (
                                                <div key={index} className={cx("optionCheck")}>
                                                    <input
                                                        onClick={() => setCheck(item)}
                                                        type="radio"
                                                        name="check"
                                                        value={item}
                                                        id={index}
                                                    />
                                                    <label htmlFor={index}>{item}</label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <button className={cx("addFoodConfirmButton")} onClick={addDetail}>
                                        {!add && "xác nhận"}
                                        {add && "Thành Công"}
                                    </button>
                                </div>
                            </Fragment>
                        )}
                        {(type === null
                            ? listDish
                            : type === "bestseller"
                                ? listDish.filter((dish) => dish.isBestSeller)
                                : listDish.filter((dish) => dish.category === type.name)
                        ).map((food, index) => (
                            <div
                                key={index}
                                className={cx("mItem")}
                                onClick={() => (
                                    setObj(food),
                                    setAddFood(true),
                                    setOverlay(!overlay)
                                    // setCartIcon(false)
                                )}
                            >
                                <div className={cx("mItemBox")}>
                                    <div className={cx("mImageBorder")}>
                                        <img src={food.image_detail.path} alt="FoodImage"></img>
                                    </div>
                                    <div className={cx("mItemInfo")}>
                                        <div className={cx("mName")}>{food.name}</div>
                                        <div className={cx("mPrice")}>
                                            {food.price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </div>
                                        <div className={cx("mQuantity")}>Số lượng tối đa: {food.amount}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBill;
