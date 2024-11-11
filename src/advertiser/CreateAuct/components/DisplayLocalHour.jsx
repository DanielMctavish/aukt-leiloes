/* eslint-disable react-hooks/exhaustive-deps */
import { AccessTime, CalendarMonth, Schedule } from "@mui/icons-material"
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addAuct } from "../../../features/auct/Auct";

function DisplayLocalHour() {
    const stateTheme = useSelector(state => state.theme)
    const stateGroup = useSelector(state => state.groupDate?.groupDates || {})
    const [dateList, setDateList] = useState([{
        date_auct: dayjs(new Date()).format('YYYY-MM-DD'),
        hour: "19:00",
        group: 'D1',
        group_status: "cataloged"
    }])
    const [group, setGroup] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const dispatch = useDispatch()
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

    useEffect(() => {
        if (stateGroup.groupDates && Array.isArray(stateGroup.groupDates)) {
            setGroup(stateGroup.groupDates)
        }
    }, [stateGroup])

    useEffect(() => {
        if (Array.isArray(group) && group.length > 0) {
            const newDateList = group.map((groupItem, index) => ({
                date_auct: dayjs(new Date()).add(index + 1, 'day').format('YYYY-MM-DD'),
                group_status: "cataloged",
                hour: '19:00',
                group: groupItem
            }))
            setDateList(newDateList)
        }
    }, [group])

    const handleDateChange = (index, newDate) => {
        if (dayjs(newDate).isBefore(dayjs(), 'day')) {
            setErrorMessage('A data não pode ser no passado');
            return;
        }

        setErrorMessage('');
        const newDateList = [...dateList];
        newDateList[index] = { ...newDateList[index], date_auct: dayjs(newDate).format('YYYY-MM-DD') };
        setDateList(newDateList);
        dispatch(addAuct({ auct_dates: newDateList }));
    }

    const handleHourChange = (index, newHour) => {
        const newDateList = [...dateList]
        newDateList[index] = { ...newDateList[index], hour: newHour }
        setDateList(newDateList)
    }

    return (
        <div ref={refMain} className="min-w-[30%] h-[100%] bg-white rounded-lg p-6
            hover:z-[77] hover:scale-[1.02] transition-all duration-300 ease-in-out
            shadow-xl shadow-[#00000020] flex flex-col justify-start gap-6">
            <h2 className="font-bold text-xl flex items-center gap-2">
                <Schedule className="text-[#012038]" />
                Data e Horário
            </h2>

            {errorMessage && (
                <span className="text-red-500 text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errorMessage}
                </span>
            )}

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100%-4rem)]">
                {dateList.map((dateItem, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-[#012038] font-medium mb-2">
                            <CalendarMonth />
                            <span>Grupo {dateItem.group}</span>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">Data</label>
                                <input
                                    type="date"
                                    className="w-full h-10 px-3 rounded-md border border-gray-300 
                                    focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                    transition-all duration-200 outline-none"
                                    value={dateItem.date_auct}
                                    onChange={(e) => handleDateChange(index, e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm text-gray-600 mb-1 block">Horário</label>
                                <div className="flex items-center gap-2 h-10">
                                    <AccessTime className="text-[#012038]" />
                                    <input
                                        type="time"
                                        className="flex-1 h-full px-3 rounded-md border border-gray-300
                                        focus:ring-2 focus:ring-[#012038] focus:border-transparent
                                        transition-all duration-200 outline-none"
                                        value={dateItem.hour}
                                        onChange={(e) => handleHourChange(index, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DisplayLocalHour
