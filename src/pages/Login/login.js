import classNames from "classnames";
import styles from "~/pages/Login/Login.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "react-auth-kit";

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const signOut = useSignOut();
  const [formData, setFormData] = useState({
    cashierName: "",
    password: "",
  });
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
        `http://117.4.194.207:3003/cashier-auth/login`,
        formData
      );
      const { accessToken, refreshToken, cashier } = response.data;
      if (!formData.cashierName || !formData.password) {
        return;
      }
      if (!response.data) {
        return alert("sai pass");
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
        navigate("/");
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
            <div className={cx("lgResName")}>Tên Nhà Hàng</div>
            <div className={cx("lgResDes")}>
              My attempt at recreating one of my favorite paintings, The Fallen
              Angel by Alexandre Cabanel, in LEGO. I really wanted to capture
              the angry and sad stare of Lucifer. How do you think it compares
              to the painting?
            </div>
            <div className={cx("lg4flex")}>Powered by 4flex</div>
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
            </form>
            {/* <div className={cx("lgRegisterBox")}>
              <button value="Sign Up" onClick={() => navigate(`/signup`)}>
                Sign Up
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
