import classNames from "classnames";
import styles from "~/pages/signup/signup.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";
import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useIsAdminContext } from "~/App";

const cx = classNames.bind(styles);

function Signup() {
  const navigate = useNavigate();
  const [listGroup, setListGroup] = useState([]);
  const [listCashier, setListCashier] = useState([]);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isChangePasswordPopup, setIsChangePasswordPopup] = useState(false);
  const [isDeleteAccountPopup, setIsDeleteAccountPopup] = useState(false);
  const [isAccountManager, setIsAccountManager] = useState(false);
  const [chooseAccountName, setChooseAccountName] = useState("");
  const [reload, setReload] = useState(true);
  const [deleteAccId, setDeleteAccId] = useState("");
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [updateAccId, setUpdateAccId] = useState("");
  const isAdmin = useIsAdminContext();
  const [formData, setFormData] = useState({
    name: "",
    cashierName: "",
    password: "",
    role:"OWNER",
  });
  const [updateFormData, setUpdateFormData] = useState({
    cashierName: "",
    name: "",
    oldPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  //get list group
  // useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.REACT_APP_API_URL}/group/allByOwner`, config
  //     )
  //     .then((response) => {
  //       setListGroup(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  //get list cashier
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/all`, config)
      .then((response) => {
        setListCashier(
          response.data.filter((name) => name.cashierName !== "admin")
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reload]);

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      setIsOverlay(true)
      setRegisterMessage("Hãy nhập tên người dùng")
      return console.log("Hãy nhập tên người dùng");
    }
    if (!formData.cashierName) {
      setIsOverlay(true)
      setRegisterMessage("Hãy nhập tên đăng nhập")
      return console.log("Hãy nhập tên đăng nhập");
    }
    if (!formData.password) {
      setIsOverlay(true)
      setRegisterMessage("Hãy nhập mật khẩu")
      return console.log("Hãy nhập mật khẩu");
    }
    if (formData.password !== formData.reEnterPassword) {
      setIsOverlay(true)
      setRegisterMessage("Mật khẩu không khớp")
      return console.log("Mật khẩu không khớp");
    } else {
      console.log("Gửi form");
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/cashier-auth/register`,
          formData
        )
        .then((response) => {
          if (response.data === "CashierName Existed!") {
            // Handle existing cashier name case
          } else {
            setIsOverlay(true);
            setRegisterMessage("Tạo Tài Khoản Thành Công");
            console.log("Tao thanh cong");
            setFormData({
              cashierName: "",
              name: "",
              password: "",
              reEnterPassword: "",
            });
            setReload(!reload);
            window.location.reload();
          }
        })

        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDeleteSubmit = () => {
    setIsOverlay(false);
    setIsDeleteAccountPopup(false);
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/cashier/delete/${deleteAccId}`,
        config
      )
      .then((response) => {
        if (response.data === false) {
          console.log("Xóa không thành công");
        } else {
          console.log("Xóa thành cong");
          setReload(!reload);
          setDeleteAccId("");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateSubmit = () => {
    console.log(updateFormData);
    if (updateFormData.name === "admin") {
      setChangePasswordMessage("Hãy Chọn Tên Khác")
      return console.log("không thể đặt tên này");
    }
    if (!updateFormData.oldPassword) {
      setChangePasswordMessage("Hãy Nhập Mật Khẩu Cũ")
      return console.log("Hãy Nhập mật khẩu cũ");
    }
    if (updateFormData.newPassword || updateFormData.reNewPassword) {
      if (updateFormData.newPassword !== updateFormData.reNewPassword) {
        setChangePasswordMessage("Mật khẩu không khớp")
        return console.log("Mật khẩu không khớp");
      }
    }
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/cashier/update/${updateAccId}`,
        updateFormData,
        config
      )
      .then((response) => {
        if (response.data === false) {
          setChangePasswordMessage("Cập nhật không thành công")
          console.log("Cập nhật không thành công");
        } else if (response.data === "Wrong password") {
          setChangePasswordMessage("Sai mật khẩu")
          console.log("Sai mật khẩu");
        } else if (response.data === true) {
          setChangePasswordMessage("Cập Nhật Thành Công")
          console.log("cập nhật thành cong");
          setUpdateAccId("");
          setUpdateFormData({
            cashierName: "",
            name: "",
            oldPassword: "",
            newPassword: "",
            reNewPassword: "",
          });

          setReload(!reload);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSignUpClick = () => {
    setIsSignUp(true);
    setIsAccountManager(false);
  };

  const handleAccountManagerClick = () => {
    setIsSignUp(false);
    setIsAccountManager(true);
  };

  const handleChangePassword = (user) => {
    setIsOverlay(true);
    setIsChangePasswordPopup(true);
    setChooseAccountName(user.cashierName);
    setUpdateAccId(user.id);
    setUpdateFormData({
      ...updateFormData,
      cashierName: user.cashierName,
    });
  };

  const handleDeleteAccount = (id) => {
    setIsOverlay(true);
    setIsDeleteAccountPopup(true);
    setDeleteAccId(id);
  };

  const handleOverlayClick = () => {
    setIsOverlay(false);
    setUpdateFormData({
      cashierName: "",
      name: "",
      oldPassword: "",
      newPassword: "",
    });
    setIsChangePasswordPopup(false);
    setIsDeleteAccountPopup(false);
    setRegisterMessage("")
    setChangePasswordMessage("")
  };

  const handleChangePasswordMessage = () => {
    if (changePasswordMessage !== "Cập Nhật Thành Công") {
      setChangePasswordMessage("")
    } else {
      setChangePasswordMessage("")
      setIsOverlay(false)
      setUpdateFormData({
        cashierName: "",
        name: "",
        oldPassword: "",
        newPassword: "",
      });
      setIsChangePasswordPopup(false);
      setIsDeleteAccountPopup(false);
      setRegisterMessage("")
    }
  }

  return (
    <div className={cx("lgWrapper")}>
      {isOverlay && (
        <div className="darkOverlay" onClick={() => handleOverlayClick()}></div>
      )}
      {!(!registerMessage) && (
        <Fragment>
          <div className={cx("registerNoteBox")}>
            <div className={cx("registerContent")}>{registerMessage}</div>
          </div>
        </Fragment>
      )}
      {!(!changePasswordMessage) && (
        <Fragment>
          <div className="lightOverlay" onClick={() => handleChangePasswordMessage()}>
            <div className={cx("registerNoteBox")}>
              <div className={cx("registerContent")}>{changePasswordMessage}</div>
            </div>
          </div>
        </Fragment>
      )}
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}>
            <div className="spTitle" onClick={() => handleSignUpClick()}>
              Đăng Kí
            </div>
            {isAdmin === "ADMIN" && (
              <Fragment>
                <div
                  className="spTitle"
                  onClick={() => handleAccountManagerClick()}
                >
                  Quản Lý Tài Khoản
                </div>
              </Fragment>
            )}
            {isAdmin !== "ADMIN" && (
              <Fragment>
                <div
                  className="spTitle"
                  onClick={() => handleAccountManagerClick()}
                >
                  Quản Lý Group
                </div>
              </Fragment>
            )}

          </div>
        </div>
      </div>
      <div className={cx("lgBody")}>
        {isAccountManager && isChangePasswordPopup && (
          <Fragment>
            <div className={cx("cppWrapper")}>
              <div className={cx("ccpChoosedName")}>
                Tài Khoản: {chooseAccountName}
              </div>
              <input
                className={cx("cppName")}
                placeholder="Nhập Tên Mới (Không Bắt Buộc)"
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    name: e.target.value,
                  })
                }
              ></input>
              <input
                className={cx("cppOldPass")}
                placeholder="Nhập Mật Khẩu Cũ"
                type="password"
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    oldPassword: e.target.value,
                  })
                }
              ></input>
              <input
                className={cx("cppNewPass")}
                placeholder="Nhập Mật Khẩu Mới"
                type="password"
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    newPassword: e.target.value,
                  })
                }
              ></input>
              <input
                className={cx("cppNewPassCheck")}
                placeholder="Nhập Lại Mật Khẩu"
                type="password"
                onChange={(e) =>
                  setUpdateFormData({
                    ...updateFormData,
                    reNewPassword: e.target.value,
                  })
                }
              ></input>
              <button
                className={cx("cppSubbmitButton")}
                onClick={handleUpdateSubmit}
              >
                Xác Nhận
              </button>
            </div>
          </Fragment>
        )}
        {isAccountManager && isDeleteAccountPopup && (
          <Fragment>
            <div className={cx("cppWrapper")}>
              <div className={cx("cppNote")}>
                Bạn Có Chắc Muốn Xoá Tài Khoản Này?
                <br />
                (Không thể hoàn tác)
              </div>
              <div className={cx("cppButtonGroup")}>
                <button className={cx("cppCancelButton")} onClick={handleOverlayClick}>Huỷ</button>
                <button
                  className={cx("cppConfirmButton")}
                  onClick={handleDeleteSubmit}
                >
                  Xác Nhận
                </button>
              </div>
            </div>
          </Fragment>
        )}
        <div className={cx("sp1Content")}>
          {isSignUp && (
            <Fragment>
              <div className={cx("spRightContainer")}>
                <form className={cx("spBox")} onSubmit={handleSignUpSubmit}>
                  <div className={cx("spUserNameBox")}>
                    <input
                      required
                      className={cx("userName-input")}
                      type="text"
                      placeholder="Tên Người Dùng"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          // userName: e.target.value,
                          name: e.target.value,
                        })
                      }
                    ></input>
                  </div>
                  <div className={cx("spAccountBox")}>
                    <input
                      required
                      className={cx("account-input")}
                      type="text"
                      placeholder="Tên Đăng Nhập(tối đa 10 kí tự) "
                      value={formData.cashierName}
                      onChange={(e) => {
                        const inputValue = e.target.value.slice(0, 10); // Limit to 10 characters
                        setFormData({
                          ...formData,
                          cashierName: inputValue,
                        });
                      }}
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
                {listCashier.map((user, index) => (
                  <div className={cx("amItem")} key={index}>
                    <div className={cx("amLeft")}>
                      <div className={cx("amItemInfo")}>
                        Tên: {user.name}
                      </div>
                      <div className={cx("amItemInfo")}>
                        Tài Khoản: {user.cashierName}
                      </div>
                    </div>
                    <div className={cx("amRight")}>
                      <button
                        className={cx("amChangePassword")}
                        onClick={() => handleChangePassword(user)}
                      >
                        Đổi Mật Khẩu
                      </button>
                      <button
                        className={cx("amDeleteAccount")}
                        onClick={() => handleDeleteAccount(user.id)}
                      >
                        Xoá Tài Khoản
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
