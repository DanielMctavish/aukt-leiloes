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
import { addAuct } from "../../features/auct/Auct";
import { useDispatch } from "react-redux";

export const AdvertiserCreateAuct = () => {
    const state = useSelector(state => state.aucts)
    const stateErrors = useSelector(state => state.errorReports)
    const dispatch = useDispatch();

    const [progressBar, setProgressBar] = useState(0)
    const [aucts, setAucts] = useState([])
    const [errorDetector, setErrorDetector] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const refGeneralBody = useRef()
    const refErroSpanElement = useRef()
    const loadScreen = useRef()
    const logoElement = useRef()

    // Verificar login
    useEffect(() => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        if (!currentSession) {
            navigate("/")
            return;
        }
    }, []);

    // Atualizar aucts e erros
    useEffect(() => {
        setAucts(state)
    }, [state]);

    useEffect(() => {
        if (stateErrors.error) {
            setErrorDetector(true)
            if (refErroSpanElement.current) {
                refErroSpanElement.current.innerHTML = stateErrors.error
                refErroSpanElement.current.style.opacity = "1"
                refErroSpanElement.current.style.display = "flex"
                refErroSpanElement.current.style.position = "fixed"

                setTimeout(() => {
                    if (refErroSpanElement.current) {
                        refErroSpanElement.current.style.transition = "3s"
                        refErroSpanElement.current.style.opacity = "0"
                    }
                }, 300);

                setTimeout(() => {
                    if (refErroSpanElement.current) {
                        refErroSpanElement.current.style.display = "none"
                    }
                }, 3000);
            }
        } else {
            setErrorDetector(false)
        }
    }, [stateErrors]);

    const handleSaveAuct = async () => {
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const configAuth = {
            headers: {
                "Authorization": `Bearer ${currentSession.token}`
            }
        }

        try {
            const messages = {
                title: "necessário ter um título.",
                categories: "selecione uma categoria.",
                tags: "necessário adicionar tags.",
                descriptions_informations: "necessário ter descrições.",
                terms_conditions: "necessário adicionar os termos e condições.",
                auct_dates: "não se esqueça das datas!",
                methods_payments: "por favor, selecione as formas de pagamento para este leilão.",
                product_list: "por favor, selecione uma planilha de produtos."
            };

            for (const [key, value] of Object.entries(aucts)) {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                    const errorMessage = messages[key];
                    if (errorMessage) {
                        throw new Error(errorMessage);
                    }
                }
            }

            //Load Operation
            refGeneralBody.current.style.display = 'none'
            loadScreen.current.style.display = 'flex'
            setIsLoading(true)

            //FIREBASE Operation
            const formData = new FormData();
            formData.append("cover-auct-image", getCurrentFile());
            let currentUploadedImage

            // REQUEST01
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/upload-cover-auct`, formData, {
                "Content-Type": "multipart/form-data"
            }).then(response => {
                currentUploadedImage = response.data.currentImage
            }).catch(err => {
                throw new Error("necessário enviar uma imagem de leilão")
            })

            //Create Auct Operation
            // REQUEST02
            const getAdvertiser = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentSession.email}`, configAuth)

            if (!getAdvertiser) {
                throw new Error("erro ao tentar identificar anunciante.", getAdvertiser, currentSession)
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
            }, configAuth).then(response => {
                currentAuctId = response.data.id
                currentAuctNanoId = response.data.nano_id
            })

            // create Products Operation
            const productsCount = aucts.product_list.length;
            let productsCreated = 0;

            for (const [index, product] of aucts.product_list.entries()) {
                // REQUEST03
                await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/create-product`, {
                    lote: parseInt(index + 1),
                    advertiser_id: getAdvertiser.data.id,
                    cartela_id: undefined,
                    group: product.group,
                    auct_nanoid: currentAuctNanoId,
                    auct_id: currentAuctId,
                    title: product.title,
                    description: product.description,
                    categorie: product.categorie,
                    real_value:0,
                    initial_value: product.initial_value,
                    reserve_value: product.reserve_value,
                    width: 0,
                    height: 0,
                    weight: 0,
                    cover_img_url: "string",
                    highlight_product: true,
                    group_imgs_url: [],
                }, configAuth).then(response => {
    
                }).catch(err => {
                    throw new Error(err.response.data)
                })

                // Atualiza o estado da barra de progresso
                productsCreated++;
                const progress = Math.floor((productsCreated / productsCount) * 100);
                setProgressBar(progress);
            }

            navigate("/advertiser/auctions")
            setIsLoading(false)

        } catch (error) {
            refGeneralBody.current.style.display = 'flex';
            loadScreen.current.style.display = 'none';
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-[#F4F4F4] overflow-hidden">
            <div className="fixed inset-0 z-[9999]">
                <AssideAdvertiser MenuSelected="menu-2" />
            </div>

            <NavAdvertiser path='anunciante > criar leilão' />

            <div className="w-full max-w-[1400px] mx-auto mt-[6vh] px-4 sm:px-6 lg:px-8 h-[90vh] overflow-y-auto">
                <section ref={loadScreen} className="w-full h-full hidden flex-col justify-center items-center bg-zinc-800 gap-1 text-white">
                    <h1>criando leilão! aguarde... </h1>
                    <img ref={logoElement} src={logo} alt="logo-aukt" className="w-[100px] object-cover" />

                    <section className="w-[70%] h-[10px] relative mt-7 overflow-hidden rounded-md">
                        <span className="w-full h-[10px] bg-white rounded-md absolute"></span>
                        <span style={{ width: `${progressBar}%` }} className="h-[10px] bg-[#1c6891] absolute"></span>
                    </section>
                </section>

                <section ref={refGeneralBody} className="w-full flex flex-col justify-start items-center text-zinc-600 gap-4 relative z-[9999] py-4">
                    <span ref={refErroSpanElement}
                        className="w-[80%] hidden justify-center items-center p-2 bg-red-600/80 z-[99] absolute top-2 rounded-md text-white">
                        erro detectado!
                    </span>

                    {/* Seção Principal - Evento e Tabela */}
                    <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="w-full bg-white rounded-xl shadow-sm p-4">
                            <DisplayCreateEvent />
                        </div>
                        <div className="w-full bg-white rounded-xl shadow-sm p-4">
                            <DisplayTableProducts />
                        </div>
                    </section>

                    {/* Seção de Produtos e Local/Hora */}
                    <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="w-full bg-white rounded-xl shadow-sm p-4">
                            <DisplayProductsCsv />
                        </div>
                        <div className="w-full bg-white rounded-xl shadow-sm p-4">
                            <DisplayLocalHour />
                        </div>
                    </section>

                    {/* Seção de Descrições e Informações */}
                    <section className="w-full">
                        <div className="w-full min-h-[48vh] bg-[#ffffff] rounded-xl shadow-sm p-4">
                            <DisplayInformations />
                        </div>
                    </section>

                    {/* Seção de Termos e Condições */}
                    <section className="w-full">
                        <div className="w-full min-h-[48vh] bg-white rounded-xl shadow-sm p-4">
                            <DisplayTermsConditions />
                        </div>
                    </section>

                    {/* Seção de Métodos de Pagamento */}
                    <section className="w-full">
                        <div className="w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
                            <DisplayMethodsPayments />
                        </div>
                    </section>
                </section>
            </div>

            <section className="fixed bottom-4 z-[9999] flex gap-4 justify-center w-full">
                {!errorDetector ?
                    !isLoading ?
                        <button onClick={handleSaveAuct} 
                            className="w-[130px] h-[50px] bg-[#012038] text-white rounded-md shadow-lg shadow-[#0e0e0e47] hover:bg-[#023161] transition-colors">
                            confirmar
                        </button> :
                        <span className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-md shadow-lg">criando...</span>
                    :
                    <button className="w-[130px] h-[50px] bg-[#696969] text-white rounded-md cursor-not-allowed">
                        confirmar
                    </button>
                }
            </section>
        </div>
    )
}