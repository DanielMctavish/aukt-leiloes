/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2"
import {
    Chart as Chartjs,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from "chart.js"

Chartjs.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
)

export const GraphElement = () => {

    const data = {
        labels: [
            "Jan 1",
            "Jan 2",
            "Jan 3",
            "Jan 4",
            "Jan 5",
            "Jan 6",
            "Jan 7",
            "Jan 8",
            "Jan 9",
            "Jan 10",
            "Jan 11",
            "Jan 12",
        ],
        datasets: [{
            data: [35000, 37000, 39000, 32000, 38000, 32000, 25000,35000, 35000, 35000, 35000, 105000, 105000],
            backgroundColor: 'transparent',
            borderColor: '#b74900'
        }]
    }
    const options = {
        legend: {
            display: false,
            labels: {
                display: false
            }
        },
        plugins: {
            legend: false,
            maintainAspectRatio: false
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    borderdash: [1]
                },
                ticks: {
                    display: true
                }
            },
            y: {
                min: 0,
                max: 100000,
                legend: false,
                ticks: {
                    stepSize: () => {
                        return 5000
                    },
                    callback: (value) => {
                        //console.log('obs value >> ', value);

                        return "R$ " + value

                    },
                    display: true
                },
                grid: {
                    borderDash: [10]
                }
            }
        }
    }

    return (
        <div className="w-full h-[90%]">
            < Line data={data} options={options} width={200} height={50}></Line >
        </div >
    );
}




