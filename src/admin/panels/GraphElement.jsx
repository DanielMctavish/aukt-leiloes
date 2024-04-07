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
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
        ],
        datasets: [{
            data: [300, 5000, 5000, 1000, 5000, 3000, 5000, 5000, 5000, 12000, 5000, 5000, 5000],
            backgroundColor: 'transparent',
            borderColor: '#6400C8'
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
                max: 12000,
                legend: false,
                ticks: {
                    stepSize: () => {
                        return 2000
                    },
                    callback: (value) => {
                        //console.log('obs value >> ', value);

                        if (value > 1000) {
                            return "R$ " + value / 1000 + 'k'
                        }

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
        <div className="w-full lg:h-[90%] h-full">
            < Line data={data} options={options} width={300} height={90}></Line >
        </div >
    );
}




