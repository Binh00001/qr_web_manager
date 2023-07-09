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
                            <div className={cx("mText active")}>Quản Lý Thực Đơn</div>
                            <div className={cx("mText")} onClick={() => navigate('/hidden-menu')}>Các Món Đã Ẩn</div>
                            <div className={cx("mText")} onClick={() => navigate('/addDish')}>Thêm Món Ăn</div>
                        </div>
                    </div>
                </div>
                <p>login</p>

            </div>
    );
}

export default Login;