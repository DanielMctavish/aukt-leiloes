import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

const initialState = {
    footerData: {
        id: null,
        color: '#333333',
        sizeType: 'MEDIUM',
        companyName: '',
        showSocialLinks: true,
        textColor: '#ffffff',
        borderColor: 'rgba(255,255,255,0.2)',
        elementsOpacity: 1,
        sections: [],
        socialMedia: []
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
        setFooterSize: (state, action) => {
            state.footerData.sizeType = action.payload;
        },
        setFooterColor: (state, action) => {
            state.footerData.color = action.payload;
        },
        setFooterTextColor: (state, action) => {
            state.footerData.textColor = action.payload;
        },
        setFooterBorderColor: (state, action) => {
            state.footerData.borderColor = action.payload;
        },
        setElementsOpacity: (state, action) => {
            state.footerData.elementsOpacity = action.payload;
        },
        setCompanyName: (state, action) => {
            state.footerData.companyName = action.payload;
        },
        setShowSocialLinks: (state, action) => {
            state.footerData.showSocialLinks = action.payload;
        },
        addFooterSection: (state, action) => {
            state.footerData.sections.push({
                title: action.payload.title || '',
                links: action.payload.links?.map(link => ({
                    name: link.name || '',
                    url: link.url || ''
                })) || []
            });
        },
        removeFooterSection: (state, action) => {
            state.footerData.sections.splice(action.payload, 1);
        },
        addFooterSocialMedia: (state, action) => {
            console.log("Payload recebido:", action.payload);
            state.footerData.socialMedia.push({
                type: action.payload.type || '',
                url: action.payload.url || ''
            });
        },
        updateFooterSocialMedia: (state, action) => {
            const index = state.footerData.socialMedia.findIndex(
                social => social.type === action.payload.type
            );
            if (index !== -1) {
                state.footerData.socialMedia[index] = action.payload;
            }
        },
        removeFooterSocialMedia: (state, action) => {
            state.footerData.socialMedia.splice(action.payload, 1);
        },
        updateFooterData: (state, action) => {
            state.footerData = {
                ...state.footerData,
                ...action.payload
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            if (!action.payload) return;

            const footer = action.payload.footer;
            state.footerData = {
                ...initialState.footerData,
                ...footer,
                elementsOpacity: footer?.elementsOpacity || 1
            };
        });
    }
});

export const {
    setFooterSize,
    setFooterColor,
    setFooterTextColor,
    setFooterBorderColor,
    setElementsOpacity,
    setCompanyName,
    setShowSocialLinks,
    addFooterSection,
    removeFooterSection,
    addFooterSocialMedia,
    updateFooterSocialMedia,
    removeFooterSocialMedia,
    updateFooterData
} = footerSlice.actions;

export const footerReducer = footerSlice.reducer; 