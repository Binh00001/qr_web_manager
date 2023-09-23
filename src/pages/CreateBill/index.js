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
    const [tables, setTables] = useState([]);
    const [optionList, setOptionList] = useState([]);
    const [tableMessage, setTableMessage] = useState("");
    const arrayFood = [];

    const navigate = useNavigate();

    const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    useEffect(() => {
        axios
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

    useEffect(() => {
        const storageCart = JSON.parse(sessionStorage.getItem("obj"))
        if (storageCart !== null) {
            setCartNumber(storageCart.reduce((total, item) => total + item.number, 0))
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
                `${process.env.REACT_APP_API_URL}/category/allByCashier/${cashier.group_id}`, config
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
                `${process.env.REACT_APP_API_URL}/dish/menu/activedByCashier/${cashier.group_id}`, config
            )
            .then((response) => {
                setListDish(response.data.filter((dish) => (dish.amount !== 0)));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reload]);

    function handleSelectOption(optionName, optionPrice) {
        // Check if the option already exists in the list
        const optionExists = optionList.some((option) => option.name === optionName && option.price === optionPrice);

        if (optionExists) {
            // If the option exists, remove it from the list
            const updatedOptionList = optionList.filter((option) => !(option.name === optionName && option.price === optionPrice));
            setOptionList(updatedOptionList);
        } else {
            if (optionPrice === 0) {
                // If the optionPrice is 0, remove any existing options with the same name
                const updatedOptionList = optionList.filter((option) => option.name !== optionName);
                setOptionList(updatedOptionList);
            } else {
                // If the option doesn't exist, add it to the list
                const newOption = { name: optionName, price: optionPrice };
                setOptionList([...optionList, newOption]);
            }
        }
    }

    function addDetail() {
        let food = {
            id: obj._id,
            img: obj.image_detail.path,
            name: obj.name,
            price: obj.price,
            category: obj.category,
            number: quantity,
            options: optionList,
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
            let foundTable = false;
            tables.forEach(table => {
                if (table.name === tableName && table.isActive) {
                    setAddInfo(true)
                    sessionStorage.setItem("name", userName);
                    sessionStorage.setItem("table", tableName);
                    setOverlay(false);
                    foundTable = true;
                } else if (table.name === tableName && !table.isActive) {
                    setTableMessage("Bàn của bạn chưa được kích hoạt")
                    foundTable = true;
                }
            })
            if (!foundTable) {
                // No matching table was found
                // Handle this scenario here, e.g., show an error message
                console.log(`Bàn ${tableName} không tồn tại`);
                setTableMessage(`Bàn ${tableName} không tồn tại`)
            }
        }
    }



    return (
        <div className={cx("cbWrapper")}>
            {!(!tableMessage) && (
                <Fragment>
                    <div className={cx("checkTableOverlay")} onClick={() => { setTableMessage("") }}></div>
                    <div className={cx("checkTableBox")}>
                        <div className={cx("checkTableMsg")}>{tableMessage}</div>
                    </div>
                </Fragment>
            )}
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
                            <button onClick={() => { navigate("/sortedbytable") }}>Huỷ</button>
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
                            <div className={cx("cbCustomerName")}>Tên: {userName}</div>
                            <div className={cx("cbCustomerTable")}>Bàn: {tableName}</div>
                            <div className={cx("cbCart")} onClick={() => { navigate("/cart") }}>Thanh Toán: {cartNumber} Món</div>
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
                        {(addFood && obj !== null) && (
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
                                        {console.log(obj.options)}
                                        {obj.options.map((item, index) => {
                                            const isSelected = optionList.some(
                                                (option) => option.name === item.name && option.price === item.price
                                            );

                                            return (
                                                <div
                                                    key={item._id}
                                                    className={cx("optionItem", { selectedOption: isSelected })}
                                                    onClick={() => handleSelectOption(item.name, item.price)}
                                                >
                                                    <div className={cx("optionName")}>{item.name}</div>
                                                    <div className={cx("optionPrice")}>
                                                        {item.price === null ? "0đ" : `${item.price.toLocaleString("vn-VN", { currency: "VND" })}đ`}
                                                    </div>

                                                </div>
                                            );
                                        })}
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
