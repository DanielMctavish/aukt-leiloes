import CenterFloor from "./components/CenterFloor"
import FloorBids from "./components/FloorBids"
import FloorLots from "./components/FloorLots"
import FloorNavigation from "./components/FloorNavigation"
import backgroundFloor from "../media/backgrounds/sheldon-liu-FrQKfzoTgsw-unsplash.jpg"


function AuctFloor() {

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-hidden p-[2vh] gap-[2vh]">
            
            <img src={backgroundFloor} alt="" className="flex absolute top-0  h-full w-[100%]  object-cover z-[1]" />
            <FloorNavigation />

            <div className="flex w-full h-full justify-between items-center gap-[2vh] z-[2]">
                <section className="w-full h-full flex flex-col justify-between items-center relative gap-[2vh]">
                    <CenterFloor />
                    <FloorLots />
                </section>

                <FloorBids />
            </div>

        </div>
    )

}

export default AuctFloor