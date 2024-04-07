/* eslint-disable react-hooks/exhaustive-deps */
import { AccessTime } from "@mui/icons-material"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";

function DisplayLocalHour() {
    const stateGroup = useSelector(state => state.groupDate.groupDates)
    const [dateList, setDateList] = useState([{
        date_auct: new Date(),
        hour: "19:00",
        group: 'D1',
    }])
    const [group, setGroup] = useState([])
    const [spanMessenger, setSpanMessenger] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        setGroup(stateGroup.groupDates)
    }, [stateGroup])

    useEffect(() => {
        const newDateList = group.map((group, index) => ({
            date_auct: dayjs(new Date()).add(index + 1, 'day').format('YYYY-MM-DD'),
            hour: '19:00',
            group
        }))
        setDateList(newDateList)
    }, [group])

    useEffect(() => {
        //console.log('observando grupo de datas -> ', dateList);
        validateDateTime()
        dispatch(addAuct({ auct_dates: dateList }))
    }, [dateList])

    const handleDateChange = (index, newDate) => {
        const newDateList = [...dateList];
        newDateList[index] = { ...newDateList[index], date_auct: dayjs(newDate).format('YYYY-MM-DD') };
        setDateList(newDateList);
    }


    const handleHourChange = (index, newHour) => {
        const newDateList = [...dateList]
        newDateList[index] = { ...newDateList[index], hour: newHour }
        setDateList(newDateList)
    }

    const validateDateTime = () => {

        let isTimeMachine = false;
        dateList.forEach(group => {
            if (dayjs(group.date_auct).valueOf() < dayjs(new Date()).valueOf()) {
                isTimeMachine = true;
            }
        });
        setSpanMessenger(isTimeMachine ? 'A data está no passado' : '');

    }

    return (
        <div className="min-w-[30%] h-[100%]
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-start items-center gap-2 overflow-y-auto
        bg-white rounded-md shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold">Data e horário</h2>
            <span className="text-red-600">{spanMessenger}</span>

            {dateList.map((dateItem, index) => (
                <div key={index} className="flex w-full justify-between 
                            items-center p-2 h-[60px] text-[#06131c] 
                            rounded-md gap-3">
                    <input
                        type="date"
                        className="bg-transparent"
                        value={dateItem.date_auct}
                        onChange={(e) => handleDateChange(index, e.target.value)} />

                    <section className="flex justify-center items-center w-[30%] gap-1">
                        <AccessTime />
                        <input
                            type="text"
                            className="bg-zinc-50/40 rounded-sm text-center w-[80px]"
                            value={dateItem.hour}
                            onChange={(e) => handleHourChange(index, e.target.value)} />
                    </section>
                </div>
            ))}
        </div>
    )
}

export default DisplayLocalHour
