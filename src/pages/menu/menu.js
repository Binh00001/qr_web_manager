import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from '~/pages/menu/menu.scss';
import { useNavigate } from "react-router-dom";
import Detail from "~/components/Detail/index";
import xIcon from "~/components/assets/image/x_icon_150997.png"
const cx = classNames.bind(styles)

function Menu() {
    const [category, setCategory] = useState([]);
    const [listDish, setListDish] = useState([]);
    const [type, setType] = useState(null);
    const [clickAddAmount, setClickAddAmount] = useState(null);
    const [isAmount, setIsAmount] = useState(false);
    const [reload, setReload] = useState(false);
    const [obj, setObj] = useState({});
    const [detail, setDetail] = useState(false);

    const [state, setState] = useState({
        amount: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://117.4.194.207:3003/category/all")
            .then((response) => {
                const data = response.data;
                setCategory(data);
                // setType(data[0]);

            })
            .catch((error) => {
                console.log(error);
            });
        axios
            .get("http://117.4.194.207:3003/dish/menu/all-actived")
            .then((response) => {
                setListDish(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reload]);

    const changeHandler = (e) => {
        setState({ [e.target.name]: e.target.value });
    }

    const submitAddAmountHandler = (id) => {
        axios
            .put(`http://117.4.194.207:3003/dish/update/${id}`, { amount: state.amount })
            .then((response) => {
                setClickAddAmount(null)
                const updatedListDishes = listDish.map(dish => {
                    if (dish._id === id) {
                        return { ...dish, amount: response.data.amount };
                    }
                    return dish;
                });
                setListDish(updatedListDishes);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cancelHandler = () => {
        setDetail(false)
    };
    const submitHideDishHandler = (id) => {
        axios
            .put(`http://117.4.194.207:3003/dish/active/${id}`, { isActive: false })
            .then((response) => {
                setReload(!reload)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // console.log(state);
    const { amount } = state;

    return (
        <div className={cx("Wrapper")}>

            <div className={cx("blackBar")}>
                <div className={cx("TopBar")}>
                    <div className={cx("mTopBar")}>
                        <div className={cx("mText active")}>Quản Lý Thực Đơn</div>
                        <div className={cx("mText")} onClick={() => navigate('/hidden-menu')}>Các Món Đã Ẩn</div>
                        <div className={cx("mText")} onClick={() => navigate('/addDish')}>Thêm Món Ăn</div>
                    </div>
                </div>
            </div>
            <div className={cx("mBody")}>

                <div className={cx("mNavBar")}>
                    <button className={cx("mNavButton", { active: type === null })} onClick={() => setType(null)}>Tất Cả</button>
                    <button className={cx("mNavButton", { active: type === "bestseller" })} onClick={() => setType('bestseller')}>Bestseller</button>
                    {category.map((cat, index) => (
                        <button key={index} className={cx("mNavButton", { active: type === cat })} onClick={() => setType(cat)}>{cat.name}</button>
                    ))}
                </div>
                <div className={cx("mContent")}>
                    {(type === null
                        ? listDish
                        : type === 'bestseller'
                            ? listDish.filter((dish) => dish.isBestSeller)
                            : listDish.filter((dish) => dish.category === type.name)
                    ).map((food, index) => (
                        <div
                            key={index}
                            className={cx("mItem")}
                        >
                            <div className={cx("mItemBox")}>
                                <div className={cx("mImageBorder")}>
                                    <img src={food.image_detail.path} alt="FoodImage"></img>
                                </div>
                                <div className={cx("mItemInfo")}>
                                    <div className={cx("mName")}>{food.name}</div>
                                    <div className={cx("mPrice")}>{food.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                    <div className={cx("mQuantity")}>Số lượng: {food.amount}</div>
                                </div>
                            </div>
                            <div className={cx("mHoverBox")}>
                                <div className={cx("optionsHoverBox")}
                                    onClick={() => (
                                        setObj(food), setDetail(true)
                                    )}
                                >Chi tiết</div>
                                {clickAddAmount !== index && <div
                                    className={cx("optionsHoverBox")}
                                    onClick={() => {
                                        setClickAddAmount(index);
                                        setState({ ...state, amount: null });
                                    }}>Thay đổi số lượng</div>}
                                {clickAddAmount === index && <div className={cx("addAmount optionsHoverBox")}>
                                    <input
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        value={amount}
                                        onChange={changeHandler}
                                        required
                                        placeholder="số lượng ..." />
                                    {amount && <div className={cx("AcpBtn")} onClick={() => submitAddAmountHandler(food._id)}>OK</div>}
                                    {!amount && <div className={cx("AcpBtn")} onClick={() => setClickAddAmount(null)}>Hủy</div>}
                                </div>}
                                <div className={cx("optionsHoverBox")} onClick={() => submitHideDishHandler(food._id)} > Ẩn món</div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            {detail && (
                <Fragment>
                <div
                    onClick={cancelHandler}
                    className="overlay">
                </div>
                {/* <img className={cx("cancelIcon")} onClick={cancelHandler} src={xIcon} alt="X"></img> */}
                <Detail obj={obj} />
                </Fragment>
            )}
        </div >
    )
}

export default Menu;