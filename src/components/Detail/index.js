import React from "react";
import { Fragment } from "react";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Detail.scss";
import axios from "axios";

const cx = classNames.bind(styles);

function Detail(props) {
  const dish = props.obj;
  const [hideBox, setHideBox] = useState(false);
  const [updatedDish, setUpdatedDish] = useState(dish);
  const [formChanged, setFormChanged] = useState(false);
  const [state, setState] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image_detail: null,
  });

  const changeHandler = (e) => {
    if (e.target.name === "image_detail") {
      const file = e.target.files[0];
      if (file && isImageFile(file)) {
        setState({ ...state, [e.target.name]: file });
      } else {
        alert("Vui lòng chọn một tệp ảnh có định dạng hợp lệ.");
      }
    } else {
      setState({ ...state, [e.target.name]: e.target.value });
    }
    setFormChanged(true);
  };

  const isImageFile = (file) => {
    const acceptedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return acceptedFormats.includes(file.type);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!formChanged) {
      console.log("Không có sự thay đổi trong form.");
      return;
    }
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("image_detail", state.image_detail);
    formData.append("category", state.category);
    formData.append("price", state.price);
    axios
      .put(`http://117.4.194.207:3003/dish/update/${dish._id}`, formData)
      .then((response) => {
        console.log(response);
        const updatedFields = {
          name: state.name || dish.name,
          description: state.description || dish.description,
          price: state.price || dish.price,
        };
        setUpdatedDish({ ...dish, ...updatedFields });
        setFormChanged(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { description, name, category, price } = state;
  return (
    <Fragment>
      <div>
        <div className={cx("dtItem")}>
          <div className={cx("dtName", { hided: hideBox || "" })}>
            {updatedDish.name}
          </div>
          <input
            className={cx("dtInputName", { hided: !hideBox || "" })}
            type="text"
            placeholder={updatedDish.name}
            onChange={changeHandler}
            name="name"
            value={name}
          ></input>

          <div className={cx("dtContent")}>
            <div className={cx("dtImageBorder")}>
              <img src={dish.image_detail.path} alt="FoodImage"></img>
            </div>
            <div className={cx("dtInfo")}>
              <div className={cx("dtDescription", { hided: hideBox || "" })}>
                {updatedDish.description}
              </div>
              <input
                className={cx("dtInputDes", { hided: !hideBox || "" })}
                placeholder={updatedDish.description}
                value={description}
                name="description"
                type="text"
                onChange={changeHandler}
              ></input>

              <div className={cx("dtPrice", { hided: hideBox || "" })}>
                Giá:
                <span>
                  {updatedDish.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <input
                className={cx("dtInputPrice", { hided: !hideBox || "" })}
                placeholder={updatedDish.price}
                value={price}
                name="price"
                type="number"
                onChange={changeHandler}
              ></input>

              <div className={cx("dtOption")}>
                Các Lựa Chọn:
                {dish.options.map((opt, index) => (
                  <span key={index} className={cx("dtOptionItem")}>
                    {opt}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={cx("dtButtonGroup")}>
            <button className={cx("dtAddOption")}>Thêm Tuỳ Chọn</button>
            <button
              className={cx("dtChangeInfo")}
              onClick={() => {
                setHideBox(!hideBox);
              }}
            >
              <span className={cx({ hided: hideBox || "" })}>
                Sửa Thông Tin Món
              </span>
              <span
                onClick={submitHandler}
                className={cx({ hided: !hideBox || "" })}
              >
                Xác Nhận
              </span>
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Detail;
