import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/menu/menu.scss";
import { useNavigate } from "react-router-dom";
import Detail from "~/components/Detail/index";

const cx = classNames.bind(styles);

function HiddenMenu() {
  const [listDish, setListDish] = useState([]);
  const [type, setType] = useState(null);
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
        `http://117.4.194.207:3003/dish/menu/allHiddenByCashier/${cashier.cashierId}`
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
        `http://117.4.194.207:3003/dish/active/${id}`,
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
              Quản Lý Thực Đơn
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
          {(type === null
            ? listDish
            : type === "bestseller"
            ? listDish.filter((dish) => dish.isBestSeller)
            : listDish.filter((dish) => dish.category === type.name)
          ).map((food, index) => (
            <div key={index} className={cx("mItem")}>
              <div className={cx("mItemBox")}>
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
                  {" "}
                  Hiện món
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {detail && (
        <Fragment>
          <div onClick={cancelHandler} className="overlay"></div>
          {/* <img className={cx("cancelIcon")} onClick={cancelHandler} src={xIcon} alt="X"></img> */}
          <Detail obj={obj} />
        </Fragment>
      )}
    </div>
  );
}

export default HiddenMenu;
