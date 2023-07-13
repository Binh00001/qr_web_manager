import classNames from "classnames";
import styles from "~/pages/signup/signup.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import axios from "axios";
import { useState } from "react";

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const [formData, setFormData] = useState({
    cashierName: "",
    password: "",
  });

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
  return (
    <div className={cx("Wrapper")}>
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
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
