import styles from './DefaultLayout.scss'
import classNames from 'classnames';
import logo from '~/components/assets/image/food-logo-design-template-restaurant-free-png.webp'
import { useNavigate } from "react-router-dom";


const cx = classNames.bind(styles)

function DefaultLayout({ children }) {

    const navigate = useNavigate();
    const handleClickLogo = () => {
        navigate(`/`);
    };
    const handleClickMenu = () => {
        navigate(`/menu`);
    };
    const handleClickBill = () => {
        navigate(`/bill`);
    };
    return (
        <div className={cx("dWrapper")}>
            <div className={cx("dContent")}>
                <div className={cx("dLeftContainer")}>
                    <div className={cx("LogoBorder")}>
                        <img onClick={handleClickLogo} src={logo} alt='LOGO'></img>
                    </div>
                    <div className={cx("dItem")} onClick={handleClickLogo}>Trang Chủ</div>
                    <div className={cx("dItem")} onClick={handleClickMenu}>Thực Đơn</div>
                    <div className={cx("dItem")} onClick={handleClickBill}>Hoá Đơn</div>
                </div>
                <div className={cx("dRightContainer")}>
                    <div className={cx("UserName dItem")}></div>
                    <div className={cx("dLogin")}>Đăng Nhập</div>
                    <div className={cx("dLogout")}>Đăng Xuất</div>
                </div>
            </div>
            <div>{children}</div>
        </div>
    )
}

export default DefaultLayout;