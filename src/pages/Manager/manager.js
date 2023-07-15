import { Fragment } from "react";
import classNames from "classnames";
import styles from "~/pages/Manager/manager";

const cx = classNames.bind(styles);

function Manager() {
    return (
        <Fragment>
            <div className={cx("Wrapper")}>
                <div className={cx("blackBar")}>
                    <div className={cx("TopBar")}>
                        <div className={cx("hLeftContainer")}>
                            <div className={cx("hText")}>Tất Cả Các Bàn:</div>
                        </div>
                        <div className={cx("hRightContainer")}>
                            <div className={cx("hText")}>
                                Quản Lý Yêu Cầu(sau 10 phút yêu cầu sẽ bị ẩn):
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Manager;