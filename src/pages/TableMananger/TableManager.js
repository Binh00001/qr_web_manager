import { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "~/pages/TableMananger/TableManager.scss";
import axios from "axios";

const cx = classNames.bind(styles);

function TableManager() {
  const [tables, setTables] = useState([]);
  const [tableName, setTableName] = useState("");
  const [isPopup, setIsPopup] = useState(false);
  const [tableChanged, setTableChanged] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    axios
      .get("http://117.4.194.207:3003/table/all")
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [tableChanged]);

  const cancelHandle = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setTableName("");
  };

  const handleDeleteTable = (name) => {
    setTableName(name);
    setIsPopup(true);
  };

  const confirmHandle = () => {
    axios
      .delete(`http://117.4.194.207:3003/table/delete/${tableName}`)
      .then((response) => {
        console.log("Bàn đã được xoá thành công!");
        setIsPopup(false);
        setIsSuccess(true);
        setTableChanged(!tableChanged);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      {isPopup && (
        <Fragment>
          <div className={cx("overlay")} onClick={cancelHandle}></div>
          <div className={cx("tmgPopupBox")}>
            <div className={cx("tmgPopupText")}>
              {" "}
              Bạn có chắc chắn muốn xoá bàn {tableName}?{" "}
            </div>
            <div className={cx("tmgPopupGroupButton")}>
              <button className={cx("tmgCancelButton")} onClick={cancelHandle}>
                Huỷ
              </button>

              <button
                className={cx("tmgDeleteTableButton")}
                onClick={confirmHandle}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </Fragment>
      )}
      {isSuccess && (
        <Fragment>
          <div className={cx("overlay")} onClick={cancelHandle}></div>
          <div className={cx("tmgSuccessBox")}>
            <div className={cx("tmgPopupText")}>
              Xoá Bàn {tableName} Thành Công{" "}
            </div>
            <div className={cx("tmgPopupGroupButton")}>
              <button
                className={cx("tmgDeleteTableButton")}
                onClick={cancelHandle}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </Fragment>
      )}
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}></div>
        </div>
        <div className={cx("tmgBody")}>
          <div className={cx("bMarginTop")}></div>
          {tables.map((table, index) => (
            <div className={cx("tmgItem")} key={index}>
              <div className={cx("tmgLeftContainer")}>
                <div className={cx()}> Token: {table.token} </div>
                <div className={cx()}> ID: {table._id} </div>
                <div className={cx()}> Tên Bàn: {table.name} </div>
                <div className={cx()}>
                  Trạng Thái:{" "}
                  {table.isActive ? "Đang hoạt động" : "Không Hoạt Động"}
                </div>
              </div>
              <div className={cx("tmgRightContainer")}>
                <button onClick={() => handleDeleteTable(table.name)}>
                  Xoá Bàn
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

export default TableManager;
