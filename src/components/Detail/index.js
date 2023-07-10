import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Detail.scss"

const cx = classNames.bind(styles);

function Detail(props) {
    const dish = props.obj
    const [hideBox, setHideBox] = useState(false)
    return (
        <Fragment>
            <div>
                <div className={cx("dtItem")}>
                    <div className={cx("dtName", { "hided": hideBox || "" })}>{dish.name}</div>
                    <input
                        className={cx("dtInputName", { "hided": !hideBox || "" })}
                        placeholder={dish.name}
                    ></input>

                    <div className={cx("dtContent")}>
                        <div className={cx("dtImageBorder")}>
                            <img src={dish.image_detail.path} alt="FoodImage"></img>
                        </div>
                        <div className={cx("dtInfo")}>
                            <div className={cx("dtDescription" , { "hided": hideBox || "" })}>{dish.description}</div>
                            <input
                                className={cx("dtInputDes", { "hided": !hideBox || "" })}
                                placeholder={dish.description}
                            ></input>

                            <div className={cx("dtPrice", { "hided": hideBox || "" })}>
                                Giá: <span>{dish.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                            </div>
                            <input
                                className={cx("dtInputPrice", { "hided": !hideBox || "" })}
                                placeholder={dish.price}
                            ></input>

                            <div className={cx("dtOption")}>Các Lựa Chọn:
                                {dish.options.map((opt, index) => (
                                    <span className={cx("dtOptionItem")}>{opt}<br /></span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx("dtButtonGroup")}>
                        <button className={cx("dtAddOption")}>Thêm Tuỳ Chọn</button>
                        <button className={cx("dtChangeInfo")} onClick={() => {setHideBox(!hideBox)}}>
                            <span className={cx({ "hided": hideBox || "" })}>Sửa Thông Tin Món</span>
                            <span className={cx({ "hided": !hideBox || "" })}>Xác Nhận</span>
                            </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Detail;