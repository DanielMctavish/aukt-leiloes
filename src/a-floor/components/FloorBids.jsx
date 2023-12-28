import { AccountCircle, AccessTime } from "@mui/icons-material"
import hammerIcon from "../../media/icons/Hammer.png"

function FloorBids() {

    return (
        <div className="w-[400px] h-[73vh] 
        flex flex-col justify-start items-center
        bg-white relative p-2">

            <section className="w-[90%] h-[60px] rounded-md text-white
            flex justify-between relative
            bg-gradient-to-r from-[#4D5BD4] to-[#FC9F9F]
            items-center p-3">
                <AccountCircle />
                <span className="font-bold">R$ 358,00</span>
                <img src={hammerIcon} alt="" className="w-[38px] object-cover" />
            </section>

            <section className="w-[90%] h-[210px] rounded-md text-white
            flex flex-col justify-start absolute
            bg-[#f9f9f9] bottom-3
            items-center">

                <div className="w-full h-[60px] flex justify-between p-3 items-center rounded-md bg-[#D44D4D] text-white">
                    <span className="font-bold text-[24px]">R$ 1200,00</span>
                    <div className="flex gap-3 justify-center items-center">
                        <span style={{ fontSize: "36px" }} className="flex justify-center items-center">
                            <AccessTime />
                        </span>
                        <span className="font-bold text-[24px]">0:00</span>
                    </div>
                </div>

                <div className="w-full h-[100%] flex flex-col justify-between items-center p-3">
                    <span className="text-[#191F2F] text-[40px] font-bold">R$ 1200,00</span>
                    <button className="text-white w-full h-[36px] flex justify-center items-center bg-[#191F2F] rounded-md">Dar lance</button>
                </div>

            </section>

        </div>
    )
}

export default FloorBids