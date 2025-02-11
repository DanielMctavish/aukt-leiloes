/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdvertiserTemplateControls from './AdvertiserTemplateControls';
import HeaderTemplate from './header/HeaderTemplate';
import FooterTemplate from './footer/FooterTemplate';
import WelcomeScreen from './welcome_template/WelcomeScreen';
import TemplateSections from './sections/TemplateSections';
import { fetchTemplate as fetchHeaderTemplate } from '../../features/template/HeaderSlice';
import { fetchTemplate as fetchFooterTemplate } from '../../features/template/FooterSlice';
import { fetchTemplate as fetchSectionsTemplate } from '../../features/template/SectionsSlice';
import { Launch } from '@mui/icons-material';

function AdvertiserTemplate() {
    const { headerData } = useSelector(state => state.header);
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [asideWidth, setAsideWidth] = useState(20);
    const [isResizing, setIsResizing] = useState(false);
    const asideRef = useRef(null);
    const { advertiser_id } = useParams();
    const dispatch = useDispatch();

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


    const getTextColor = () => {
        return headerData.colorPalette === 'dark' ? 'text-white' : 'text-black';
    };

    if (showWelcomeScreen) {
        return <WelcomeScreen onContinue={() => setShowWelcomeScreen(false)} />;
    }

    return (
        <div className={`flex w-full h-screen bg-white overflow-hidden transition-opacity duration-1000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            

            <button 
                className='absolute top-4 right-[4vh] z-[99] flex items-center gap-2 px-4 py-2
                bg-gradient-to-r from-[#012038] to-[#01284a] text-white rounded-lg
                shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 
                transition-all duration-300 group'
                onClick={() => window.open(`/advertiser/home/${advertiser_id}`, '_blank')}
            >
                <span className="font-medium">Visualizar Site</span>
                <Launch className="text-white/70 group-hover:text-white 
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                transition-all duration-300" />
            </button>

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
