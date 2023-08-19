import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/menu/menu.scss";
import { useNavigate } from "react-router-dom";
import Detail from "~/components/Detail/index";

const cx = classNames.bind(styles);

function HiddenMenu() {
  const [listDish, setListDish] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reload, setReload] = useState(false);
  const [obj, setObj] = useState({});
  const [detail, setDetail] = useState(false);
  const navigate = useNavigate();

  const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dish/menu/allHiddenByCashier/${cashier.cashierId}`
      )
      .then((response) => {
        setListDish(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reload]);

  const cancelHandler = () => {
    setDetail(false);
  };

  const submitActiveDishHandler = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/dish/active/${id}`,
        { isActive: true },
        config
      )
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={cx("Wrapper")}>
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}>
            <div className={cx("mText")} onClick={() => navigate("/menu")}>
              Thực Đơn
            </div>
            <div className={cx("mText active")}>Các Món Đã Ẩn</div>
            <div className={cx("mText")} onClick={() => navigate("/addDish")}>
              Thêm Món Ăn
            </div>
          </div>
        </div>
      </div>
      <div className={cx("mBody")}>
        <div className={cx("mNavBar")}></div>
        <div className={cx("mContent")}>
          {listDish.map((food, index) => (
            <div key={index} className={cx("mItem")}>
              {selectedItem === index && (
                <div className={cx("mHoverBox")}>
                  <div
                    className={cx("optionsHoverBox")}
                    onClick={() => (setObj(food), setDetail(true))}
                  >
                    Chi tiết
                  </div>

                  <div
                    className={cx("optionsHoverBox")}
                    onClick={() => submitActiveDishHandler(food._id)}
                  >
                    Hiện món
                  </div>
                </div>
              )}
              <div
                className={cx("mItemBox")}
                onClick={() =>
                  setSelectedItem(
                    selectedItem === index ? null : index
                  )
                }
              >
                <div className={cx("mImageBorder")}>
                  <img src={food.image_detail.path} alt="FoodImage"></img>
                </div>
                <div className={cx("mItemInfo")}>
                  <div className={cx("mName")}>{food.name}</div>
                  <div className={cx("mPrice")}>
                    {food.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div className={cx("mQuantity")}>Số lượng: {food.amount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {detail && (
        <Fragment>
          <div onClick={cancelHandler} className="overlay"></div>
          <Detail obj={obj} />
        </Fragment>
      )}
    </div>
  );
}

export default HiddenMenu;
