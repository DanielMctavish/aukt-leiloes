/* eslint-disable react/prop-types */

import { useRef } from "react";


function CenterFloor({ title, cover, description }) {

    const refDisplayLot = useRef()

    const handleMaximizeCover = () => {
        refDisplayLot.current.style.position = "absolute";
        refDisplayLot.current.style.width = "100%";
        refDisplayLot.current.style.heigth = "100vh";
        refDisplayLot.current.style.zIndex = "9999";
        refDisplayLot.current.style.backgroundColor = "white";
    }

    return (
        <section className="w-full h-[60vh] flex lg:flex-row flex-col 
        lg:justify-center justify-start items-center rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-b-[2px] border-[#e3e3e3] z-[2] p-3 gap-3 overflow-y-auto">

            {
                description ?
                    <>
                        <div onClick={handleMaximizeCover} ref={refDisplayLot}
                            className="lg:w-[40%] w-full lg:h-[80%] flex flex-col relative justify-center items-center gap-2">

                            <img src={cover} alt=""
                                className="h-[99%]  object-cover shadow-lg shadow-[#0a0a0a50] hover:scale-[1.2] transition duration-150 rounded-md" />

                        </div>

                        <div className="lg:w-[50%] w-full lg:h-[80%] min-h-[40vh] flex flex-col justify-start items-center p-1 bg-[#393939] gap-1 rounded-md">
                            <h1 className="font-bold lg:text-[34px] text-[18px] text-white drop-shadow-lg">{title}</h1>

                            <section className="w-[90%] h-[50%] overflow-y-auto">
                                <p className="text-white lg:text-[14px] text-[12px] drop-shadow-md shadow-[#0c0c0c99]">
                                    {description}
                                </p>
                            </section>
                        </div>
                    </>
                    : ""
            }

        </section>
    )
}

export default CenterFloor;