import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Detail.scss"

const cx = classNames.bind(styles);

function Detail(props) {
    const dish = props.obj
    return (
        <Fragment>
            <div className={cx("overlay")}>
                <div className={cx("dtItem")}>
                    <div className={cx("dtName")}>{dish.name}</div>
                    <div className={cx("dtContent")}>
                        <div className={cx("dtImageBorder")}>
                            <img src={dish.image_detail.path} alt="FoodImage"></img>
                        </div>
                        <div className={cx("dtInfo")}>
                            <div className={cx("dtDescription")}>{dish.description}</div>
                            <div className={cx("dtPrice")}>Giá: {dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                            <div className={cx("dtOption")}>Các Lựa Chọn: {dish.options}</div>
                        </div>
                    </div>
                    <div className={cx("dtButtonGroup")}>
                        <button className={cx("dtAddOption")}>Thêm Tuỳ Chọn</button>
                        <button className={cx("dtChangeInfo")}>Sửa Thông Tin Món</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Detail;