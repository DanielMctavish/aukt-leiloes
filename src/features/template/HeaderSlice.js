import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

// Definindo as fontes disponíveis conforme o index.html
const FONT_FAMILIES = {
    allura: "'Allura'",
    amaticSC: "'Amatic SC'",
    anton: "'Anton'",
    audiowide: "'Audiowide'",
    bebasNeue: "'Bebas Neue'",
    bokor: "'Bokor'",
    dancingScript: "'Dancing Script'",
    eduArrows: "'Edu AU VIC WA NT Arrows'",
    eduDots: "'Edu AU VIC WA NT Dots'",
    fasterOne: "'Faster One'",
    firaSansCondensed: "'Fira Sans Condensed'",
    greatVibes: "'Great Vibes'",
    gruppo: "'Gruppo'",
    holtwoodOneSC: "'Holtwood One SC'",
    jaro: "'Jaro'",
    monoton: "'Monoton'",
    permanentMarker: "'Permanent Marker'",
    pirataOne: "'Pirata One'",
    playwriteHR: "'Playwrite HR Lijeva'",
    poiretOne: "'Poiret One'",
    sevillana: "'Sevillana'",
    shadowsIntoLight: "'Shadows Into Light'",
    sixCaps: "'Six Caps'",
    syncopate: "'Syncopate'",
    tillana: "'Tillana'",
    unna: "'Unna'"
};

// Definindo as paletas de cores diretamente no slice
export const PALETTES = {
    clean: {
        1: '#e8f3f2',
        2: '#dffeee',
        3: '#b3f7ff',
        4: '#fde1ff',
        5: '#fffee9',
        6: '#ffeed1',
        7: '#e4ffe2',
        8: '#f7fffe'
    },
    candy: {
        1: '#f96f6f',
        2: '#ffb46a',
        3: '#ffff6c',
        4: '#5fff5f',
        5: '#7effff',
        6: '#8181ff',
        7: '#fd89fd',
        8: '#fe59ac'
    },
    dark: {
        1: '#1A1A1A',
        2: '#081527',
        3: '#0a280e',
        4: '#250202',
        5: '#290336',
        6: '#232802',
        7: '#2f1c02',
        8: '#2e0226'
    },
    monochromatic: {
        1: '#2E2E2E',
        2: '#3D3D3D',
        3: '#4C4C4C',
        4: '#5B5B5B',
        5: '#6A6A6A',
        6: '#797979',
        7: '#888888',
        8: '#979797'
    }
};

const initialState = {
    headerData: {
        id: null,
        color: '#2e2e2e',
        sizeType: 'MEDIUM',
        model: 'MODEL_1',
        backgroundImage: null,
        backgroundImageOpacity: 1,
        backgroundImageBlur: 0,
        backgroundImageBrightness: 1,
        elementsOpacity: 1,
        texts: [],
        carousel: {
            enabled: false,
            title: "Produtos em Destaque",
            selectedAuctId: null,
            sizeWidth: "600px",
            sizeHeight: "400px",
            itemsToShow: 4,
            speed: 3000,
            positionTop: '60%',
            positionLeft: '10%',
            showTitle: true,
            showPrice: true,
            showCarouselTitle: true,
            showNavigation: true
        },
        colorPalette: 'clean',
        fontStyle: FONT_FAMILIES.firaSansCondensed,
        fontFamilies: FONT_FAMILIES,
        palettes: PALETTES
    }
}

// Action Thunk para carregar o template
export const fetchTemplate = createAsyncThunk(
    'header/fetchTemplate',
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

            console.log("observando template no headerSlice", template.sections);

            if (!template) return null;

            return template;
        } catch (error) {
            console.error("Erro ao buscar template:", error);
            throw error;
        }
    }
);

