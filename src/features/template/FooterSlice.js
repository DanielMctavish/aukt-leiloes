import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

const initialState = {
    footerData: {
        id: null,
        sections: [],
        socialMedia: [],
        size: 'MEDIUM',
        color: '#2e2e2e',
        textColor: '#FFFFFF',
        borderColor: 'rgba(255,255,255,0.2)',
        elementsOpacity: 100,
        showSocialLinks: true,
        companyName: 'EMPRESA'
    }
}

// Action Thunk para carregar o template
export const fetchTemplate = createAsyncThunk(
    'footer/fetchTemplate',
    async (advertiserId) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/template/find`,
                {
                    params: { advertiserId },
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('advertiser-session-aukt')).token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const template = response.data[0];
            if (!template) return null;

            return template;
        } catch (error) {
            console.error("Erro ao buscar template:", error);
            throw error;
        }
    }
);

const footerSlice = createSlice({
    name: "footer_template",
    initialState,
    reducers: {
        addFooterSection: (state, action) => {
            state.footerData.sections.push(action.payload);
        },
        removeFooterSection: (state, action) => {
            state.footerData.sections = state.footerData.sections.filter(
                (_, index) => index !== action.payload
            );
        },
        updateFooterSection: (state, action) => {
            const { index, section } = action.payload;
            state.footerData.sections[index] = section;
        },
        addSocialMedia: (state, action) => {
            state.footerData.socialMedia.push(action.payload);
        },
        removeSocialMedia: (state, action) => {
            state.footerData.socialMedia = state.footerData.socialMedia.filter(
                (_, index) => index !== action.payload
            );
        },
        setFooterSize: (state, action) => {
            state.footerData.size = action.payload;
        },
        setFooterFontStyle: (state, action) => {
            state.footerData.fontStyle = action.payload;
        },
        setFooterColor: (state, action) => {
            state.footerData.color = action.payload;
        },
        setFooterTextColor: (state, action) => {
            state.footerData.textColor = action.payload;
        },
        setBorderColor: (state, action) => {
            state.footerData.borderColor = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            console.log("Footer Template Response:", action.payload);
            if (!action.payload) return;

            const template = action.payload;
            const footer = template.footer;
            
            state.footerData = {
                ...initialState.footerData,
                id: footer.id,
                color: footer.color,
                size: footer.sizeType,
                companyName: footer.companyName,
                showSocialLinks: footer.showSocialLinks,
                textColor: footer.textColor,
                borderColor: footer.borderColor,
                elementsOpacity: footer.elementsOpacity * 100,
                sections: footer.sections || [],
                socialMedia: footer.socialMedia || []
            };

            console.log("Footer State After Update:", state.footerData);
        });
    }
});

export const { 
    addFooterSection,
    removeFooterSection,
    updateFooterSection,
    addSocialMedia,
    removeSocialMedia,
    setFooterSize,
    setFooterFontStyle,
    setFooterColor,
    setFooterTextColor,
    setBorderColor
} = footerSlice.actions;

export const footerReducer = footerSlice.reducer; 