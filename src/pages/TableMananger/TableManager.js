import { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "~/pages/TableMananger/TableManager.scss";
import axios from "axios";

const cx = classNames.bind(styles);

function TableManager() {
  const [tables, setTables] = useState([]);
  const [listCashier, setListCashier] = useState([]);
  const [tableId, setTableId] = useState("");
  const [tableName, setTableName] = useState("");
  const [selectedCashierId, setSelectedCashierId] = useState('');
  const [selectedCashierName, setSelectedCashierName] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableChanged, setTableChanged] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/cashier/all`, config)
      .then((response) => {
        // setListCashier(response.data.filter((name) => (name.cashierName !== "admin")))
        setListCashier(response.data)
      })
      .catch((error) => {
        console.log(error);
      });

  }, [])

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/table/allByCashier/${selectedCashierId}`, config)
      .then((response) => {
        // setListCashier(response.data.filter((name) => (name.cashierName !== "admin")))
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [tableChanged])

  const cancelHandle = () => {
    setIsPopup(false);
    setIsSuccess(false);
    setTableId("");
  };

  const handleDeleteTable = (id, name) => {
    setTableId(id);
    setTableName(name);
    setIsPopup(true);
  };

  const confirmHandle = () => {
    axios
      .delete(`http://117.4.194.207:3003/table/delete/${tableId}`, config)
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownItemClick = (value, id) => {
    setSelectedCashierName(value)
    setSelectedCashierId(id)
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/table/allByCashier/${id}`
      )
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log(selectedCashierId);

  const subbmitNewtable = () => {
    const newTableName = document.getElementById("NewTableName").value.trim();
    if (!newTableName) {
      console.log("Please enter a table name.");
      return;
    }

    const tableNames = tables.map((table) => table.name);
    if (tableNames.includes(newTableName)) {
      console.log("Table name already exists.");
      return;
    }

    // If the table name is unique, you can proceed with your logic.
    console.log("Table name is unique. You can proceed with further logic.");

    // Create the data object with the table name to be sent in the post request.
    const data = {
      name: newTableName,
      cashier_id: selectedCashierId
    };

    // Send the post request to create the new table.
    axios
      .post(`${process.env.REACT_APP_API_URL}/table/create`, data, config)
      .then((response) => {
        console.log(response);
        setTables([...tables, response.data])
        // If successful, you can update the state or take other actions.
        // For example, you can add the new table to the state using setTables([...tables, response.data]).
      })
      .catch((error) => {
        console.log(error);
      });

    // Clear the input field after processing.
    document.getElementById("NewTableName").value = "";
  };

  return (
    <Fragment>
      {isPopup && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => cancelHandle()}></div>
          <div className={cx("tmgPopupBox")}>
            <div className={cx("tmgPopupText")}>
              {" "}
              Bạn có chắc chắn muốn xoá bàn {tableName}?{" "}
            </div>
            <div className={cx("tmgPopupGroupButton")}>
              <button className={cx("tmgCancelButton")} onClick={() => cancelHandle()}>
                Huỷ
              </button>

              <button
                className={cx("tmgDeleteTableButton")}
                onClick={() => confirmHandle()}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </Fragment>
      )}
      {isSuccess && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => cancelHandle()}></div>
          <div className={cx("tmgSuccessBox")}>
            <div className={cx("tmgPopupText")}>
              Xoá Bàn {tableName} Thành Công{" "}
            </div>
            <div className={cx("tmgPopupGroupButton")}>
              <button
                className={cx("tmgDeleteTableButton")}
                onClick={() => cancelHandle()}
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </Fragment>
      )}
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("tmgTopBarWrapper")}>
              <div className={cx("tmgText")}>
                <div className={cx("dropdown")} onClick={toggleDropdown}>
                  <div id="cashier">
                    {selectedCashierName || "Chọn Chi Nhánh"}
                  </div>
                  {isOpen && (
                    <div>
                      <div className={cx("dropdownWrapper")}>
                        <div
                          className={cx("dropdownContent")}
                          onClick={() => handleDropdownItemClick("")}
                        >
                          Huỷ Chọn
                        </div>
                        {listCashier
                          // .filter((user) => (user.cashierName !== "admin"))
                          .map((user, index) => (
                            <div
                              key={index}
                              className={cx("dropdownContent")}
                              onClick={() => handleDropdownItemClick(user.cashierName, user.id)}
                            >
                              {user.cashierName}
                            </div>
                          ))
                        }

                      </div>

                      {/* <div
                        className={cx("dropdownContent")}
                        onClick={() => handleDropdownItemClick("NV1")}
                      >
                        NV1
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
              <div className={cx("tmgText")}>
                {selectedCashierName !== '' && (
                  <Fragment>
                    <input
                      placeholder="Nhập Tên Bàn"
                      id="NewTableName"
                    ></input>
                    <button
                      onClick={() => subbmitNewtable()}

                    >Tạo Bàn</button>

                  </Fragment>
                )}
              </div>
            </div>

          </div>
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
                <button
                  onClick={() => handleDeleteTable(table._id, table.name)}
                >
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
