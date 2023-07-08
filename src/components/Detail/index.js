import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Detail.scss"

const cx = classNames.bind(styles);

function Detail(props) {
    return (
        <Fragment>
            <div className={cx("overlay")}>
                <div className={cx("dtItem")}>
                    <div className={cx("dtName")}>Banhs MIf</div>
                    <div className={cx("dtContent")}>
                        <div className={cx("dtImageBorder")}>
                            <img src="" alt="FoodImage"></img>
                        </div>
                        <div className={cx("dtInfo")}>
                            <div className={cx("dtDescription")}>sdfkjshfkjahlfdjahkdjfasdfljhasjdhfkladf</div>
                            <div className={cx("dtPrice")}>Giá: { }</div>
                            <div className={cx("dtOption")}>Các Lựa Chọn:</div>
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