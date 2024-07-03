/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function DashboardAuctControl() {
    const [advertiserSession, setAdvertiserSession] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const currentSession = localStorage.getItem("advertiser-session-aukt")

        console.log("observando sessão -> ", currentSession)

        setAdvertiserSession(JSON.parse(currentSession))
        if (!currentSession) {
            navigate("/")
            return
        }
    }, [])


    return (
        <div className="w-full h-[100vh] flex justify-center items-center gap-1">
            <span className="font-bold text-[18px]">{advertiserSession.name}</span>
            <span>você pode controlar os leilões por aqui.</span>
        </div>
    )
}

export default DashboardAuctControl;