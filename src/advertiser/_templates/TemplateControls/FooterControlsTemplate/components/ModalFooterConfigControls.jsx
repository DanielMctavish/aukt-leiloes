/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Close, Add, WhatsApp, Instagram, LinkedIn, Twitter, Facebook, DeleteForever } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    addFooterSection, 
    removeFooterSection, 
    addFooterSocialMedia, 
    removeFooterSocialMedia,
    updateFooterData
} from "../../../../../features/template/FooterSlice";

function ModalFooterConfigControls({ setIsModalFooterOpen, setIsRetracted }) {
    const dispatch = useDispatch();
    const { footerData } = useSelector(state => state.footer);

    const [ActiveNewSection, setActiveNewSection] = useState(false)
    const [activeSocialMedia, setActiveSocialMedia] = useState(false)
    const [isInputSocialMedia, setIsInputSocialMedia] = useState(false)
    const [selectedSocialMedia, setSelectedSocialMedia] = useState(null)
    const socialMediaInputRef = useRef(null)

    const AVAILABLE_SOCIAL_MEDIA = [
        { type: 'facebook', url: '' },
        { type: 'instagram', url: '' },
        { type: 'linkedin', url: '' },
        { type: 'whatsapp', url: '' },
        { type: 'twitter', url: '' }
    ];

    useEffect(() => {
        // Inicializar o estado do footer se necessário
        if (!footerData.color) {
            dispatch(updateFooterData({
                color: '#012038',
                sizeType: 'MEDIUM',
                companyName: '',
                showSocialLinks: true,
                textColor: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.2)',
                elementsOpacity: 1,
                sections: [],
                socialMedia: []
            }));
        }
    }, []);

    const closeModalAndRetract = () => {
        setIsModalFooterOpen(false)
        setTimeout(() => {
            setIsRetracted(true)
        }, 400)
    }

    const handleDeleteColumn = (indexToDelete) => {
        dispatch(removeFooterSection(indexToDelete));
    }

    const handleSocialMediaClick = (socialMedia) => {
        console.log("Social media selecionada:", socialMedia);
        setSelectedSocialMedia(socialMedia);
        setIsInputSocialMedia(true);
    }

    const handleSocialMediaLink = (event) => {
        if (event.key === 'Enter' && selectedSocialMedia) {
            const newSocialMedia = {
                type: selectedSocialMedia.type,
                url: event.target.value
            };

            console.log("Adicionando rede social:", newSocialMedia);
            dispatch(addFooterSocialMedia(newSocialMedia));
            setIsInputSocialMedia(false);
            setSelectedSocialMedia(null);
            setActiveSocialMedia(false);
            event.target.value = '';
        }
    }

    const handleDeleteSocialMedia = (indexToDelete) => {
        dispatch(removeFooterSocialMedia(indexToDelete));
    }

    const getSocialMediaIcon = (type) => {
        switch(type) {
            case 'whatsapp':
                return <WhatsApp />;
            case 'instagram':
                return <Instagram />;
            case 'linkedin':
                return <LinkedIn />;
            case 'facebook':
                return <Facebook />;
            case 'twitter':
                return <Twitter />;
            default:
                return null;
        }
    }

    const getSocialMediaColor = (type) => {
        switch(type) {
            case 'whatsapp':
                return '#25D366';
            case 'instagram':
                return '#E4405F';
            case 'linkedin':
                return '#0A66C2';
            case 'facebook':
                return '#1877F2';
            case 'twitter':
                return '#1DA1F2';
            default:
                return '#5A7184';
        }
    }

    const NewSectionFields = () => {
        const [activeInput, setActiveInput] = useState(false)
        const [currentLinks, setCurrentLinks] = useState([])

        const titleSectionRef = useRef()
        const nameRef = useRef()
        const urlRef = useRef()

        const handleAddLink = (event) => {
            if (event.key === 'Enter') {
                const name = nameRef.current.value
                const url = urlRef.current.value

                if (!name || !url) return false
                if (currentLinks.length >= 6) return false

                const newLink = { name, url }
                setCurrentLinks([...currentLinks, newLink])
                nameRef.current.value = ''
                urlRef.current.value = ''
                setActiveInput(false)
            }
        }

        const handleConfirmSection = () => {
            if (!titleSectionRef.current.value || currentLinks.length === 0) return;

            const sectionData = {
                title: titleSectionRef.current.value,
                links: currentLinks.map(link => ({
                    name: link.name,
                    url: link.url
                }))
            }

            dispatch(addFooterSection(sectionData));
            setActiveNewSection(false);
        }

        return (
            <div className="p-4 min-w-[280px] h-full flex flex-col justify-start items-center 
                bg-white rounded-xl gap-3 overflow-y-auto shadow-md">

                <input ref={titleSectionRef} type="text" placeholder="Título da Sessão"
                    className="text-xl bg-transparent font-semibold p-2 text-center w-full 
                    focus:outline-none focus:border-b-2 focus:border-[#144366] transition-all" />

                <div className="w-full h-[1px] bg-gray-200"></div>

                {currentLinks.map((link, index) => (
                    <div key={index} className="w-full p-3 flex flex-col justify-between items-center 
                        gap-1 bg-[#F5F8FA] rounded-xl hover:bg-[#E8F1F8] transition-all duration-200">
                        <span className="text-base font-semibold text-[#144366]">{link.name}</span>
                        <span className="text-sm text-[#5A7184]">{link.url}</span>
                    </div>
                ))}

                {activeInput && (
                    <div className="w-full p-3 flex flex-col justify-center items-center gap-2 
                        bg-[#F5F8FA] rounded-xl border-2 border-dashed border-[#E8F1F8]">
                        <input ref={nameRef} type="text" placeholder="Nome do link"
                            className="text-sm bg-transparent font-medium p-1.5 text-center w-full
                            focus:outline-none focus:border-b focus:border-[#144366]" />
                        <input ref={urlRef} type="text" placeholder="URL" onKeyDown={handleAddLink}
                            className="text-sm bg-transparent font-medium p-1.5 text-center w-full
                            focus:outline-none focus:border-b focus:border-[#144366]" />
                    </div>
                )}

                {currentLinks.length < 6 && !activeInput && (
                    <button
                        onClick={() => setActiveInput(!activeInput)}
                        className="w-full p-2.5 bg-[#F5F8FA] text-[#144366] transition-all duration-300
                            rounded-xl hover:bg-[#E8F1F8] active:scale-[0.98] font-medium"
                    >
                        Novo Link
                    </button>
                )}

                <div className="w-full h-[1px] bg-gray-200"></div>

                <button onClick={handleConfirmSection}
                    className="w-full p-2.5 bg-[#144366] text-white transition-all duration-300
                        rounded-xl hover:bg-[#0D2B44] active:scale-[0.98] font-medium">
                    Confirmar Sessão
                </button>
            </div>
        )
    }

    return (
        <div className="w-full h-[100vh] fixed top-0 left-0 bg-[#0D2B44]/80 
            flex justify-center items-center z-[999] backdrop-blur-[4px] overflow-y-auto">

            <div className="w-[85%] h-[85%] bg-white rounded-2xl shadow-xl 
                flex flex-col gap-4 justify-between items-center relative p-8 overflow-y-auto">

                <button
                    onClick={closeModalAndRetract}
                    className="fixed top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                        backdrop-blur-sm transition-all duration-200">
                    <Close className="text-white" />
                </button>

                <section className="w-full h-[80%] bg-[#F5F8FA] backdrop-blur-sm rounded-xl 
                    flex justify-start items-center p-4 gap-3 overflow-x-auto">

                    <button onClick={() => setActiveNewSection(!ActiveNewSection)}
                        className="min-w-[200px] h-full flex justify-center items-center bg-white 
                            rounded-xl hover:bg-[#E8F1F8] transition-all duration-300">
                        <span className="w-[100px] h-[100px] border-2 border-[#E8F1F8] 
                            flex justify-center items-center rounded-full hover:border-[#144366]">
                            <Add className="text-[#5A7184] hover:text-[#144366] transition-colors" />
                        </span>
                    </button>

                    {ActiveNewSection && <NewSectionFields />}

                    {footerData.sections.map((section, index) => (
                        <div key={index} className="min-w-[280px] h-full flex flex-col justify-start 
                            items-center gap-3 bg-white rounded-xl p-4 relative shadow-md
                            group">
                            <button
                                onClick={() => handleDeleteColumn(index)}
                                className="absolute top-2 right-2 p-1.5 rounded-full
                                    text-red-400 hover:text-red-600 
                                    hover:bg-red-50 transition-all duration-200
                                    opacity-0 group-hover:opacity-100"
                            >
                                <DeleteForever />
                            </button>
                            <span className="text-xl font-semibold text-[#144366]">{section.title}</span>
                            <div className="w-full h-[1px] bg-gray-200"></div>
                            {section.links.map((link, linkIndex) => (
                                <div key={linkIndex} className="w-full p-3 flex flex-col justify-between 
                                    items-center gap-1 bg-[#F5F8FA] rounded-xl">
                                    <span className="text-base font-semibold text-[#144366]">{link.name}</span>
                                    <span className="text-sm text-[#5A7184]">{link.url}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </section>

                <section className="w-full h-[20%] flex flex-col justify-center items-center 
                    bg-[#F5F8FA] backdrop-blur-sm rounded-xl relative">

                    <div className="relative flex justify-start items-center gap-2">
                        <button
                            onClick={() => setActiveSocialMedia(!activeSocialMedia)}
                            className="w-[60px] h-[60px] bg-white shadow-md flex justify-center 
                            items-center rounded-full hover:bg-[#E8F1F8] transition-all duration-200
                            border border-[#E8F1F8]">
                            <Add className="text-[#5A7184] hover:text-[#144366]" />
                        </button>
                        
                        {/* Redes Sociais adicionadas */}
                        <div className="flex justify-start items-center gap-2">
                            {footerData.socialMedia.map((social, index) => (
                                social.url && (
                                    <div key={index} 
                                        className="w-[60px] h-[60px] bg-white shadow-md flex justify-center 
                                            items-center rounded-full hover:bg-[#E8F1F8] transition-all duration-200
                                            border border-[#E8F1F8] relative group"
                                    >
                                        <div className={`text-[${getSocialMediaColor(social.type)}]`}>
                                            {getSocialMediaIcon(social.type)}
                                        </div>

                                        {/* Tooltip com link e botão de deletar */}
                                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg
                                            shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200
                                            whitespace-nowrap flex items-center gap-2 border border-[#E8F1F8]">
                                            <span className="text-sm text-[#5A7184]">
                                                {social.url}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteSocialMedia(index)
                                                }}
                                                className="p-1 rounded-full hover:bg-red-50 text-red-400 
                                                    hover:text-red-600 transition-all duration-200"
                                            >
                                                <DeleteForever sx={{ fontSize: '1.2rem' }} />
                                            </button>
                                            {/* Seta do tooltip */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                                border-8 border-transparent border-t-white"></div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {activeSocialMedia && (
                        <div className="flex flex-col justify-start items-center gap-3 
                            absolute bottom-[12vh]">
                            {isInputSocialMedia && (
                                <div className="bg-white p-2 rounded-xl shadow-md mb-2">
                                    <input
                                        ref={socialMediaInputRef}
                                        type="text"
                                        placeholder={`Link do ${selectedSocialMedia?.type}`}
                                        className="p-2 text-sm focus:outline-none border-b border-[#144366]
                                            min-w-[250px] text-[#5A7184] bg-[#fff]"
                                        onKeyDown={handleSocialMediaLink}
                                        data-type={selectedSocialMedia?.type}
                                        autoFocus
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-[1vh]">
                                {AVAILABLE_SOCIAL_MEDIA.map((availableSocial) => {
                                    // Verifica se esta rede social já existe no estado
                                    const existingSocial = footerData.socialMedia.find(
                                        social => social.type === availableSocial.type
                                    );
                                    
                                    // Só mostra se não existir ou não tiver URL
                                    if (!existingSocial || !existingSocial.url) {
                                        return (
                                            <button
                                                key={availableSocial.type}
                                                onClick={() => handleSocialMediaClick(availableSocial)}
                                                className="w-[60px] h-[60px] bg-white shadow-md
                                                    flex justify-center items-center rounded-full
                                                    hover:bg-[#E8F1F8] transition-all duration-200
                                                    border border-[#E8F1F8]"
                                            >
                                                <div className={`text-[#5A7184] hover:text-[${getSocialMediaColor(availableSocial.type)}]`}>
                                                    {getSocialMediaIcon(availableSocial.type)}
                                                </div>
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default ModalFooterConfigControls;