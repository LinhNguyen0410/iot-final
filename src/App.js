import { useEffect, useState } from "react";
import "./App.css";
import LineChart from "./component/Chart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const dayjs = require("dayjs");
function App() {
  const [data, setData] = useState([]);
  const [listTem, setListTem] = useState([]);
  const [listHum, setListHum] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.thingspeak.com/channels/1739935/feeds.json?api_key=7P5SC5Q7859WBH1X&results=2"
    )
      .then((response) => response.json())
      .then((data) => setData(data.feeds));
  }, []);

  if (data) {
    setInterval(() => {
      fetch(
        "https://api.thingspeak.com/channels/1739935/feeds.json?api_key=7P5SC5Q7859WBH1X&results=2"
      )
        .then((response) => response.json())
        .then((data) => {
          setData(data.feeds);
        });
    }, 15000);
  }

  useEffect(() => {
    if (data[1]?.field1) {
      setListTem((prevState) => [
        ...prevState,
        {
          value: data[1]?.field1,
          date: dayjs(data[1]?.created_at),
        },
      ]);
    }
  }, [data[1]?.field1]);
  localStorage.setItem("listTem", JSON.stringify(listTem));

  useEffect(() => {
    if (data[1]?.field2) {
      setListHum((prevState) => [
        ...prevState,
        {
          value: data[1]?.field2,
          date: dayjs(data[1]?.created_at),
        },
      ]);
    }
  }, [data[1]?.field2]);
  localStorage.setItem("listHum", JSON.stringify(listHum));

  // check show notify
  useEffect(() => {
    if (data[1]?.field1.slice(0, 2) > 35) {
      toast("Nhiệt độ đã vượt quá mức cho phép.", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        type: "error",
      });
    }
  }, [data[1]?.field1]);

  useEffect(() => {
    if (data[1]?.field2.slice(0, 2) > 70) {
      toast("Độ ẩm đã vượt quá mức cho phép.", {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
        type: "info",
      });
    }
  }, [data[1]?.field2]);

  return (
    <div className="App">
      <div className="wrapper">
        <div className="top">
          <div className="top_left">
            <img
              className="sun"
              src="https://www.pngmart.com/files/12/Sun-And-Cloud-PNG-Transparent.png"
            />
            <span className="location">
              <i class="fa-solid fa-earth-europe"></i>Ho Chi Minh City
            </span>
            <span className="time">
              <i class="fa-solid fa-clock"></i>
              {dayjs(data[1]?.created_at).format("MMMM D, YYYY h:mm")}
            </span>
          </div>
          <div className="top_right">
            <span className="tem">
              {data[1]?.field1.slice(0, 2)} C<span className="unit">o</span>
            </span>
            <span className="hum">
              <i class="fa-solid fa-cloud-showers-water"></i>
              Humidity : {data[1]?.field2.slice(0, 2)}%
            </span>
          </div>
        </div>
        <div className="chart">
          <LineChart />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
