import { AccessTime } from "@mui/icons-material"
import hamerIcon from "../../media/icons/Hammer.png"

function CronCard() {

    return (
        <div className="w-[98%] gap-3 rounded-md text-[#191F2F]
        flex flex-col justify-start items-center absolute bottom-3">

            <div className="w-full h-[60px] flex justify-between p-3 
            shadow-lg shadow-[#0000001d]
            items-center rounded-md bg-[#e3e3e3]">

                <div className="w-[40px] h-[40px] border-[1px] 
                border-zinc-800 rounded-full flex justify-center items-center">
                    <AccessTime />
                </div>

                <span className="text-[16px] font-bold">R$ 1200,00</span>

                <div className="flex gap-3 justify-center items-center">
                    <span className="text-[16px] font-bold">0:00</span>
                </div>

            </div>

            <div className="w-full h-[100%] flex justify-between items-center relative gap-2 text-[16px]">

                <span className="flex min-w-[60%] h-[40px] bg-[#e3e3e3] 
                shadow-lg shadow-[#0000001d]
                font-light justify-center items-center rounded-md">
                    R$ 1200,00
                </span>

                <button className="flex flex-1 h-[40px] 
                justify-center items-center bg-[#e3e3e3] 
                rounded-md shadow-lg shadow-[#0000001d]">
                    <img src={hamerIcon} alt="" className="w-[32px] object-cover" />
                </button>

            </div>

        </div>
    )
}

export default CronCard