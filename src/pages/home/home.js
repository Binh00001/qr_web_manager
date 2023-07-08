import { Fragment } from "react";
import classNames from "classnames";
import styles from '~/pages/home/home.scss'
const cx = classNames.bind(styles)

function Home() {
    return (
        <Fragment>
        <div className={cx("Wrapper")}>
            <div className={cx("blackBar")}>
                <div className={cx("TopBar")}>
                    <div className={cx("hLeftContainer")}>
                        <div className={cx("hText")}>Quản Lý Bàn Ăn:</div>
                        <div className={cx("hAllActiveGroup")}>
                            <div className={cx("hText")}>Bật Tất Cả</div>
                            <button className={cx("hAllActiveButton")}>CLICK</button>
                        </div>
                    </div>
                    <div className={cx("hRightContainer")}>
                        <div className={cx("hText")}>Quản Lý Yêu Cầu(sau 5 phút yêu cầu sẽ bị ẩn):</div>
                    </div>
                </div>
            </div>
            <div className={cx("hBody")}>
                <div className={cx("hLeftContainer")}>
                    <div className={cx("hAllTable")}>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                        <button className={cx("table")}>Bàn X</button>
                    </div>
                </div>
                <div className={cx("hRightContainer")}>
                    <div className={cx("hAllNotification")}>
                        <div className={cx("hNotification")}>
                            <div>Bàn A
                            </div>
                            <div>20:09 PM</div>
                        </div>
                        <div className={cx("hNotification")}>
                            <div>Bàn A
                            </div>
                            <div>20:09 PM</div>
                        </div>
                        <div className={cx("hNotification")}>
                            <div>Bàn A
                            </div>
                            <div>20:09 PM</div>
                        </div>
                        <div className={cx("hNotification")}>
                            <div>Bàn A
                            </div>
                            <div>20:09 PM</div>
                        </div>
                        <div className={cx("hNotification")}>
                            <div>Bàn A
                            </div>
                            <div>20:09 PM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Fragment>
    )
}

export default Home;