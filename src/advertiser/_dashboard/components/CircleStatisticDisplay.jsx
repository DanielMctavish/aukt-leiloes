import { Chart, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from 'react-chartjs-2'

function CircleStatisticDisplay() {

    Chart.register(
        ArcElement, Tooltip, Legend
    )
    const data = {
        labels: ['Clientes AUKT', 'Seus Clientes'],
        datasets: [{
            label: 'usuários',
            data: [500, 230],
            backgroundColor: ['#434E6B', '#3359c3'],
        }]
    }
    const options = {
        defaultFontSize: "14px",
        maintainAspectRatio: false,
    }

    return (
        <div className="w-[80%] lg:w-[40%] h-[40vh] 
        mt-3 p-2 bg-[#fff] text-zinc-600 
        shadow-lg shadow-[#17171722] relative 
        rounded-md
        flex flex-col justify-center items-center">

            <h2 className="w-full flex justify-start absolute top-1 left-1 p-2">Resumo de Clientes</h2>
            <div  className="h-[70%]" >
                <Doughnut data={data} options={options} />
            </div>

        </div>
    );
}

export default CircleStatisticDisplay;
