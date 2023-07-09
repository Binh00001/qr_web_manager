import { Fragment } from "react";
import classNames from "classnames";
import styles from "~/pages/home/home.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import tabelNonActive from "~/components/assets/image/table_and_chair_non_active.png";
import tabelActive from "~/components/assets/image/table_and_chair_active.png";
import moment from "moment";
import "moment/locale/vi";

const cx = classNames.bind(styles);

function Home() {
  const [tables, setTables] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isAllActive, setIsAllActive] = useState(true);
  // const [activeTable, setActiveTable] = useState(null);

  useEffect(() => {
    axios
      .get("http://117.4.194.207:3003/table/all")
      .then((response) => {
        // console.log(response);
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://117.4.194.207:3003/call-staff/all")
        .then((response) => {
          // console.log(response);
          setRequests(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();

    // Thiết lập interval để gọi lại fetchData() sau mỗi 1 phút
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 1 phút = 60000 milliseconds
    // Xóa interval khi component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);
  const clickHandler = (table) => {
    const updatedTable = {
      // ...table,
      isActive: !table.isActive,
    };
    console.log(updatedTable);
    axios
      .put(`http://117.4.194.207:3003/table/active/${table.name}`, updatedTable)
      .then((response) => {
        console.log(response);
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
    const requestTime = moment(createdAt, "DD/MM/YYYY, HH:mm:ss"); // Chuyển đổi chuỗi thành đối tượng Moment và định dạng theo mẫu 'DD/MM/YYYY, HH:mm:ss'
    const currentTime = moment(); // Lấy thời gian hiện tại
    console.log(requestTime);
    const timeDifference = moment
      .duration(currentTime.diff(requestTime))
      .asMinutes(); // Tính khoảng thời gian trong phút

    return timeDifference <= 5; // Trả về true nếu trong vòng 5 phút, ngược lại trả về false
  };

  // console.log(activeTable);
  if (!tables || !requests) {
    return <div>Loading...</div>;
  }
  return (
    <Fragment>
      <div className={cx("Wrapper")}>
        <div className={cx("blackBar")}>
          <div className={cx("TopBar")}>
            <div className={cx("hLeftContainer")}>
              <div className={cx("hText")}>Quản Lý Bàn Ăn:</div>
              <div className={cx("hAllActiveGroup")}>
                {/* {!isAllActive && <div className={cx("hText nonActive")}>Bật Tất Cả</div>} */}
                {/* {isAllActive && <div className={cx("hText isActive")}>Bật Tất Cả</div>} */}
                {/* <button className={cx("hAllActiveButton")}>CLICK</button> */}
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
            </div>
          </div>
          <div className={cx("hRightContainer")}>
            <div className={cx("hAllNotification")}>
              {requests
                .filter((request) => isWithin5Minutes(request.createdAt)) // Lọc danh sách yêu cầu trong vòng 5 phút
                .map((request, index) => (
                  <div key={index} className={cx("hNotification")}>
                    <div>Bàn {request.table}</div>
                    <div>{moment(request.createdAt).format("h:mm A")}</div>
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
