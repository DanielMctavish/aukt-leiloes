/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    HeaderModel1, HeaderModel2, HeaderModel3, HeaderModel4,
    HeaderModel5, HeaderModel6, HeaderModel7, HeaderModel8
} from "./decorations";
import HeaderTexts from "./texts/HeaderTexts";
import HeaderCarousel from "./carousels/HeaderCarousel";

function HomeAdvertiser() {
    const [header, setHeader] = useState(null);
    const [fontStyle, setFontStyle] = useState(null);
    const { advertiser_id } = useParams();

    useEffect(() => {
        getSiteTemplate()
    }, [])

    const getSiteTemplate = async () => {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
            params: { advertiserId: advertiser_id }
        });

        if (response.data && response.data[0]) {
            const templateData = response.data[0];
            setHeader(templateData.header);
            setFontStyle(templateData.fontStyle);
        }
    }

    useEffect(() => {
        if (header) {
            getSelectedAuction()
        }
    }, [header])

    const getSelectedAuction = async () => {
        if (!header?.carousel?.selectedAuctId) return;

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
            params: { auct_id: header.carousel.selectedAuctId }
        });
    }

    const getBackgroundImageStyle = () => {
        if (!header?.backgroundImage) return {};

        return {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${header.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: header.backgroundImageOpacity,
            filter: `blur(${header.backgroundImageBlur}px) brightness(${header.backgroundImageBrightness * 100}%)`,
            zIndex: 0,
            maxHeight: '100%',
            height: '100%'
        };
    };

    const renderHeaderModel = () => {
        if (!header?.model) return null;

        switch (header.model) {
            case "MODEL_1":
                return <HeaderModel1 header={header} />;
            case "MODEL_2":
                return <HeaderModel2 header={header} />;
            case "MODEL_3":
                return <HeaderModel3 header={header} />;
            case "MODEL_4":
                return <HeaderModel4 header={header} />;
            case "MODEL_5":
                return <HeaderModel5 header={header} />;
            case "MODEL_6":
                return <HeaderModel6 header={header} />;
            case "MODEL_7":
                return <HeaderModel7 header={header} />;
            case "MODEL_8":
                return <HeaderModel8 header={header} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-[100vh] bg-[#fff] overflow-y-auto overflow-x-hidden" style={{ fontFamily: fontStyle }}>
            <header
                className={`w-full relative overflow-hidden
                    ${header?.sizeType === "FULL" && "h-[100vh]"} 
                    ${header?.sizeType === "MEDIUM" && "h-[50vh]"}
                    ${header?.sizeType === "SMALL" && "h-[25vh]"}`}
                style={{ backgroundColor: header?.color || '#ffffff' }}>

                {/* Background Image Layer */}
                {header?.backgroundImage && (
                    <div style={getBackgroundImageStyle()} />
                )}

                {/* Decorative Elements Layer */}
                {renderHeaderModel()}

                {/* Text Layer */}
                <HeaderTexts texts={header?.texts} fontStyle={fontStyle} />

                {/* Carousel Layer */}
                <HeaderCarousel config={header?.carousel} advertiser_id={advertiser_id} />
            </header>
        </div>
    );
}

export default HomeAdvertiser;