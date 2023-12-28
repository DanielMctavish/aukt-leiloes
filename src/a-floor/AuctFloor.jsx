import CenterFloor from "./components/CenterFloor"
import FloorBids from "./components/FloorBids"
import FloorLots from "./components/FloorLots"
import FloorNavigation from "./components/FloorNavigation"



function AuctFloor() {

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#D8DEE8] text-zinc-600 relative overflow-y-auto">

            <FloorNavigation />

            <section className="w-full flex justify-end items-center relative">
                <CenterFloor />
                <FloorBids />
            </section>

            <section className="w-full relative">
                <FloorLots />
            </section>

        </div>
    )

}

export default AuctFloor