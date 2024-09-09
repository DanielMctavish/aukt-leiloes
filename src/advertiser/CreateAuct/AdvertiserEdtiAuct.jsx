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
import DisplayInformations from "./components/DisplayInformations"
import DisplayTermsConditions from "./components/DisplayTermsConditions"
import { useSelector } from "react-redux";
import { getCurrentFile } from "./functions/handleImageChange"


export const AdvertiserEdtiAuct = () => {

    const state = useSelector(state => state.aucts)
    const stateCurrentEditAuk = useSelector(state => state)
    const stateAuctToEdit = useSelector(state => state.auctEdit)

    const [progressBar, setProgressBar] = useState(0)

    const navigate = useNavigate()

    const refGeneralBody = useRef()
    const loadScreen = useRef()
    const logoElement = useRef()

    useEffect(() => {}, [state, stateAuctToEdit])


    const handleEditAuct = async () => {

        //Load Operation -------------------------------------------------------------------------------------------------------------------------------

        refGeneralBody.current.style.display = 'none'
        loadScreen.current.style.display = 'flex'
        //FIREBASE Operation --------------------------------------------------------------------------------------------------------------------------
        let currentUploadedImage
        if (getCurrentFile()) {

            axios.delete(`${import.meta.env.VITE_APP_BACKEND_API}/auct/delete-cover-auct?url=${state.auct_cover_img}&auct_id=${stateCurrentEditAuk.selectedAuct}`)
                .then(response => {
                    console.log(response.data);
                })

            const formData = new FormData();
            formData.append("cover-auct-image", getCurrentFile());

            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/auct/upload-cover-auct`, formData, {
                "Content-Type": "multipart/form-data"
            }).then(response => {
                console.log('resposta ao upar imagem -> ', response.data.currentImage);
                currentUploadedImage = response.data.currentImage
            }).catch(err => {
                console.log('err ao tentar upar cover foto auct', err)
            })

        }

        //EDIT Auct Operation-------------------------------------------------------------------------------------------------------------------------
        const currentSession = JSON.parse(localStorage.getItem("advertiser-session-aukt"))
        const configAuth = {
            headers: {
                "Authorization": `Bearer ${currentSession.token}`
            }
        }

        let currentAuctId
        let currentAuctNanoId
        // UPDATE AUCT --> Title | tags | categorie | description | terms_conditions |
        await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/auct/update-auct?auct_id=${stateCurrentEditAuk.selectedAuct}`, {
            title: state.title,
            tags: state.tags,
            categorie: state.categorie,
            auct_cover_img: !currentUploadedImage ? state.auct_cover_img : currentUploadedImage,
            descriptions_informations: state.descriptions_informations,
            terms_conditions: state.terms_conditions,
        }, configAuth).then(response => {
            console.log('resposta ao editar leilão -> ', response.data);
            setProgressBar(100)
            currentAuctId = response.data.currentAuct.id
            currentAuctNanoId = response.data.currentAuct.nano_id
        }).catch(err => {
            setProgressBar(100)
            console.log('erro ao editar o leilão -> ', err);
        })


        refGeneralBody.current.style.display = 'flex';
        loadScreen.current.style.display = 'none';
        navigate("/advertiser/auctions")
    }

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">

            <AssideAdvertiser MenuSelected="menu-3" />

            <section ref={loadScreen} className="w-full h-[100vh] hidden flex-col justify-center items-center overflow-y-auto bg-zinc-800 gap-1">
                <h1>criando leilão! aguarde... </h1>
                <img ref={logoElement} src={logo} alt="logo-aukt" className="w-[100px] object-cover" />

                <section className="w-[70%] h-[10px] relative mt-7 overflow-hidden rounded-md">
                    <span className="w-full h-[10px] bg-white rounded-md absolute"></span>
                    <span style={{ width: `${progressBar}%` }} className="h-[10px] bg-[#1c6891] absolute"></span>
                </section>
            </section>

            <section ref={refGeneralBody} className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto text-zinc-600 gap-1">
                <NavAdvertiser path='anunciante > leilões > editar leilão' />

                <section className="w-full min-h-[60%] relative p-3 flex justify-between gap-2">

                    <DisplayCreateEvent currentAuct={stateAuctToEdit} />
                    <DisplayInformations currentAuct={stateAuctToEdit} />

                </section>

                <section className="w-full min-h-[60%] relative p-3 flex justify-between gap-2">
                    <DisplayTermsConditions currentAuct={stateAuctToEdit} />
                </section>

                {/* <section className="w-full min-h-[20vh]
                justify-between items-center gap-3 
                p-3 flex">
                    <DisplayMethodsPayments currentAuct={stateAuctToEdit} />
                    <DisplayLimitations />
                    <DisplayDateLimite />
                </section> */}

                <section className="w-full min-h-[10vh] p-2 flex justify-center items-center">
                    <button onClick={handleEditAuct} className="w-[160px] h-[50px] bg-[#012038] text-white rounded-md">confirmar edição</button>
                </section>

            </section>

        </div>
    )
}