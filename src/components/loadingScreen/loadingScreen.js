import { Fragment } from "react";
import styles from "~/components/loadingScreen/loadingScreen.scss"
import classNames from "classnames";
const cx = classNames.bind(styles);
function loading() {
    return (
        <Fragment>
            <div className={cx("loadText")}>
                <p>Loading...</p>
            </div>
            <div className={cx("center")}>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
                <div className={cx("wave")}></div>
            </div>
        </Fragment>
    )
}

export default loading;