import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import "../App.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
const dayjs = require("dayjs");


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: `Humidity & Temperature Monitoring on ${dayjs().get('date')}-${dayjs().get('month')}-${dayjs().get('year')}`,
        },
    },
};



function LineChart(props) {
    const listTem = JSON.parse(localStorage.getItem("listTem")) || []
    const listHum = JSON.parse(localStorage.getItem("listHum")) || []
    const [dataTem, setDataTem] = useState([])
    const [dataHum, setDataHum] = useState([])
    const labels = listTem.map((item) => {
        return dayjs(item.date).format("h:mm:ss A")
    })

    useEffect(() => {
        const dataTem = listTem.map((item) => {
            return item.value
        })
        setDataTem(dataTem)
    }, [listTem.length])

    useEffect(() => {
        const dataHum = listHum.map((item) => {
            return item.value
        })
        setDataHum(dataHum)
    }, [listHum.length])

    const findMaxDataValue = (data) => {
        const valueTem = data.map((item) => {
            return item.value
        })
        const maxTem = Math.max(...valueTem)
        return maxTem;
    }
    const data = {
        labels,
        datasets: [
            {
                label: 'Temperature',
                data: dataTem.slice(-10),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Humidity',
                data: dataHum,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    return (
        <>
            <Line options={options} data={data} />
            <div className="statistical">
                <span className="statistical_tem">
                    {`The highest temperature measured was ${findMaxDataValue(listTem)}*C`}
                </span>
                <span className="statistical_hum">{`The highest humidity measured was ${findMaxDataValue(listHum)}%`}</span>
            </div>
        </>
    )

}

export default LineChart;