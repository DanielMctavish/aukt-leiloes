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
            "Fev 1",
            "Mar 1",
            "Abr 1",
            "Mai 1",
            "Jun 1",
            "Jul 1",
            "Ago 1",
            "Set 1",
            "Out 1",
            "Nov 1",
            "Dez 1",
        ],
        datasets: [{
            data: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000],
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
                    display: false
                }
            },
            y: {
                min: 0,
                max: 10000,
                legend: false,
                ticks: {
                    stepSize: () => {
                        return 2000
                    },
                    callback: (value) => {
                        //console.log('obs value >> ', value);

                        return "R$ " + value

                    },
                    display: false
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




