/* eslint-disable react-hooks/exhaustive-deps */
import { AccessTime, AddCircle } from "@mui/icons-material"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";


function DisplayLocalHour() {
    const [time, setTime] = useState('')
    const [currentDate, setCurrentDate] = useState()
    const [quantityDate, setQuantityDate] = useState(1)
    const [dateList, setDateList] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        //console.log('data list atual ->', dateList);

    }, [dateList])


    const handleSetTime = (event) => {
        const currentTime = event.target.value;
        const numericValue = currentTime.replace(/\D/g, '');

        if (numericValue.length >= 2) {
            const formattedTime = numericValue.slice(0, 2) + ':' + numericValue.slice(2);
            if (formattedTime.split("").length >= 6) return false
            setTime(formattedTime);
        } else {
            setTime(numericValue);
        }
    }

    const handleMoreDateSlot = () => {
        if (!currentDate || !time) return null;

        let increment = quantityDate + 1;
        setQuantityDate(increment);

        if (quantityDate >= 6) return false;

        // Atualiza o estado local imediatamente
        const dateTimeString = `${currentDate} ${time}`;
        const parseDate = new Date(dateTimeString).toISOString()
        //console.log('observando data e hora -> ', parseDate);

        const updatedDateList = [...dateList, parseDate];
        setDateList(updatedDateList);

        // Dispara a ação no Redux com o novo estado
        dispatch(addAuct({ auct_dates: updatedDateList }));

        setTime(0);
    };



    return (
        <div className="min-w-[30%] h-[100%]
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-start items-center gap-2 overflow-y-auto
        bg-white rounded-md shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold">Data e horário</h2>

            {
                dateList.map((data, index) => {

                    return (
                        <div key={index} className="flex w-full justify-between 
                            items-center p-2 h-[60px] text-[#06131c] 
                            rounded-md gap-3">
                            <div type="date" name="" id="" className="bg-transparent" >{dayjs(data).format('DD/MM/YYYY')}</div>
                            <section className="flex justify-center items-center w-[30%] gap-1">
                                <AccessTime />
                                <div className="bg-zinc-50/40 rounded-sm text-center w-[80px]">{dayjs(data).format('HH:mm')}</div>
                            </section>
                        </div>
                    );
                })
            }

            {quantityDate === 7
                ? "" :
                <div className="flex w-full justify-between 
                        items-center p-2 h-[60px] text-[#06131c] 
                        rounded-md bg-[#cccccc] gap-3">
                    {/* <DateRange/> */}
                    <input type="date" name="" id="" className="bg-transparent" onChange={(e) => { setCurrentDate(e.target.value) }} />
                    <section className="flex justify-center items-center w-[30%] gap-1">
                        <AccessTime />
                        <input type="datetime" name="" id="" className="bg-zinc-50/40 rounded-sm text-center w-[80px]" value={time} onChange={handleSetTime} />
                    </section>
                </div>}



            <div onClick={handleMoreDateSlot} className="flex w-full justify-center cursor-pointer 
            items-center p-2 h-[60px] text-[#06131c] 
            rounded-md bg-[#cccccc] hover:bg-[#e9e9e9] gap-3">
                <AddCircle style={{ fontSize: '40px' }} />
            </div>

        </div>
    )
}

export default DisplayLocalHour