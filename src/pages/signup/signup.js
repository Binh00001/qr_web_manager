import classNames from "classnames";
import styles from "~/pages/signup/signup.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useIsAdminContext } from "~/App";

const cx = classNames.bind(styles);

function Login() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [listCashier, setListCashier] = useState([]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isChangePasswordPopup, setIsChangePasswordPopup] = useState(false)
  const [isDeleteAccountPopup, setIsDeleteAccountPopup] = useState(false)
  const [isAccountManager, setIsAccountManager] = useState(false);
  const [chooseAccountName ,setChooseAccountName] = useState('');

  const isAdmin = useIsAdminContext();
  const [formData, setFormData] = useState({
    cashierName: "",
    password: "",
  });

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (isAdmin === false) {
      navigate(`/`);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/all`, config)
      .then((response) => {
        // setListCashier(response.data.filter((name) => (name.cashierName !== "admin")))
        setListCashier(response.data.filter((name) => (name.cashierName !== "admin")))
      })
      .catch((error) => {
        console.log(error);
      });

  }, [])

  const handleSignUpSubmit = async (e) => {
    if (!formData.userName) {
      return console.log("Hãy Nhập tên người dùng");
    }
    if (!formData.cashierName) {
      return console.log("Hãy Nhập tên đăng nhập");
    }
    if (!formData.password) {
      return console.log("Hãy Nhập mật khẩu");
    }
    if (formData.password !== formData.reEnterPassword) {
      console.log("Mật khẩu không khớp");
    } else {
      console.log("Gửi form");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://117.4.194.207:3003/cashier-auth/login`,
        formData
      );
      const { accessToken, refreshToken } = response.data;
      if (!formData.cashierName || !formData.password) {
        return;
      }
      if (!response.data) {
        return alert("sai pass");
      }
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 10,
        authState: {
          cashierName: formData.cashierName,
        },
        refreshToken: refreshToken,
        refreshTokenExpireIn: 10,
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response);
        return;
      } else {
        console.log(error);
        return error;
      }
    }
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
    setIsAccountManager(false);
  };

  const handleAccountManagerClick = () => {
    setIsSignUp(false);
    setIsAccountManager(true);
  };

  const handleChangePassword = (value) => {
    setIsOverlay(true);
    setIsChangePasswordPopup(true);
    setChooseAccountName(value);
  };


  const handleDeleteAccount = () => {
    setIsOverlay(true)
    setIsDeleteAccountPopup(true)
  };

  const handleOverlayClick = () => {
    setIsOverlay(false)
    setIsChangePasswordPopup(false)
    setIsDeleteAccountPopup(false)
  }

  return (
    <div className={cx("lgWrapper")}>
      {isOverlay && <div className="darkOverlay" onClick={() => handleOverlayClick()}></div>}
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}>
            <div className="spTitle" onClick={() => handleSignUpClick()}>Đăng Kí</div>
            <div className="spTitle" onClick={() => handleAccountManagerClick()}>Quản Lý Tài Khoản</div>

          </div>
        </div>
      </div>
      <div className={cx("lgBody")}>
        <div className={cx("bMarginTop")}></div>
        <div className={cx("lgContent")}>
          {/* <div className={cx("lgLeftContainer")}> */}
          {/* <div className={cx("lgResName")}>Tên Nhà Hàng</div> */}
          {/* <div className={cx("lgResDes")}>
              My attempt at recreating one of my favorite paintings, The Fallen
              Angel by Alexandre Cabanel, in LEGO. I really wanted to capture
              the angry and sad stare of Lucifer. How do you think it compares
              to the painting?
            </div> */}
          {/* <div className={cx("lg4flex")}>Powered by 4flex</div> */}
          {/* </div> */}
          {isSignUp && (
            <Fragment>
              <div className={cx("spRightContainer")}>
                <form className={cx("spBox")} onSubmit={handleSubmit}>
                  <div className={cx("spUserNameBox")}>
                    <input
                      required
                      className={cx("userName-input")}
                      type="text"
                      placeholder="Tên Người Dùng"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          userName: e.target.value,
                          //   cashierName: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  <div className={cx("spAccountBox")}>
                    <input
                      required
                      className={cx("account-input")}
                      type="text"
                      placeholder="Tên Đăng Nhập"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashierName: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  <div className={cx("spPasswordBox")}>
                    <input
                      required
                      className={cx("password-input")}
                      type="password"
                      placeholder="Mật Khẩu"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  <div className={cx("spReInputPasswordBox")}>
                    <input
                      required
                      className={cx("password-re-input")}
                      type="password"
                      placeholder="Nhập Lại Mật Khẩu"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reEnterPassword: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  {/* <div className={cx("lgLoginButtonBox")}>
                <button type="submit" value="Log in">
                  Login
                </button>
              </div> */}
                </form>
                <div className={cx("spRegisterBox")}>
                  <button
                    type="submit"
                    value="Sign Up"
                    onClick={handleSignUpSubmit}
                  >
                    Đăng Kí
                  </button>
                </div>
              </div>
            </Fragment>
          )}
          {isAccountManager && (
            <Fragment>
              <div className={cx("amWrapper")}>
                {listCashier
                  .map((user, index) => (
                    <div className={cx("amItem")} key={index}>
                      <div className={cx("amLeft")}>
                        <div className={cx("amItemInfo")}>Tên Chi Nhánh: {user.name}</div>
                        <div className={cx("amItemInfo")}>Tên Đăng Nhập: {user.cashierName}</div>
                      </div>
                      <div className={cx("amRight")}>
                        <button className={cx("amChangePassword")} onClick={() => handleChangePassword(user.cashierName)}>Đổi Mật Khẩu</button>
                        <button className={cx("amDeleteAccount")} onClick={() => handleDeleteAccount()}>Xoá Tài Khoản</button>
                      </div>
                    </div>
                  ))}
              </div>
            </Fragment>
          )}
          {(isAccountManager && isChangePasswordPopup) && (
            <Fragment>
              <div className={cx("cppWrapper")}>
                <div className={cx("ccpChoosedName")}>Tài Khoản: {chooseAccountName}</div>
                <input
                  className={cx("cppName")}
                  placeholder="Nhập Tên Mới (Không Bắt Buộc)"
                ></input>
                <input
                  className={cx("cppOldPass")}
                  placeholder="Nhập Mật Khẩu Cũ"
                ></input>
                <input
                  className={cx("cppNewPass")}
                  placeholder="Nhập Mật Khẩu Mới"
                ></input>
                <input
                  className={cx("cppNewPassCheck")}
                  placeholder="Nhập Lại Mật Khẩu"
                ></input>
                <button className={cx("cppSubbmitButton")}>Xác Nhận</button>
              </div>
            </Fragment>
          )}
          {(isAccountManager && isDeleteAccountPopup) && (
            <Fragment>
              <div className={cx("cppWrapper")}>
                <div className={cx("cppNote")}>
                  Bạn Có Chắc Muốn Xoá Tài Khoản Này?
                  <br />
                  (Không thể hoàn tác)
                </div>
                <div className={cx("cppButtonGroup")}>
                  <button className={cx("cppCancelButton")}>Huỷ</button>
                  <button className={cx("cppConfirmButton")}>Xác Nhận</button>
                </div>

              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
