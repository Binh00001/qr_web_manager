
import React, { useState, Fragment, useEffect } from 'react';
import classNames from "classnames";
import styles from "./TableActive.scss"
import axios from "axios";
import tabelNonActive from "~/components/assets/image/table_and_chair_non_active.png";
import tabelActive from "~/components/assets/image/table_and_chair_active.png";
const cx = classNames.bind(styles);

function TableActive() {
    const [tables, setTables] = useState([]);
    const [clickAddTable, setClickAddTable] = useState(true);
    const [tableNewNumber, setTableNewNumber] = useState({ table: "" });
    const [tableChanged, setTableChanged] = useState(false);

    const cashier = JSON.parse(localStorage.getItem("token_state")) || [];
    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    useEffect(() => {
        axios
            // .get(`http://117.4.194.207:3003/table/allByCashier/%{cashier.id}`)
            .get(
                `${process.env.REACT_APP_API_URL}/table/allByCashier/${cashier.cashierId}`  
            )
            .then((response) => {
                setTables(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tableChanged]);

    const handleAddTable = () => {
        if (tables.some((table) => table.name === tableNewNumber.table)) {
            alert("Bàn này đã được tạo rồi");
            return;
        }
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/table/create`, 
                {
                    name: tableNewNumber.table,
                    cashier_id: cashier.cashierId
                },
                config
            )
            .then((response) => {
                console.log(response.data);
                const updatedNewTable = response.data;
                setClickAddTable(!clickAddTable);
                setTableNewNumber({ table: "" });
                setTableChanged(!tableChanged);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const changeHandler = (e) => {
        setTableNewNumber({ [e.target.name]: e.target.value });
    };
    const { table } = tableNewNumber;

    const clickHandler = (table) => {
        const updatedTable = {
            isActive: !table.isActive,
        };
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/table/active/${table._id}`,
                updatedTable,
                config
            )
            .then((response) => {
                const updatedTable = response.data;
                setTables((prevTables) => {
                    const updatedTables = prevTables.map((prevTable) => {
                        if (prevTable.name === updatedTable.name) {
                            return updatedTable;
                        }
                        return prevTable;
                    });
                    return updatedTables;
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    console.log(tables);

    return (
        <Fragment>
            <div className={cx("hAllTable")}>
                {tables.map((table, index) => (
                    <button
                        onClick={() => clickHandler(table)}
                        key={index}
                        className={cx("table")}
                    >
                        {table.isActive && <img src={tabelActive} alt="Table"></img>}
                        {!table.isActive && (
                            <img src={tabelNonActive} alt="Table"></img>
                        )}
                        <p>{table.name}</p>
                    </button>
                ))}
                {clickAddTable && (
                <button
                  onClick={() => setClickAddTable(!clickAddTable)}
                  className={cx("hAddTable")}
                >
                  <p>+</p>
                </button>
              )}
                            {!clickAddTable && (
                <Fragment>
                  <div className={cx("hAddTableBox")}>
                    <input
                      id="table"
                      type="text"
                      name="table"
                      // value={amount}
                      onChange={changeHandler}
                      placeholder="Số Bàn:..."
                      required
                    ></input>
                    {table && (
                      <div
                        className={cx("hAcpBtn")}
                        // onClick={() => submitAddAmountHandler(food._id)}
                        onClick={handleAddTable}
                      >
                        <p>OK</p>
                      </div>
                    )}
                    {!table && (
                      <div
                        className={cx("hAcpBtn")}
                        onClick={() => setClickAddTable(!clickAddTable)}
                        // onClick={handleAddTable}
                      >
                        <p>Huỷ</p>
                      </div>
                    )}
                  </div>
                </Fragment>
              )}
            </div>
        </Fragment>
    )
}

export default TableActive;