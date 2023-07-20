import React, { Fragment, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Detail.scss";
import axios from "axios";
import emptyStar from "~/components/assets/image/emptyStar.png";
import filledStar from "~/components/assets/image/yellowStar.png";
const cx = classNames.bind(styles);

function Detail(props) {
  const dish = props.obj;
  const [hideBox, setHideBox] = useState(false);
  const [isAddOption, setIsAddOption] = useState(false);
  const [updatedDish, setUpdatedDish] = useState(dish);
  const [formChanged, setFormChanged] = useState(false);
  const [isBestSale, setIsBestSale] = useState(false);
  const [newOption, setNewOption] = useState("")
  const [state, setState] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image_detail: null,
  });

  // useEffect(() => {
  //   const file = document.getElementById("inImg");
  //   const img = document.getElementById("imageChanged");

  //   file.addEventListener("change", (e) => {
  //     img.src = URL.createObjectURL(e.target.files[0]);
  //     console.log(e.target.files[0]);
  //   });

  //   return () => {
  //     file.removeEventListener("change", () => { });
  //   };
  // }, []);

  const setStar = () => {
    setIsBestSale(!isBestSale);
  };
  const setStarHandler = (dish) => {
    const updatedBestSeller = {
      isBestSeller: !dish.isBestSeller,
    };
    axios
      .put(
        `http://117.4.194.207:3003/dish/best-seller/${dish._id}`,
        updatedBestSeller
      )
      .then((response) => {
        const updatedStar = {
          isBestSeller: response.data.isBestSeller,
        };
        setUpdatedDish({ ...dish, ...updatedStar });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeHandler = (e) => {
    if (e.target.name === "image_detail") {
      const fileInput = e.target;
      const fileLabel = document.getElementById("file-label");
      if (fileInput.files && fileInput.files.length > 0) {
        fileLabel.innerText = fileInput.files[0].name;
      } else {
        fileLabel.innerText = "Ấn Để Chọn Ảnh";
      }
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

  function handleFileInputChange(event) {
    const fileInput = event.target;
    const fileLabel = document.getElementById("file-label");

    if (fileInput.files && fileInput.files.length > 0) {
      fileLabel.innerText = fileInput.files[0].name;
    } else {
      fileLabel.innerText = "Ấn Để Chọn Ảnh";
    }
  }

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
        const updatedFields = {
          name: state.name || dish.name,
          description: state.description || dish.description,
          price: state.price || dish.price,
          category: state.category || dish.category,
          image_detail: response.data.image_detail || dish.image_detail,
        };
        setUpdatedDish({ ...dish, ...updatedFields });
        setFormChanged(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelHandler = () => {
    setHideBox(false);
    setFormChanged(false);
    setState({
      name: "",
      description: "",
      category: "",
      price: "",
      image_detail: null,
    });
  };

  const cancelHandler2 = () => {
    setIsAddOption(false)
  }

  const { description, name, category, price } = state;

  const handleOptionChange = (e) => {
    setNewOption(e.target.value);
  };

  const submitNewOption = () => {
    if (newOption.trim() !== "") {
      // thêm newOption vào mảng nếu nó khác rỗng 
      const updatedDishOptions = [...dish.options, newOption];
      axios
        .post(`http://117.4.194.207:3003/dish/add-option/${dish._id}`, { 'option':  [newOption]})
        .then((response) => {
          // update option
          // console.log(response.data);
          dish.options = response.data.options
          setUpdatedDish({ ...updatedDish, options: updatedDishOptions });
          setNewOption(""); // Reset the newOption state
          setIsAddOption(false); // Hide the input field after adding the new option
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const removeOptionHandler = (opt) => {
    const dataDelete = {'option' : opt}
    console.log(dataDelete);
    axios
      .delete(`http://117.4.194.207:3003/dish/delete-option/${dish._id}`, dataDelete)
      .then((response) => {
        // lọc lấy những option khác với option truyền vào
        const updatedOptions = dish.options.filter((option) => option !== opt);
        setUpdatedDish({ ...updatedDish, options: updatedOptions });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <Fragment>
      <div>
        <div className={cx("dtItem")}>
          <div className={cx("dtTopWrapper")}>
            <div className={cx("dtName", { hided: hideBox || "" })} id="image">
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
            <div className={cx("Star")}>
              {!updatedDish.isBestSeller && (
                <img
                  src={emptyStar}
                  onClick={() => setStarHandler(updatedDish)}
                ></img>
              )}
              {updatedDish.isBestSeller && (
                <img
                  src={filledStar}
                  onClick={() => setStarHandler(updatedDish)}
                ></img>
              )}
            </div>
          </div>

          <div className={cx("dtContent")}>
            <div className={cx("dtImageBorder")}>
              <div className={cx({ hided: !hideBox || "" })}>
                <div className={cx("custom-file")}>
                  <label
                    id="file-label"
                    className={cx("custom-file-label")}
                    htmlFor="image_detail"
                  >
                    Ấn Để Chọn Ảnh
                  </label>
                  <input
                    // onChange={handleFileInputChange}
                    onChange={changeHandler}
                    type="file"
                    id="image_detail"
                    name="image_detail"
                    accept="image/png,image/jpeg,image/jpg"
                    required
                    className={cx("custom-file-input")}
                  />
                </div>
              </div>
              <img
                src={updatedDish.image_detail.path}
                alt="FoodImage"
                className={cx({ hided: hideBox || "" })}
              ></img>
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
                  {" " +
                    updatedDish.price.toLocaleString("vi-VN", {
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

              <div className={cx("dtCategory", { hided: hideBox || "" })}>
                Loại:
                <span>{" " + updatedDish.category}</span>
              </div>
              <input
                className={cx("dtInputCategory", { hided: !hideBox || "" })}
                placeholder={updatedDish.category}
                value={category}
                name="category"
                type="text"
                onChange={changeHandler}
              ></input>

              <div className={cx("dtOption")}>
                Các Lựa Chọn:
                {dish.options.map((opt, index) => (
                  <span key={index} className={cx("dtOptionItem")}>
                    {opt}
                    {isAddOption &&
                      <span
                        className={cx("removeOption")}
                        onClick={() => removeOptionHandler(opt)}
                      >
                        X
                      </span>
                    }
                    <br />
                  </span>
                ))}
                {isAddOption && (
                  <Fragment>
                    <div className={cx("dtAddOptionGroup")}>
                      <input
                        className={cx("dtInputAddOption")}
                        placeholder="Nhập Tuỳ Chọn Mới"
                        value={newOption} // Set the value of the input field to the newOption state
                        onChange={handleOptionChange} // Update the newOption state on input change
                      />
                      <button
                        className={cx("dtSubmitOption", { hided: (newOption.trim() !== "") || "" })}
                        onClick={cancelHandler2}
                      >
                        Huỷ
                      </button>
                      <button
                        className={cx("dtSubmitOption", { hided: !(newOption.trim() !== "") || "" })}
                        onClick={submitNewOption}
                      >
                        OK
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
          <div className={cx("dtButtonGroup")}>
            {/* <button className={cx("dtAddOption")}>Thêm Tuỳ Chọn</button> */}
            {!hideBox && (
              <button
                className={cx("dtAddOption")}
                onClick={() => { setIsAddOption(!isAddOption) }}
              >
                Thêm Tuỳ Chọn
              </button>
            )}
            {hideBox && (
              <button className={cx("dtAddOption")} onClick={cancelHandler}>
                Hủy
              </button>
            )}
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
