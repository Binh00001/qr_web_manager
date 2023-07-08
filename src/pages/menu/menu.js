

import { Fragment } from "react";
import classNames from "classnames";
import styles from '~/pages/menu/menu.scss';

import gunther from '~/components/assets/image/gunther.jpg'

const cx = classNames.bind(styles)

function Menu() {
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
                    <button className={cx("mNavButton")}>Cơm</button>
                    <button className={cx("mNavButton")}>Nước</button>
                </div>
                <div className={cx("mContent")}>
                    <div className={cx("mItem")}>
                        <div className={cx("mImageBorder")}>
                            <img src={gunther} alt="FoodImage"></img>
                        </div>
                        <div className={cx("mItemInfo")}>
                            <div className={cx("mName")}>Bánh Mì</div>
                            <div className={cx("mPrice")}>25000đ</div>
                            <div className={cx("mQuantity")}>Số lượng: 200</div>
                        </div>
                    </div>
                    <div className={cx("mItem")}>
                        <div className={cx("mImageBorder")}>
                            <img src={gunther} alt="FoodImage"></img>
                        </div>
                        <div className={cx("mItemInfo")}>
                            <div className={cx("mName")}>Bánh Mì</div>
                            <div className={cx("mPrice")}>25000đ</div>
                            <div className={cx("mQuantity")}>Số lượng: 200</div>
                        </div>
                    </div> <div className={cx("mItem")}>
                        <div className={cx("mImageBorder")}>
                            <img src={gunther} alt="FoodImage"></img>
                        </div>
                        <div className={cx("mItemInfo")}>
                            <div className={cx("mName")}>Bánh Mì</div>
                            <div className={cx("mPrice")}>25000đ</div>
                            <div className={cx("mQuantity")}>Số lượng: 200</div>
                        </div>
                    </div> <div className={cx("mItem")}>
                        <div className={cx("mImageBorder")}>
                            <img src={gunther} alt="FoodImage"></img>
                        </div>
                        <div className={cx("mItemInfo")}>
                            <div className={cx("mName")}>Bánh Mì</div>
                            <div className={cx("mPrice")}>25000đ</div>
                            <div className={cx("mQuantity")}>Số lượng: 200</div>
                        </div>
                    </div> <div className={cx("mItem")}>
                        <div className={cx("mImageBorder")}>
                            <img src={gunther} alt="FoodImage"></img>
                        </div>
                        <div className={cx("mItemInfo")}>
                            <div className={cx("mName")}>Bánh Mì</div>
                            <div className={cx("mPrice")}>25000đ</div>
                            <div className={cx("mQuantity")}>Số lượng: 200</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Menu;