import { Fragment, useEffect, useState, useRef } from "react";
import axios from "axios";
import classNames from "classnames";
import styles from "~/pages/menu/menu.scss";
import { useNavigate } from "react-router-dom";
import Detail from "~/components/Detail/index";
const cx = classNames.bind(styles);

function Menu() {
  // const ref = useRef(null);

  const [category, setCategory] = useState([]);
  const [listDish, setListDish] = useState([]);
  const [type, setType] = useState(null);
  const [clickAddAmount, setClickAddAmount] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reload, setReload] = useState(false);
  const [obj, setObj] = useState({});
  const [detail, setDetail] = useState(false);
  const [state, setState] = useState({
    amount: "",
  });
  const navigate = useNavigate();

  const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/category/allByCashier/${cashier.cashierId}`
      )
      .then((response) => {
        const data = response.data;
        if (!data || data === "No categories created") {
          setCategory([]);
        } else {
          setCategory(data);
        }
        // setType(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/dish/menu/activedByCashier/${cashier.cashierId}`
      )
      .then((response) => {
        setListDish(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reload, detail]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       setSelectedItem(null);
  //     }
  //   };
  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  const changeHandler = (e) => {
    setState({ [e.target.name]: e.target.value });
  };

  const submitAddAmountHandler = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/dish/update/${id}`,
        {
          amount: state.amount,
        },
        config
      )
      .then((response) => {
        setClickAddAmount(null);
        const updatedListDishes = listDish.map((dish) => {
          if (dish._id === id) {
            return { ...dish, amount: response.data.amount };
          }
          return dish;
        });
        setListDish(updatedListDishes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const cancelHandler = () => {
    setDetail(false);
  };
  const submitHideDishHandler = (id) => {
    setSelectedItem()
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/dish/active/${id}`,
        { isActive: false },
        config
      )
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // console.log(state);
  const { amount } = state;

  return (
    <div className={cx("Wrapper")}>
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}>
            <div className={cx("mText active")}>Thực Đơn</div>
            <div
              className={cx("mText")}
              onClick={() => navigate("/hidden-menu")}
            >
              Các Món Đã Ẩn
            </div>
            <div className={cx("mText")} onClick={() => navigate("/addDish")}>
              Thêm Món Ăn
            </div>
          </div>
        </div>
      </div>
      <div className={cx("mBody")}>
        <div className={cx("mNavBar")}>
          <button
            className={cx("mNavButton", { active: type === null })}
            onClick={() => setType(null)}
          >
            Tất Cả
          </button>
          <button
            className={cx("mNavButton", { active: type === "bestseller" })}
            onClick={() => setType("bestseller")}
          >
            Bestseller
          </button>
          {category.map((cat, index) => (
            <button
              key={index}
              className={cx("mNavButton", { active: type === cat })}
              onClick={() => setType(cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className={cx("mContent")} 
        // ref={ref}
        >
          {(type === null
            ? listDish
            : type === "bestseller"
              ? listDish.filter((dish) => dish.isBestSeller)
              : listDish.filter((dish) => dish.category === type.name)
          ).map((food, index) => (
            <div key={index} className={cx("mItem")}  
            >
              <div className={cx("mItemBox")} onClick={() => setSelectedItem((prevSelectedItem) => (prevSelectedItem === index ? prevSelectedItem : index))}>
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
              {selectedItem === index && (
                <div className={cx("mHoverBox")}>
                  <div
                    className={cx("optionsHoverBox")}
                    onClick={() => (setObj(food), setDetail(true))}
                  >
                    Chi tiết
                  </div>
                  {clickAddAmount !== index && (
                    <div
                      className={cx("optionsHoverBox")}
                      onClick={() => {
                        setClickAddAmount(index);
                        setState({ ...state, amount: null });
                      }}
                    >
                      Thay đổi số lượng
                    </div>
                  )}
                  {clickAddAmount === index && (
                    <div className={cx("addAmount optionsHoverBox")}>
                      <input
                        id="amount"
                        type="number"
                        name="amount"
                        value={amount}
                        onChange={changeHandler}
                        required
                        placeholder="số lượng ..."
                      />
                      {amount && (
                        <div
                          className={cx("AcpBtn")}
                          onClick={() => submitAddAmountHandler(food._id)}
                        >
                          OK
                        </div>
                      )}
                      {!amount && (
                        <div
                          className={cx("AcpBtn")}
                          onClick={() => setClickAddAmount(null)}
                        >
                          Hủy
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={cx("optionsHoverBox")}
                    onClick={() => submitHideDishHandler(food._id)}
                  >
                    {/* {" "} */}
                    Ẩn món
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
      {detail && (
        <Fragment>
          <div onClick={cancelHandler} className="overlay"></div>
          {/* <img className={cx("cancelIcon")} onClick={cancelHandler} src={xIcon} alt="X"></img> */}
          <Detail obj={obj} hideDetail={cancelHandler} />
        </Fragment>
      )}
    </div>
  );
}

export default Menu;
