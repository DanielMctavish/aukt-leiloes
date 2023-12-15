/* eslint-disable no-unused-vars */
import React from "react"
import AssideAdvertiser from "../_asside/AssideAdvertiser"
import NavAdvertiser from "../_navigation/NavAdvertiser"
import DisplayCreateEvent from "./components/DisplayCreateEvent"
import DisplayTableProducts from "./components/DisplayTableProducts"
import DisplayProductsCsv from "./components/DisplayProductsCsv"
import DisplayInformations from "./components/DisplayInformations"
import DisplayLocalHour from "./components/DisplayLocalHour"
import DisplayTermsConditions from "./components/DisplayTermsConditions"
import DisplayMethodsPayments from "./components/DisplayMethodsPayments"
import DisplayLimitations from "./components/DisplayLimitations"
import DisplayDateLimite from "./components/DisplayDateLimite"

export const AdvertiserCreateAuct = () => {

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-2" />

            <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto text-zinc-600 gap-1">
                <NavAdvertiser />

                <section className="w-full min-h-[60%] relative p-3 flex gap-2">
                    <DisplayCreateEvent />
                    <DisplayTableProducts />
                </section>

                <section className="w-full min-h-[40vh] p-3 flex gap-2">
                    <DisplayProductsCsv />
                    <DisplayInformations />
                    <DisplayLocalHour />
                </section>

                <section className="w-full min-h-[40vh] p-3 flex gap-2">
                    <DisplayTermsConditions />
                </section>

                <section className="w-full min-h-[20vh]
                justify-between items-center gap-3 
                p-3 flex">
                    <DisplayMethodsPayments />
                    <DisplayLimitations />
                    <DisplayDateLimite />
                </section>

                <section className="w-full min-h-[10vh] p-2 flex justify-center items-center">
                    <button className="w-[130px] h-[50px] bg-[#012038] text-white rounded-md">confirmar</button>
                </section>

            </section>

        </div>
    )
}