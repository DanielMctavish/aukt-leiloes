/* eslint-disable no-unused-vars */
import React from "react"
import { Navigation } from "../_navigation/Navigation"
import { HeaderAdvertiser } from "../_header/HeaderAdvertiser"

export const AdvertiserAddProduct = () => {

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center">
            <HeaderAdvertiser />
            <section className="w-full h-screen bg-red-300 flex justify-center gap-3 items-center p-1">
                <Navigation />
                <section className="w-[80%] h-[90vh] bg-white rounded-lg"></section>
            </section>
        </div>
    )
}