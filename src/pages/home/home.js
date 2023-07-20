import { Fragment, useEffect, useRef } from "react";
import io from 'socket.io-client';
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState } from "react";
import axios from "axios";
import tabelNonActive from "~/components/assets/image/table_and_chair_non_active.png";
import tabelActive from "~/components/assets/image/table_and_chair_active.png";
import moment from "moment";
import ting from "~/components/assets/sound/Herta Kurukuru Kururin 1 (mp3cut.net) (5).mp3";
import Loading from "~/components/loadingScreen/loadingScreen"
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  const [tables, setTables] = useState([]);
  const [requests, setRequests] = useState([]);
  const [oldRequest, setOldRequest] = useState([]);
  const [listTenMin, setListTenMin] = useState([]);
  // const [isNewRequest, setIsNewRequest] = useState(false);
  const [clickAddTable, setClickAddTable] = useState(true);
  const [tableNewNumber, setTableNewNumber] = useState({ table: "" });
  const [tableChanged, setTableChanged] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const socket = io('http://117.4.194.207:3003');

    socket.on('newCallStaff', (response) => {
      console.log(response);
    })
  })

  useEffect(() => {
    axios
      // .get("http://117.4.194.207:3003/table/all")
      .get(`${process.env.REACT_APP_API_URL}/table/all`)
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [tableChanged]);

  useEffect(() => {
    const fetchData = () => {
      axios
        // .get("http://117.4.194.207:3003/call-staff/all?time=60")
        .get(`${process.env.REACT_APP_API_URL}/call-staff/all?time=60`)
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
    const updatedListTenMin = listTenMin.filter((request) => {
      const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment
        .duration(currentTime.diff(requestTime))
        .asMinutes();
      return timeDifference <= 10;
    });

    setListTenMin(updatedListTenMin);

    if (requests.length > 0) {
      const { _id } = requests[0];
      setOldRequest(_id);
    }

    requests.forEach((request) => {
      const requestTime = moment(request.createdAt, "DD/MM/YYYY, HH:mm:ss");
      const currentTime = moment();
      const timeDifference = moment
        .duration(currentTime.diff(requestTime))
        .asMinutes();

      if (
        timeDifference <= 10 &&
        !listTenMin.some((listRequest) => listRequest._id === request._id)
      ) {
        setListTenMin((prevListTenMin) => [...prevListTenMin, request]);
      } else if (
        timeDifference > 10 &&
        listTenMin.some((listRequest) => listRequest._id === request._id)
      ) {
        setListTenMin((prevListTenMin) =>
          prevListTenMin.filter(
            (listRequest) => listRequest._id !== request._id
          )
        );
      }
    });
  }, [requests]);

  useEffect(() => {
    // playSound()
  }, [oldRequest]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
      return false;
    }
  };

  const handleAddTable = () => {
    if (tables.some((table) => table.name === tableNewNumber.table)) {
      alert("Bàn này đã được tạo rồi");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/table/create`, {
        name: tableNewNumber.table,
      })
      .then((response) => {
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
      .put(`${process.env.REACT_APP_API_URL}/table/active/${table.name}`, updatedTable)
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

  const isWithin10Minutes = (createdAt) => {
    const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss");
    const currentTime = moment();
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes();

    return timeDifference <= 10;
  };

  if (!tables || !requests) {
    return <div>{<Loading />}</div>;
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
              <div className={cx("hText")}>Tất Cả Các Bàn:</div>
            </div>
            <div className={cx("hRightContainer")}>
              <div className={cx("hText")}>
                Quản Lý Yêu Cầu(sau 10 phút yêu cầu sẽ bị ẩn):
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
                  {table.isActive && <img src={tabelActive} alt="Table"></img>}
                  {!table.isActive && <img src={tabelNonActive} alt="Table"></img>}
                  <p>Bàn {table.name}</p>
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
          </div>
          <div className={cx("hRightContainer")}>
            <div className={cx("hAllNotification")}>
              {listTenMin.length === 0 && (
                <div className={cx("hEmptyNotification")}>
                  Không có yêu cầu nào trong 10 phút
                </div>
              )}
              {requests
                .filter((request) => isWithin10Minutes(request.createdAt))
                .map((request, index) => (
                  <div key={index} className={cx("hNotification")}>
                    <div>Bàn {request.table}</div>
                    <div>{moment(request.createdAt._i).format("h:mm A")}</div>
                    {console.log(moment(request.createdAt._i))}
                    <div
                      className={cx("redDot", {
                        redDotHided: !removeRedDot(request),
                      })}
                    ></div>
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
