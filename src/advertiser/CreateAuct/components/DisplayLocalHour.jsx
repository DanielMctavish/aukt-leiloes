import { AccessTime, LocationOn, AddCircle } from "@mui/icons-material"


function DisplayLocalHour() {

    return (
        <div className="w-[33%] h-[100%]
        flex flex-col justify-start items-center gap-2
        bg-white rounded-md shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold">Local e horário</h2>

            <div className="flex w-full justify-between 
            items-center p-2 h-[60px] text-[#06131c] 
            rounded-md bg-[#cccccc] gap-3">
                {/* <DateRange/> */}
                <input type="date" name="" id="" className="bg-transparent" />
                <section className="flex justify-center items-center w-[30%]">
                    <AccessTime />
                    <input type="datetime" name="" id="" className="bg-transparent text-center w-[100px]" value={'12:12'} />
                </section>
                <LocationOn />
                <span>local:AUK</span>
            </div>

            <div className="flex w-full justify-between 
            items-center p-2 h-[60px] text-[#06131c] 
            rounded-md bg-[#cccccc] gap-3">
                {/* <DateRange/> */}
                <input type="date" name="" id="" className="bg-transparent" />
                <section className="flex justify-center items-center w-[30%]">
                    <AccessTime />
                    <input type="datetime" name="" id="" className="bg-transparent text-center w-[100px]" value={'12:12'} />
                </section>
                <LocationOn />
                <span>local:AUK</span>
            </div>

            <div className="flex w-full justify-between 
            items-center p-2 h-[60px] text-[#06131c] 
            rounded-md bg-[#cccccc] gap-3">
                {/* <DateRange/> */}
                <input type="date" name="" id="" className="bg-transparent" />
                <section className="flex justify-center items-center w-[30%]">
                    <AccessTime />
                    <input type="datetime" name="" id="" className="bg-transparent text-center w-[100px]" value={'12:12'} />
                </section>
                <LocationOn />
                <span>local:AUK</span>
            </div>

            <div className="flex w-full justify-center cursor-pointer 
            items-center p-2 h-[60px] text-[#06131c] 
            rounded-md bg-[#cccccc] hover:bg-[#e9e9e9] gap-3">
                <AddCircle style={{ fontSize: '40px'}} />
            </div>

        </div>
    )
}

export default DisplayLocalHour