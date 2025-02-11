/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RenderHeaderAdvertiser from "./Header/RenderHeaderAdvertiser";
import RenderSectionsAdvertiser from "./Sections/RenderSectionsAdvertiser";
import RenderFooterAdvertiser from "./Footer/RenderFooterAdvertiser";
import RenderNavigationAdvertiser from "./navigation/RenderNavigationAdvertiser";


function MainRenderAdvertiserSite(){
    const [header, setHeader] = useState({})
    const [sections, setSections] = useState([])
    const [footer, setFooter] = useState({})
    const [fontStyle, setFontStyle] = useState({})

    const { advertiser_id } = useParams();

    useEffect(()=>{
        getSiteTemplate()
    },[])


    const getSiteTemplate = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/template/find`, {
                params: { advertiserId: advertiser_id }
            });

            if (response.data && response.data[0]) {
                const templateData = response.data[0];
                setHeader({
                    ...templateData.header,
                    elements: templateData.header.elements || {},
                    colorPalette: templateData.colorPalette || 'clean'
                });
                setSections(templateData.sections);
                setFooter(templateData.footer);
                setFontStyle(templateData.fontStyle);
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    }


    return(
        <div className="w-full flex flex-col items-center justify-start">
            <RenderNavigationAdvertiser sections={sections} fontStyle={fontStyle} colorPalette={header.colorPalette} />
            <RenderHeaderAdvertiser fontStyle={fontStyle} header={header}/>
            <RenderSectionsAdvertiser fontStyle={fontStyle} sections={sections}/>
            <RenderFooterAdvertiser fontStyle={fontStyle} footer={footer}/>
        </div>
    )
}

export default MainRenderAdvertiserSite;