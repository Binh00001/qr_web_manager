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
      console.log(response);
      const { accessToken, refreshToken, cashier } = response.data;
      if (!formData.cashierName || !formData.password) {
        return;
      }
      console.log(cashier);
      if (!response.data || (cashier.role === "ADMIN" && checkAdmin !== "admin") || (cashier.role === "OWNER" && !checkOwner)) {
        return alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
      }
      console.log(cashier);
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 70,
        authState: {
          cashierName: cashier.cashierName,
          cashierId: cashier.id,
          role: cashier.role,
          group_id: cashier.group_id,
        },
        refreshToken: refreshToken,
        refreshTokenExpireIn: 600,
      });

      if (cashier.role === "ADMIN" && checkAdmin === "admin") {
        navigate("/signup");
        window.location.reload();
      }
      if (cashier.role === "OWNER" && checkOwner) {
        navigate("/bill")
        window.location.reload();
      }
      if (cashier.role === "STAFF" || cashier.role === "MANAGER") {
        navigate("/sortedbytable")
        window.location.reload();
      }

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

  const handleOwnerLogin = (role) => {
    if (role === "staff") {
      setCheckOwner(false)
    }else if(role === "manager"){
      setCheckOwner(true)
    }
  }

  return (
    <div className={cx("lgWrapper")}>
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
            {forUser && (
              <div className={cx("lgPickLoginPerson")}>
                <div className={cx((checkOwner && forUser) ? "" : "active")} onClick={() => handleOwnerLogin("staff")}>
                  Nhân Viên
                </div>
                <div className={cx((checkOwner && forUser) ? "active" : "")} onClick={() => handleOwnerLogin("manager")}>
                  Quản Lý
                </div>
              </div>
            )}
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

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
