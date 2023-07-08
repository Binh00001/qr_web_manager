

import { Fragment } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from '~/pages/menu/menu.scss';

import gunther from '~/components/assets/image/gunther.jpg'

const cx = classNames.bind(styles)

function Menu() {
    const [category, setCategory] = useState([]);
    const [listDish, setListDish] = useState([]);
    useEffect(() => {
        axios
            .get("http://117.4.194.207:3003/category/all")
            .then((response) => {
                setCategory(response.data);
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
                        <div className={cx("mText")}>Quản Lý Thực Đơn</div>
                        <div className={cx("mText")}>Các Món Đã Ẩn</div>
                        <div className={cx("mText")}>Thêm Món Ăn</div>
                    </div>
                </div>
            </div>
            <div className={cx("mBody")}>
                <div className={cx("mNavBar")}>
                    <button className={cx("mNavButton")}>Tất Cả</button>
                    {category.map((cat, index) => (
                        <button className={cx("mNavButton")}>{cat.name}</button>
                    ))}
                </div>
                <div className={cx("mContent")}>
                    {listDish.map((food, index) => (
                        <div
                            key={index}
                            className={cx("mItem")}>
                            <div className={cx("mImageBorder")}>
                                <img src={food.image_detail.path} alt="FoodImage"></img>
                            </div>
                            <div className={cx("mItemInfo")}>
                                <div className={cx("mName")}>{food.name}</div>
                                <div className={cx("mPrice")}>{food.price}đ</div>
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