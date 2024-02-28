/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { getCurrentFile } from "./functions/handleImageChange"


export const AdvertiserCreateAuct = () => {
    const state = useSelector(state => state.aucts)
    const [progressBar, setProgressBar] = useState(0)
    const [aucts, setAucts] = useState([])
    const [errorDetector, setErrorDetector] = useState()

    const navigate = useNavigate()

    const refGeneralBody = useRef()
    const refErroSpanElement = useRef()
    const loadScreen = useRef()
    const logoElement = useRef()

    useEffect(() => {

        setAucts(state)
        utilsFunctionr.errorSend(errorDetector)

    }, [state, errorDetector])




    const handleSaveAuct = async () => {
        try {

            console.log('observando auct >>> ', aucts);

            if (!aucts.title) {
                throw new Error("necessário ter um título.")
            }else if (!aucts.categories) {
                throw new Error("selecione uma categoria.")
            } else if (aucts.tags.length === 0 || !aucts.tags) {
                throw new Error("necessário adicionar tags.")
            } else if (!aucts.descriptions_informations) {
                throw new Error("necessário ter descrições.")
            } else if (!aucts.terms_conditions) {
                throw new Error("necessário adicionar os termos e condições.")
            } else if (!aucts.auct_dates || aucts.auct_dates.length === 0) {
                throw new Error("não se esqueça das datas!")
            } else if (!aucts.accept_payment_methods || aucts.accept_payment_methods.length === 0) {
                throw new Error("por favor, selecione as formas de pagamento para este leilão.")
            } else if(aucts.product_list.length ===0){
                throw new Error("por favor, selecione uma planilha de produtos.")
            }

            //Load Operation -------------------------------------------------------------------------------------------------------------------------------

            refGeneralBody.current.style.display = 'none'
            loadScreen.current.style.display = 'flex'

            //FIREBASE Operation --------------------------------------------------------------------------------------------------------------------------

            const formData = new FormData();
            formData.append("cover-auct-image", getCurrentFile());
            let currentUploadedImage

            // REQUEST01@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/upload-cover-auct`, formData, {
                "Content-Type": "multipart/form-data"
            }).then(response => {
                console.log('resposta ao upar imagem -> ', response.data.currentImage);
                currentUploadedImage = response.data.currentImage

            }).catch(err => {
                console.log('err ao tentar upor cover foto auct', err.response)
                throw new Error("necessário enviar uma imagem de leilão")
            })



            //Create Auct Operation-------------------------------------------------------------------------------------------------------------------------
            const currentAdvertiserStorage = await JSON.parse(localStorage.getItem("advertiser-session-aukt"))
            // REQUEST02@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            const getAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`)
            //console.log('observando advertiser ', getAdvertiser.data);

            if (!getAdvertiser.advertiser_id) {
                throw new Error("erro ao tentar identificar anunciante.")
            }

            let currentAuctId
            let currentAuctNanoId

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/create-auct`, {
                creator_id: getAdvertiser.data.id,
                advertiser_id: getAdvertiser.data.id,
                title: aucts.title,
                categorie: aucts.categories,
                tags: aucts.tags,
                auct_cover_img: currentUploadedImage,
                descriptions_informations: aucts.descriptions_informations,
                terms_conditions: aucts.terms_conditions,
                auct_dates: aucts.auct_dates,
                limit_client: false,
                limit_date: false,
                accept_payment_methods: aucts.accept_payment_methods,
                value: '0',
                status: 'cataloged',
                product_timer_seconds: 30
            }).then(response => {
                //console.log('resposta ao criar leilão -> ', response.data);
                currentAuctId = response.data.currentAuct.id
                currentAuctNanoId = response.data.currentAuct.nano_id
            }).catch(err => {
                throw new Error(err.response.data)
            })


            // create Products Operation
            const productsCount = aucts.product_list.length;
            let productsCreated = 0;

            for (const product of aucts.product_list) {
                console.log('observando produto data -> ', product);

                try {

                    // REQUEST03@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/create`, {
                        advertiser_id: getAdvertiser.data.id,
                        auct_nanoid: currentAuctNanoId,
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
                        weight: product.weight,
                        cover_img_url: "string",
                        highlight_product: true
                    });

                    // Atualiza o estado da barra de progresso
                    productsCreated++;
                    const progress = Math.floor((productsCreated / productsCount) * 100);
                    setProgressBar(progress);

                } catch (err) {
                    throw new Error(err.response.data)
                }
            }


            navigate("/advertiser/auctions")

        } catch (error) {
            refGeneralBody.current.style.display = 'flex';
            loadScreen.current.style.display = 'none';
            setErrorDetector(error.message)
        }

    }

    const utilsFunctionr = {
        errorSend: () => {

            if (errorDetector !== undefined && errorDetector !== "") {

                refErroSpanElement.current.innerHTML = errorDetector
                refErroSpanElement.current.style.opacity = "1"
                refErroSpanElement.current.style.display = "flex"
                refErroSpanElement.current.style.position = "fixed"

                setTimeout(() => {
                    refErroSpanElement.current.style.transition = "3s"
                    refErroSpanElement.current.style.opacity = "0"
                }, 300);

                setTimeout(() => {
                    refErroSpanElement.current.style.display = "none"
                }, 3000);
                setErrorDetector()
            }
        }
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

            <section ref={refGeneralBody} className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto text-zinc-600 gap-1 relative">
                <NavAdvertiser path='anunciante > criar leilão' />

                <span ref={refErroSpanElement}
                    className="w-[80%] hidden justify-center 
                items-center p-2 bg-red-600/80 z-[99]
                absolute top-2 rounded-md text-white">
                    erro detectado!
                </span>

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