import { KeyboardArrowDown, Settings, DragHandle, Landscape, FormatShapes, TextFields, ViewCarousel } from "@mui/icons-material"
import { useState } from "react"
import DecorativesHeaderControls from "./components/DecorativesHeaderControls";
import TextsHeaderControls from "./components/TextsHeaderControls";
import SettingsFiltersHeaderControls from "./components/SettingsFiltersHeaderControls";
import ModalSelectorTypes from "./components/ModalSelectorTypes";
import CarrouselHeaderControls from "./components/CarrouselHeaderControls";


function HeaderControlsTemplate() {
    const [isRetracted, setIsRetracted] = useState(true)
    const [isSettingsFilters, setIsSettingsFilters] = useState(false)
    
    // Estados para controlar os modais
    const [isBackgroundModal, setIsBackgroundModal] = useState(false)
    const [isDecorativesModal, setIsDecorativesModal] = useState(false)
    const [isCarroselConfigModal, setIsCarroselConfigModal] = useState(false)
    const [isTextsModal, setIsTextsModal] = useState(false)
    const [typeBackground, setTypeBackground] = useState(null)

    return (
        <>
            {/* Modais em tela cheia */}
            {isBackgroundModal && (
                <ModalSelectorTypes
                    setisModalSelector={setIsBackgroundModal}
                    setTypeBackground={setTypeBackground}
                    typeBackground={typeBackground}
                />
            )}
            {isDecorativesModal && (
                <DecorativesHeaderControls
                    setIsModalSelector={setIsDecorativesModal}
                />
            )}
            {isTextsModal && (
                <TextsHeaderControls
                    setIsModalSelector={setIsTextsModal}
                />
            )}
            {isCarroselConfigModal && (
                <CarrouselHeaderControls
                    setIsModalSelector={setIsCarroselConfigModal}
                />
            )}

            {/* Container Principal */}
            <div className={`w-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg p-4 relative
                transition-all duration-300 rounded-lg ${isRetracted ? 'h-[6vh]' : 'h-full'}`}>

                <div className={`flex items-center ${isRetracted ? 'gap-12' : 'gap-2 w-full justify-between'}`}>
                    <div className="flex items-center gap-2">
                        <DragHandle
                            className="text-gray-500"
                            sx={{ fontSize: '1.5rem' }}
                        />
                        <span className="font-medium text-gray-700 tracking-wide text-sm">HEADER</span>
                    </div>

                    {!isRetracted && (
                        <button
                            onClick={() => setIsSettingsFilters(!isSettingsFilters)}
                            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200
                                flex items-center gap-2 text-gray-600"
                        >
                            <Settings sx={{ fontSize: '1.2rem' }} />
                            <span className="text-xs font-medium">Configurações</span>
                        </button>
                    )}
                </div>

                <div
                    className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 
                        transition-all duration-200 absolute right-3 top-2.5"
                    onClick={() => setIsRetracted(!isRetracted)}>
                    <KeyboardArrowDown
                        className={`cursor-pointer transition-transform duration-300 text-gray-600 hover:text-blue-600 ${isRetracted ? 'rotate-180' : ''}`}
                        sx={{ fontSize: '1.5rem' }}
                    />
                </div>

                {!isRetracted && (
                    <div className="mt-6 space-y-6 relative">
                        {isSettingsFilters ? (
                            <SettingsFiltersHeaderControls />
                        ) : (
                            <div className="space-y-6">
                                {/* Botão de Background */}
                                <div onClick={() => setIsBackgroundModal(true)}
                                    className="w-full h-[160px] flex flex-col rounded-xl 
                                        justify-center items-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]
                                        border-[#144366]/30 border-2 border-dashed cursor-pointer relative 
                                        transition-all duration-300 group overflow-hidden
                                        hover:border-[#144366]/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                    
                                    {/* Efeito de gradiente no hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#144366]/5 to-[#144366]/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex flex-col items-center gap-3">
                                        <div className="p-3 rounded-xl bg-white/80 shadow-sm group-hover:shadow-md 
                                            group-hover:bg-white transition-all duration-300">
                                            <Landscape 
                                                sx={{ fontSize: '47px' }} 
                                                className="text-[#144366] group-hover:scale-110 transition-transform duration-300" 
                                            />
                                        </div>
                                        <span className="text-sm font-medium tracking-wide text-[#144366]/80 
                                            group-hover:text-[#144366] transition-colors duration-300">
                                            BACKGROUND
                                        </span>
                                    </div>
                                </div>

                                {/* Botão de Carrossel */}
                                <div onClick={() => setIsCarroselConfigModal(true)}
                                    className="w-full h-[160px] flex flex-col rounded-xl 
                                        justify-center items-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]
                                        border-[#144366]/30 border-2 border-dashed cursor-pointer relative 
                                        transition-all duration-300 group overflow-hidden
                                        hover:border-[#144366]/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                    
                                    {/* Efeito de gradiente no hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#144366]/5 to-[#144366]/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex flex-col items-center gap-3">
                                        <div className="p-3 rounded-xl bg-white/80 shadow-sm group-hover:shadow-md 
                                            group-hover:bg-white transition-all duration-300">
                                            <ViewCarousel 
                                                sx={{ fontSize: '47px' }} 
                                                className="text-[#144366] group-hover:scale-110 transition-transform duration-300" 
                                            />
                                        </div>
                                        <span className="text-sm font-medium tracking-wide text-[#144366]/80 
                                            group-hover:text-[#144366] transition-colors duration-300">
                                            CARROSSEL
                                        </span>
                                    </div>
                                </div>

                                {/* Botão de Decorativos */}
                                <div onClick={() => setIsDecorativesModal(true)}
                                    className="w-full h-[160px] flex flex-col rounded-xl 
                                        justify-center items-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]
                                        border-[#144366]/30 border-2 border-dashed cursor-pointer relative 
                                        transition-all duration-300 group overflow-hidden
                                        hover:border-[#144366]/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                    
                                    {/* Efeito de gradiente no hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#144366]/5 to-[#144366]/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex flex-col items-center gap-3">
                                        <div className="p-3 rounded-xl bg-white/80 shadow-sm group-hover:shadow-md 
                                            group-hover:bg-white transition-all duration-300">
                                            <FormatShapes 
                                                sx={{ fontSize: '47px' }} 
                                                className="text-[#144366] group-hover:scale-110 transition-transform duration-300" 
                                            />
                                        </div>
                                        <span className="text-sm font-medium tracking-wide text-[#144366]/80 
                                            group-hover:text-[#144366] transition-colors duration-300">
                                            DECORATIVOS
                                        </span>
                                    </div>
                                </div>

                                {/* Botão de Textos */}
                                <div onClick={() => setIsTextsModal(true)}
                                    className="w-full h-[160px] flex flex-col rounded-xl 
                                        justify-center items-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]
                                        border-[#144366]/30 border-2 border-dashed cursor-pointer relative 
                                        transition-all duration-300 group overflow-hidden
                                        hover:border-[#144366]/50 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                                    
                                    {/* Efeito de gradiente no hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#144366]/5 to-[#144366]/10 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="relative flex flex-col items-center gap-3">
                                        <div className="p-3 rounded-xl bg-white/80 shadow-sm group-hover:shadow-md 
                                            group-hover:bg-white transition-all duration-300">
                                            <TextFields 
                                                sx={{ fontSize: '47px' }} 
                                                className="text-[#144366] group-hover:scale-110 transition-transform duration-300" 
                                            />
                                        </div>
                                        <span className="text-sm font-medium tracking-wide text-[#144366]/80 
                                            group-hover:text-[#144366] transition-colors duration-300">
                                            TEXTOS
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default HeaderControlsTemplate;