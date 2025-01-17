/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import AdvertiserTemplateControls from './AdvertiserTemplateControls';
import HeaderTemplate from './header/HeaderTemplate';
import FooterTemplate from './footer/FooterTemplate';
import WelcomeScreen from './welcome_template/WelcomeScreen';
import TemplateSections from './sections/TemplateSections';
import { fetchTemplate as fetchHeaderTemplate } from '../../features/template/HeaderSlice';
import { fetchTemplate as fetchFooterTemplate } from '../../features/template/FooterSlice';
import { fetchTemplate as fetchSectionsTemplate } from '../../features/template/SectionsSlice';

function AdvertiserTemplate() {
    const { headerData } = useSelector(state => state.header);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [asideWidth, setAsideWidth] = useState(20);
    const [isResizing, setIsResizing] = useState(false);
    const [advertiser, setAdvertiser] = useState(null);
    const asideRef = useRef(null);
    const { advertiser_id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getCurrentAdvertiser();
    }, []);

    useEffect(() => {
        if (!showWelcomeScreen) {
            setTimeout(() => setFadeIn(true), 100);
        }
    }, [showWelcomeScreen]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;

            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth >= 20 && newWidth <= 50) {
                setAsideWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [isResizing]);

    useEffect(() => {
        if (advertiser_id) {
            dispatch(fetchHeaderTemplate(advertiser_id));
            dispatch(fetchFooterTemplate(advertiser_id));
            dispatch(fetchSectionsTemplate(advertiser_id));
        }
    }, [advertiser_id, dispatch]);

    const getCurrentAdvertiser = async () => {
        try {
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            if (!advertiserSession) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            const { token, email } = JSON.parse(advertiserSession);
            if (!token) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`,
                {
                    params: { email: email },
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );


            if (response.data.id !== advertiser_id) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            if (!response.data) {
                localStorage.removeItem('advertiser-session-aukt');
                navigate("/");
                return;
            }

            setAdvertiser(response.data);

        } catch (error) {
            localStorage.removeItem('advertiser-session-aukt');
            navigate("/");
        }
    };

    const getTextColor = () => {
        return headerData.colorPalette === 'dark' ? 'text-white' : 'text-black';
    };

    if (showWelcomeScreen) {
        return <WelcomeScreen onContinue={() => setShowWelcomeScreen(false)} />;
    }

    return (
        <div className={`flex w-full h-screen bg-white overflow-hidden transition-opacity duration-1000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {advertiser && (
                <div
                    onClick={() => navigate(`/advertiser/dashboard`)}
                    className="absolute top-4 right-[3vh] z-50 bg-white/90 cursor-pointer
                    backdrop-blur-sm p-1 rounded-lg shadow-lg opacity-30 hover:opacity-100"
                >
                    <div className="flex items-center gap-4">
                        {advertiser.url_profile_company_logo_cover ? (
                            <img
                                src={advertiser.url_profile_company_logo_cover}
                                alt="Logo"
                                className="w-[40px] h-[40px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-[#012038] text-white flex items-center justify-center text-xl font-bold">
                                {advertiser.name[0]}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-[14px] text-[#012038]">{advertiser.company_name}</h3>
                            <p className="text-[12px] text-gray-600">{advertiser.email}</p>
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={asideRef}
                style={{ width: `${asideWidth}%`, minWidth: '300px', maxWidth: '600px' }}
                className="relative h-screen"
            >
                <div className="h-full overflow-y-auto">
                    <AdvertiserTemplateControls />
                </div>

                <div
                    className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-[#012038]/20 transition-colors"
                    onMouseDown={() => setIsResizing(true)}
                />
            </div>

            <div
                className={`h-screen bg-gray-800 p-1 overflow-y-auto flex flex-col ${getTextColor()}`}
                style={{
                    width: `calc(100% - ${asideWidth}%)`,
                    minWidth: '50%',
                    fontFamily: headerData.fontStyle
                }}
            >
                <HeaderTemplate />
                <TemplateSections />
                <FooterTemplate />
            </div>

            {isResizing && (
                <div className="fixed inset-0 bg-transparent z-50" />
            )}
        </div>
    );
}

export default AdvertiserTemplate;
