/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react"
import {useNavigate} from "react-router-dom"
import logo from '../../media/logo_aukt.png'
import axios from "axios"
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
import { useSelector } from "react-redux";

export const AdvertiserCreateAuct = () => {
    const state = useSelector(state => state.aucts)
    const [progressBar, setProgressBar] = useState(0)

    const navigate = useNavigate()

    const refGeneralBody = useRef()
    const loadScreen = useRef()
    const logoElement = useRef()

    useEffect(() => {
        //console.log('aucts state geral --> ', state)

    }, [state])

    const handleSaveAuct = async () => {
        //Load Operation -------------------------------------------------------------------------------------------------------------------------------

        refGeneralBody.current.style.display = 'none'
        loadScreen.current.style.display = 'flex'
        //FIREBASE Operation --------------------------------------------------------------------------------------------------------------------------



        //Create Auct Operation-------------------------------------------------------------------------------------------------------------------------
        const currentAdvertiserStorage = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const getAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`)
        console.log('observando advertiser ', getAdvertiser.data);

        let currentAuctId

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/create-auct`, {
            creator_id: getAdvertiser.data.id,
            advertiser_id: getAdvertiser.data.id,
            title: state.title,
            tags: state.tags,
            auct_cover_img: state.auct_cover_img,
            descriptions_informations: state.descriptions_informations,
            terms_conditions: state.terms_conditions,
            auct_dates: state.auct_dates,
            limit_client: false,
            limit_date: false,
            accept_payment_methods: state.accept_payment_methods,
            value: '0',
            status: 'cataloged',
            product_timer_seconds: 30
        }).then(response => {
            console.log('resposta ao criar leilão -> ', response.data);
            currentAuctId = response.data.id
        }).catch(err => {
            console.log('erro ao criar leilão -> ', err.response);
        })
        // create Products Operation
        const productsCount = state.product_list.length;
        let productsCreated = 0;



        for (const product of state.product_list) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/create`, {
                    advertiser_id: getAdvertiser.data.id,
                    auct_id: currentAuctId,
                    title: product.title,
                    description: product.description,
                    categorie: product.categorie,
                    initial_value: product.initial_value,
                    final_value: product.final_value,
                    reserve_value: product.reserve_value,
                    color: product.color,
                    width: product.width,
                    height: product.height,
                    weight: product.weight
                });

                // Atualiza o estado da barra de progresso
                productsCreated++;
                const progress = Math.floor((productsCreated / productsCount) * 100);
                setProgressBar(progress);

                console.log('resposta ao criar produto -> ', response.data);
            } catch (err) {
                console.log('erro ao criar produto -> ', err.response);
            }
        }

        refGeneralBody.current.style.display = 'flex';
        loadScreen.current.style.display = 'none';
        navigate("/advertiser/auctions")

    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-2" />

            <section ref={loadScreen} className="w-full h-[100vh] hidden flex-col justify-center items-center overflow-y-auto bg-zinc-800 gap-1">
                <h1>criando leilão! aguarde... </h1>
                <img ref={logoElement} src={logo} alt="logo-aukt" className="w-[100px] object-cover" />

                <section className="w-[70%] h-[10px] relative mt-7 overflow-hidden rounded-md">
                    <span className="w-full h-[10px] bg-white rounded-md absolute"></span>
                    <span style={{ width: `${progressBar}%` }} className="h-[10px] bg-[#1c6891] absolute"></span>
                </section>
            </section>

            <section ref={refGeneralBody} className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto text-zinc-600 gap-1">
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
                    <button onClick={handleSaveAuct} className="w-[130px] h-[50px] bg-[#012038] text-white rounded-md">confirmar</button>
                </section>

            </section>

        </div>
    )
}