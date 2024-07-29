/* eslint-disable react/prop-types */
import { useEffect } from "react";
import backgroundFloor from "../../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"
import CenterFloor from "../components/CenterFloor";
import FloorLots from "../components/FloorLots";
import FloorNavigation from "../components/FloorNavigation";

import av01 from "../../media/avatar-floor/avatar_01.png"
import av02 from "../../media/avatar-floor/avatar_02.png"
import av03 from "../../media/avatar-floor/avatar_03.png"
import av04 from "../../media/avatar-floor/avatar_04.png"
import av05 from "../../media/avatar-floor/avatar_05.png"
import av06 from "../../media/avatar-floor/avatar_06.png"
import av07 from "../../media/avatar-floor/avatar_07.png"
import av08 from "../../media/avatar-floor/avatar_08.png"

const avatarIndex = [av01, av02, av03, av04, av05, av06, av07, av08]

function WinnerScreen({ currentProduct, winner, auct }) {

    useEffect(() => { }, [currentProduct, winner,auct])

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">

            <img src={backgroundFloor} alt="" className="flex absolute top-0  h-full w-[100%]  object-cover z-[1]" />
            <FloorNavigation auction={auct} group={currentProduct.group} />

            <div className="flex lg:flex-row flex-col w-full h-full justify-between items-center gap-[2vh] z-[2] overflow-y-auto">

                <section className="lg:w-[70%] w-[99%] lg:h-[80vh] flex flex-col justify-between items-center relative gap-[2vh]">

                    <CenterFloor title={currentProduct.title}
                        cover={currentProduct.cover_img_url}
                        description={currentProduct.description}
                        auction={auct} />

                    <FloorLots products={auct.product_list}
                        currentProduct={currentProduct} />

                </section>

                <div className="lg:w-[28%] w-[99%] lg:h-[94%] min-h-[60vh]
                flex flex-col justify-center items-center
                relative p-2 rounded-[22px] bg-[#88ca9bad] 
                backdrop-blur-lg shadow-xl shadow-[#1414143a] 
                border-[2px] border-[#e3e3e3] z-[2] gap-1 overflow-y-auto">

                    {/* TELA LATERAL */}
                    {
                        currentProduct.Winner ?
                            <span style={{ textShadow: "2px 3px 1px #484848" }}
                                className="text-[28px] font-bold text-[#fff]">Produto Arrematado</span> :
                            <span style={{ textShadow: "2px 3px 1px #484848" }}
                                className="text-[28px] font-bold text-[#fff]">Produto não arrematado</span>
                    }

                    {
                        currentProduct.Winner &&
                        <img src={avatarIndex[currentProduct.Winner.client_avatar]} alt="client-avatar"
                            className="w-[100px] h-[100px] object-cover rounded-full bg-[#467a55]" />
                    }
                    {currentProduct.Winner &&
                        <span style={{ textShadow: "2px 1px 1px #484848" }}
                            className="text-white">{currentProduct.Winner.nickname}</span>
                    }

                </div>
            </div>

        </div>
    )
}

export default WinnerScreen;