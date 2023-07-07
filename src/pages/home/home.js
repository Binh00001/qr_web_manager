import { Fragment } from "react";
import classNames from "classnames";
import styles from '~/pages/home/home.scss'
const cx = classNames.bind(styles)

function Home() {
    return (
        <Fragment>
            <div className={cx("blackBar hTopBar")}>
                <div className={cx("hLeftContainer")}>
                    <div className={cx("hText")}>Quản Lý Bàn Ăn</div>
                    <div className={cx("hAllActiveGroup")}>
                        <div className={cx("hText")}>Bật Tất Cả</div>
                        <button className={cx("hAllActiveButton")}></button>
                    </div>
                </div>
                <div className={cx("hRightContainer")}>
                    <div className={cx("hText")}>Quản Lý Yêu Cầu(sau 5 phút yêu cầu sẽ bị ẩn):</div>
                </div>
            </div>
            <div className={cx("hBody")}>
                <div className={cx("hLeftContainer")}>
                    
                </div>
                <div className={cx("hRightContainer")}>

                </div>
            </div>
        </Fragment>
    )
}

export default Home;