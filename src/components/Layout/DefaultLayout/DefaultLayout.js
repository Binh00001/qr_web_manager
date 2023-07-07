import styles from './DefaultLayout.scss'
import classNames from 'classnames';
import logo from '~/components/assets/image/gunther.jpg'


const cx = classNames.bind(styles)

function DefaultLayout({children}) {
    return (
        <div className={cx("dWrapper")}>
            <div className={cx("dContent")}>
                <div className={cx("dLeftContainer")}>
                    <div className={cx("LogoBorder")}>
                        <img src={logo} alt='LOGO'></img>
                    </div>
                    <div className={cx("dItem")}>Trang Chủ</div>
                    <div className={cx("dItem")}>Thực Đơn</div>
                    <div className={cx("dItem")}>Hoá Đơn</div>
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