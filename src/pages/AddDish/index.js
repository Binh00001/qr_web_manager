
import { Fragment } from "react";
import classNames from "classnames";
import styles from "./AddDish.scss"
const cx = classNames.bind(styles)
function AddDish() {
    return (
        <Fragment>
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

                <div className={cx("aBody")}>
                    <div className="margintopbody"></div>
                    <div className={cx("aItem")}>
                        <div className="aName">
                            <div>Tên Món Ăn:</div>
                            <textarea
                                onChange={console.log(1)}
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aDescription">
                            <div>Mô Tả:</div>
                            <textarea
                                onChange={console.log(1)}
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aType">
                            <div>Phân Loại:</div>
                            <textarea
                                onChange={console.log(1)}
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aPrice">
                            <div>Giá Tiền:</div>
                            <textarea
                                onChange={console.log(1)}
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aAddImage">
                            <div>Ảnh Minh Hoạ:</div>
                            <button>Click Để Chọn Ảnh</button>
                        </div>
                    </div>
                    <button className={cx("submitButton")}>Tạo Món Ăn</button>
                </div>


            </div>
        </Fragment>
    )
}

export default AddDish;