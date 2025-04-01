import { LocationOn, AccessTime } from "@mui/icons-material"
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";


function DisplayDateLimite() {
    const stateTheme = useSelector(state => state.theme)

    const refMain = useRef()

    useEffect(() => {
        const cookieTheme = localStorage.getItem("dark-mode-advertiser-auct");
        if (cookieTheme === "true") {
            refMain.current.style.background = "#2d2d2d"
            refMain.current.style.color = "#efefef"
        } else {
            refMain.current.style.background = "#ffffff"
            refMain.current.style.color = "#595959"
        }

    }, [stateTheme])

    return (
        <div ref={refMain} className="w-[33%] h-[100%] bg-white 
        rounded-md shadow-2xl shadow-[#00000039]
        hover:scale-[1.02] transition-[1s] 
        p-3 relative flex flex-col justify-around">
            <h2 className="font-bold">Data limite para inscrições</h2>
            <div className="flex w-full justify-between 
            items-center p-2 h-[60px] text-white 
            rounded-md bg-[#e85d5d] gap-3">
                {/* <DateRange/> */}
                <input type="date" name="" id="" className="bg-transparent" />
                <section className="flex justify-center items-center w-[30%]">
                    <AccessTime />
                    <input type="datetime" name="" id="" className="bg-transparent text-center w-[100px]" value={'12:12'} />
                </section>
                <LocationOn />
                <span>local:AUK</span>
            </div>
        </div>
    )
}

export default DisplayDateLimite;