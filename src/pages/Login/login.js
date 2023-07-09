import classNames from "classnames";
import styles from '~/pages/Login/Login.scss';
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles)

function Login() {
    const navigate = useNavigate();
    return (
        <div className={cx("Wrapper")}>
            <div className={cx("blackBar")}>
                <div className={cx("TopBar")}>
                    <div className={cx("mTopBar")}>

                    </div>
                </div>
            </div>
            <div className={cx("lgBody")}>
                <div className={cx("bMarginTop")}></div>
                <div className={cx("lgContent")}>
                    <div className={cx("lgLeftContainer")}>
                        <div className={cx("lgResName")}>Tên Nhà Hàng</div>
                        <div className={cx("lgResDes")}>
                            My attempt at recreating one of my favorite paintings,
                            The Fallen Angel by Alexandre Cabanel, in LEGO. I really wanted to capture the angry and sad stare of Lucifer.
                            How do you think it compares to the painting?
                        </div>
                        <div className={cx("lg4flex")}>powered by 4flex</div>
                    </div>
                    <div className={cx("lgRightContainer")}>
                        <div className={cx("lgBox")}>
                            <div className={cx("lgAccountBox")}>
                                <input
                                    className={cx("account-input")}
                                    type="text"
                                    placeholder="Tên Đăng Nhập"
                                ></input>
                            </div>
                            <div className={cx("lgPasswordBox")}>
                                <input
                                    className={cx("password-input")}
                                    type="password"
                                    placeholder="Mật Khẩu"
                                ></input>
                            </div>
                            <div className={cx("lgLoginButtonBox")}>
                                <input type="submit" value="Log in" />
                            </div>
                        </div>
                        <div className={cx("lgRegisterBox")}>
                            <input type="submit" value="Sign Up" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;