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
        <section className="w-full h-full flex 
        justify-center items-center rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-b-[2px] border-[#e3e3e3] z-[2] p-3 gap-3">

            {
                description ?
                    <>
                        <div onClick={handleMaximizeCover} ref={refDisplayLot} 
                        className="w-[40%] h-[80%] flex flex-col relative justify-center items-center gap-2">

                            <img src={cover} alt=""
                                className="w-full  object-cover shadow-lg shadow-[#0a0a0a50] hover:scale-[1.2] transition duration-150 rounded-md" />

                        </div>

                        <div className="w-[50%] h-[80%] flex flex-col justify-start items-center p-1 bg-[#393939] gap-1 rounded-md">
                            <h1 className="font-bold text-[34px] text-white drop-shadow-lg">{title}</h1>

                            <section className="flex w-[90%] justify-end h-[100px] relative">

                                <div className="flex justify-end items-end bg-[#135680] 
                                        w-[80%] h-full rounded-md text-white text-[20px] p-2">
                                    <p className="text-right">
                                        peças relevantes e raras no mundo das miniaturas.
                                    </p>
                                </div>

                            </section>

                            <section className="w-[90%] h-[50%] overflow-y-auto">
                                <p className="text-white drop-shadow-md shadow-[#0c0c0c99]">
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