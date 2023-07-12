import { Fragment, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState } from "react";
import axios from "axios";
import tabelNonActive from "~/components/assets/image/table_and_chair_non_active.png";
import tabelActive from "~/components/assets/image/table_and_chair_active.png";
import moment from "moment";
import ting from "~/components/assets/sound/Herta Kurukuru Kururin 1 (mp3cut.net) (5).mp3"
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  const [tables, setTables] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isAllActive, setIsAllActive] = useState(true);
  const [isNewRequest, setIsNewRequest] = useState(false);
  const [clickAddTable, setClickAddTable] = useState(false);
  const [tableNewNumber, setTableNewNumber] = useState({ newTable: '', })
  const [oldRequest, setOldRequest] = useState([]);
  const audioRef = useRef(null);


  useEffect(() => {
    axios
      .get("http://117.4.194.207:3003/table/all")
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://117.4.194.207:3003/call-staff/all?time=60")
        .then((response) => {
          const newRequests = response.data;
          setRequests(newRequests);

        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      const { _id } = requests[0];
      setOldRequest(_id);
    }
  }, [requests]);

  useEffect(() => {
    // playSound()
  }, [oldRequest]);


  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }



  const removeRedDot = (request) => {
    const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();
    if (timeDifference <= 1) {
      // request.showRedDot = true;
      return true;
    } else {
      // request.showRedDot = false; 
      return false
    }
  };

  const handleAddTable = () => {
    setClickAddTable(!clickAddTable)
    console.log(clickAddTable);
  }

  const changeHandler = (e) => {
    setTableNewNumber({ [e.target.name]: e.target.value });
  }


  const { newTable } = tableNewNumber;

  const clickHandler = (table) => {
    const updatedTable = {
      isActive: !table.isActive,
    };
    axios
      .put(`http://117.4.194.207:3003/table/active/${table.name}`, updatedTable)
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

  const isWithin5Minutes = (createdAt) => {
    const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();

    return timeDifference <= 10;
  };

  if (!tables || !requests) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>

      <audio ref={audioRef}>
        <source src={ting} type="audio/mpeg" />
      </audio>

      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("hLeftContainer")}>
              <div className={cx("hText")}>
                Tất Cả Các Bàn:
              </div>
            </div>
            <div className={cx("hRightContainer")}>
              <div className={cx("hText")}>
                Quản Lý Yêu Cầu(sau 5 phút yêu cầu sẽ bị ẩn):
              </div>
            </div>
          </div>
        </div>
        <div className={cx("hBody")}>
          <div className={cx("hLeftContainer")}>
            <div className={cx("hAllTable")}>
              {tables.map((table, index) => (
                <button
                  onClick={() => clickHandler(table)}
                  key={index}
                  className={cx("table")}
                >
                  {table.isActive && <img src={tabelActive}></img>}
                  {!table.isActive && <img src={tabelNonActive}></img>}
                  <p>Bàn {table.name}</p>
                </button>
              ))}
              {clickAddTable &&
                  <button
                    onClick={handleAddTable}
                    className={cx("hAddTable")}
                  >
                    <p>+</p>
                  </button>
              }
              {!clickAddTable &&
                <Fragment>
                  <div className={cx("hAddTableBox")}>
                    <input
                      id="table"
                      type="number"
                      name="newTable"
                      // value={amount}
                      onChange={changeHandler}
                      placeholder="Số Bàn:..."
                      required
                    >
                    </input>
                    {newTable &&
                      <div className={cx("hAcpBtn")}
                        // onClick={() => submitAddAmountHandler(food._id)}
                        onClick={handleAddTable}
                      >
                        <p>OK</p>
                      </div>}
                    {!newTable &&
                      <div className={cx("hAcpBtn")}
                        // onClick={() => setClickAddAmount(null)}
                        onClick={handleAddTable}
                      >
                        <p>Huỷ</p>
                      </div>}
                  </div>
                </Fragment>
              }
            </div>
          </div>
          <div className={cx("hRightContainer")}>
            <div className={cx("hAllNotification")}>
              {requests
                .filter((request) => isWithin5Minutes(request.createdAt))
                .map((request, index) => (
                  <div key={index} className={cx("hNotification")}>
                    <div>Bàn {request.table}</div>
                    <div>{moment(request.createdAt).format("h:mm A")}</div>
                    <div className={cx("redDot", { "redDotHided": !removeRedDot(request) })}></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;