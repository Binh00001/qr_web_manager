import classNames from "classnames";
import styles from "~/pages/Login/Login.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useIsAuthenticated } from "react-auth-kit";

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const { checkAdmin } = useParams();
  const signIn = useSignIn();
  const signOut = useSignOut();
  const [formData, setFormData] = useState({
    cashierName: "",
    password: "",
  });
  const [checkOwner, setCheckOwner] = useState(false);
  const forUser = (checkAdmin !== "admin");
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (isAuthenticated()) {
      const cashierInfo = JSON.parse(localStorage.getItem("token_state"));
      if (cashierInfo) {
        if (cashierInfo.cashierName === "admin") {
          navigate("/bill");
        } else {
          navigate("/");
        }
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cashier-auth/login`,
        formData
      );
      const { accessToken, refreshToken, cashier } = response.data;
      if (!formData.cashierName || !formData.password) {
        return;
      }
      if (!response.data) {
        return alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
      }
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 70,
        authState: {
          cashierName: cashier.cashierName,
          cashierId: cashier.id,
        },
        refreshToken: refreshToken,
        refreshTokenExpireIn: 600,
      });
      if (cashier.cashierName === "admin") {
        navigate("/bill");
      } else {
        navigate("/sortedbytable");
      }
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

  const handleOwnerLogin = () => {
    setCheckOwner(!checkOwner)
  }

  return (
    <div className={cx("lgWrapper")}>
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}></div>
        </div>
      </div>
      <div className={cx("lgBody")}>
        <div className={cx("bMarginTop")}></div>
        <div className={cx("lgContent")}>
          <div className={cx("lgLeftContainer")}>
            {(!checkOwner && forUser) &&
              <Fragment>
                <div className={cx("lgResName")}>Bún Cá 29+</div>
              </Fragment>
            }
            {!forUser && (
              <Fragment>
                <div className={cx("lgResName")}>Admin</div>
              </Fragment>
            )}
            {(checkOwner && forUser) &&
              <Fragment>
                <div className={cx("lgResName")}>Quản Lý</div>
              </Fragment>
            }
            <div className={cx("lgResDes")}>
            </div>
            <div className={cx("lg4flex")}>
              Powered by gifttech
              <br />
              Gmail: giftech.work@gmail.com
            </div>
          </div>
          <div className={cx("lgRightContainer")}>
            <form className={cx("lgBox")} onSubmit={handleSubmit}>
              <div className={cx("lgAccountBox")}>
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
              <div className={cx("lgPasswordBox")}>
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
              <div className={cx("lgLoginButtonBox")}>
                <button type="submit" value="Log in">
                  Login
                </button>
              </div>
              <div className={cx("lgLoginAsOwner")}>
                {(checkOwner && forUser) &&
                  <div onClick={() => handleOwnerLogin()}>
                    Đăng Nhập Nhân Viên
                  </div>
                }
                {(!checkOwner && forUser) &&
                  <div onClick={() => handleOwnerLogin()}>
                    Đăng Nhập Chủ Cửa Hàng
                  </div>
                }
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
