import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from '~/pages/menu/menu.scss';
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)

function Menu() {
    const [category, setCategory] = useState([]);
    const [listDish, setListDish] = useState([]);
    const [type, setType] = useState(null);
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
    }, []);

    console.log(listDish);

    return (
        <div className={cx("Wrapper")}>
            <div className={cx("blackBar")}>
                <div className={cx("TopBar")}>
                    <div className={cx("mTopBar")}>
                        <div className={cx("mText active")}>Quản Lý Thực Đơn</div>
                        <div className={cx("mText")}>Các Món Đã Ẩn</div>
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
                            className={cx("mItem")}>
                            <div className={cx("mImageBorder")}>
                                <img src={food.image_detail.path} alt="FoodImage"></img>
                            </div>
                            <div className={cx("mItemInfo")}>
                                <div className={cx("mName")}>{food.name}</div>
                                <div className={cx("mPrice")}>{food.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                                <div className={cx("mQuantity")}>Số lượng: {food.amount}</div>
                            </div>
                        </div>
                    ))}




                </div>
            </div>
        </div>
    )
}

export default Menu;