const headerSlice = createSlice({
    name: "header_template",
    initialState,
    reducers: {
        setHeaderSize: (state, action) => {
            state.headerData.sizeType = action.payload;
        },
        setHeaderColor: (state, action) => {
            state.headerData.color = action.payload;
        },
        setHeaderModel: (state, action) => {
            // 'MODEL_1' | 'MODEL_2' | ...
            state.headerData.model = action.payload;
        },
        updateBackground: (state, action) => {
            state.headerData.backgroundImage = action.payload.url;
            state.headerData.backgroundImageOpacity = action.payload.opacity ? action.payload.opacity / 100 : 1;
            state.headerData.backgroundImageBlur = action.payload.blur || 0;
            state.headerData.backgroundImageBrightness = action.payload.brightness ? action.payload.brightness / 100 : 1;
        },
        setElementsOpacity: (state, action) => {
            state.headerData.elementsOpacity = action.payload;
        },
        // Gerenciamento de textos
        addHeaderText: (state, action) => {
            state.headerData.texts.push({
                id: action.payload.id,
                title: action.payload.title || '',
                content: action.payload.content || '',
                positionTop: action.payload.positionTop || '50%',
                positionLeft: action.payload.positionLeft || '50%',
                positionWidth: action.payload.positionWidth || '200px',
                titleBackground: action.payload.titleBackground || 'transparent',
                titleColor: action.payload.titleColor || '#ffffff',
                contentColor: action.payload.contentColor || '#ffffff',
                titleSize: action.payload.titleSize || '60px',
                titleBorderRadius: action.payload.titleBorderRadius || '0px',
                visible: action.payload.visible !== undefined ? action.payload.visible : true
            });
        },
        updateHeaderText: (state, action) => {
            const { id, updates } = action.payload;
            const textIndex = state.headerData.texts.findIndex(text => text.id === id);
            
            if (textIndex !== -1) {
                state.headerData.texts[textIndex] = {
                    ...state.headerData.texts[textIndex],
                    title: updates.title || state.headerData.texts[textIndex].title,
                    content: updates.content || state.headerData.texts[textIndex].content,
                    positionTop: updates.positionTop || state.headerData.texts[textIndex].positionTop,
                    positionLeft: updates.positionLeft || state.headerData.texts[textIndex].positionLeft,
                    positionWidth: updates.positionWidth || state.headerData.texts[textIndex].positionWidth,
                    titleBackground: updates.titleBackground || state.headerData.texts[textIndex].titleBackground,
                    titleColor: updates.titleColor || state.headerData.texts[textIndex].titleColor,
                    contentColor: updates.contentColor || state.headerData.texts[textIndex].contentColor,
                    titleSize: updates.titleSize || state.headerData.texts[textIndex].titleSize,
                    titleBorderRadius: updates.titleBorderRadius || state.headerData.texts[textIndex].titleBorderRadius,
                    visible: updates.visible !== undefined ? updates.visible : state.headerData.texts[textIndex].visible
                };
            }
        },
        removeHeaderText: (state, action) => {
            // id do texto
            state.headerData.texts = state.headerData.texts.filter(
                text => text.id !== action.payload
            );
        },
        // Gerenciamento do carrossel
        setCarouselConfig: (state, action) => {
            state.headerData.carousel = {
                ...state.headerData.carousel,
                ...action.payload
            };
        },
        toggleCarousel: (state, action) => {
            state.headerData.carousel.enabled = action.payload;
        },
        // Atualização completa do header
        setHeaderData: (state, action) => {
            state.headerData = action.payload;
        },
        setColorPalette: (state, action) => {
            // action.payload = 'clean' | 'candy' | 'dark' | 'monochromatic'
            state.headerData.colorPalette = action.payload;
            // Define a primeira cor da nova paleta como cor padrão
            state.headerData.color = PALETTES[action.payload][1];
            // Atualiza a paleta disponível
            state.headerData.palettes = {
                [action.payload]: PALETTES[action.payload]
            };
        },
        setFontStyle: (state, action) => {
            state.headerData.fontStyle = action.payload;
        },
        updateHeaderData: (state, action) => {
            state.headerData = {
                ...state.headerData,
                ...action.payload
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            if (action.payload) {
                const header = action.payload.header;
                state.headerData = {
                    ...initialState.headerData,
                    ...header,
                    colorPalette: action.payload.colorPalette?.toLowerCase() || 'clean',
                    fontStyle: action.payload.fontStyle || FONT_FAMILIES.firaSansCondensed,
                    fontFamilies: FONT_FAMILIES,
                    palettes: PALETTES,
                    carousel: header?.carousel || initialState.headerData.carousel
                };
            }
        });
    }
});

export const {
    setHeaderSize,
    setHeaderColor,
    setHeaderModel,
    updateBackground,
    setElementsOpacity,
    addHeaderText,
    updateHeaderText,
    removeHeaderText,
    setCarouselConfig,
    toggleCarousel,
    setHeaderData,
    setColorPalette,
    setFontStyle,
    updateHeaderData
} = headerSlice.actions;

export const headerReducer = headerSlice.reducer; 