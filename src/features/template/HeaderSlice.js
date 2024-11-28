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
const PALETTES = {
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
        size: 'MEDIUM',
        sizeType: 'MEDIUM',
        color: '#2e2e2e',
        model: 'MODEL_1',
        colorPalette: 'clean',
        fontStyle: FONT_FAMILIES.firaSansCondensed,
        fontFamilies: FONT_FAMILIES,
        background: {
            image: null,
            opacity: 30,
            blur: 2,
            brightness: 100
        },
        elementsOpacity: 100,
        texts: [],
        carousel: {
            enabled: false,
            title: "Produtos em Destaque",
            selectedAuctId: null,
            size: {
                width: "600px",
                height: "400px"
            },
            itemsToShow: 4,
            speed: 3000,
            position: {
                top: '60%',
                left: '10%'
            },
            showTitle: true,
            showPrice: true,
            showCarouselTitle: true,
            showNavigation: true
        },
        palettes: PALETTES,
        elements: {
            element_1: { 
                clean: { saturation: 100, lightness: 81 },
                candy: { saturation: 70, lightness: 61 },
                dark: { saturation: 60, lightness: 9 },
                monochromatic: { saturation: 17, lightness: 16 }
            },
            element_2: { 
                clean: { saturation: 100, lightness: 70 },
                candy: { saturation: 100, lightness: 36 },
                dark: { saturation: 100, lightness: 9 },
                monochromatic: { saturation: 17, lightness: 8 }
            },
            element_3: { 
                clean: { saturation: 100, lightness: 82 },
                candy: { saturation: 70, lightness: 36 },
                dark: { saturation: 60, lightness: 9 },
                monochromatic: { saturation: 17, lightness: 14 }
            },
            element_4: { 
                clean: { saturation: 100, lightness: 75 },
                candy: { saturation: 70, lightness: 50 },
                dark: { saturation: 60, lightness: 12 },
                monochromatic: { saturation: 17, lightness: 20 }
            },
            element_5: { 
                clean: { saturation: 100, lightness: 82 },
                candy: { saturation: 70, lightness: 61 },
                dark: { saturation: 100, lightness: 9 },
                monochromatic: { saturation: 17, lightness: 14 }
            },
            element_6: { 
                clean: { saturation: 100, lightness: 82 },
                candy: { saturation: 70, lightness: 61 },
                dark: { saturation: 100, lightness: 9 },
                monochromatic: { saturation: 17, lightness: 14 }
            }
        }
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
            state.headerData.size = action.payload;
            state.headerData.sizeType = action.payload;
        },
        setHeaderColor: (state, action) => {
            state.headerData.color = action.payload;
        },
        setHeaderModel: (state, action) => {
            // 'MODEL_1' | 'MODEL_2' | ...
            state.headerData.model = action.payload;
        },
        setHeaderBackground: (state, action) => {
            // { image?, opacity?, blur?, brightness? }
            state.headerData.background = {
                ...state.headerData.background,
                ...action.payload
            };
        },
        setElementsOpacity: (state, action) => {
            state.headerData.elementsOpacity = action.payload;
        },
        // Gerenciamento de textos
        addHeaderText: (state, action) => {
            state.headerData.texts.push(action.payload);
        },
        updateHeaderText: (state, action) => {
            // { id, updates }
            const { id, updates } = action.payload;
            const textIndex = state.headerData.texts.findIndex(text => text.id === id);
            if (textIndex !== -1) {
                state.headerData.texts[textIndex] = {
                    ...state.headerData.texts[textIndex],
                    ...updates
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            if (!action.payload) return;

            const template = action.payload;
            
            // Atualiza o estado com os dados do template
            state.headerData = {
                ...state.headerData,
                id: template.id,
                colorPalette: template.colorPalette.toLowerCase(),
                fontStyle: template.fontStyle.toLowerCase(),
                color: template.header.color,
                sizeType: template.header.sizeType.toLowerCase(),
                model: template.header.model,
                background: {
                    image: template.header.backgroundImage,
                    opacity: template.header.backgroundImageOpacity * 100,
                    blur: template.header.backgroundImageBlur,
                    brightness: template.header.backgroundImageBrightness * 100
                },
                elementsOpacity: template.header.elementsOpacity * 100,
                texts: template.header.texts.map(text => ({
                    id: text.id,
                    title: text.title,
                    content: text.content,
                    position: {
                        top: text.positionTop,
                        left: text.positionLeft,
                        width: text.positionWidth
                    },
                    style: {
                        titleBackground: text.titleBackground,
                        titleColor: text.titleColor,
                        contentColor: text.contentColor,
                        titleSize: text.titleSize.replace('px', ''),
                        titleBorderRadius: text.titleBorderRadius
                    },
                    visible: text.visible
                })),
                carousel: template.header.carousel ? {
                    enabled: template.header.carousel.enabled,
                    title: template.header.carousel.title,
                    selectedAuctId: template.header.carousel.selectedAuctId,
                    size: {
                        width: template.header.carousel.sizeWidth,
                        height: template.header.carousel.sizeHeight
                    },
                    itemsToShow: template.header.carousel.itemsToShow,
                    speed: template.header.carousel.speed,
                    position: {
                        top: template.header.carousel.positionTop,
                        left: template.header.carousel.positionLeft
                    },
                    showTitle: template.header.carousel.showTitle,
                    showPrice: template.header.carousel.showPrice,
                    showCarouselTitle: template.header.carousel.showCarouselTitle,
                    showNavigation: template.header.carousel.showNavigation
                } : state.headerData.carousel,
                size: template.header.sizeType
            };
        });
    }
});

export const {
    setHeaderSize,
    setHeaderColor,
    setHeaderModel,
    setHeaderBackground,
    setElementsOpacity,
    addHeaderText,
    updateHeaderText,
    removeHeaderText,
    setCarouselConfig,
    toggleCarousel,
    setHeaderData,
    setColorPalette,
    setFontStyle
} = headerSlice.actions;

export const headerReducer = headerSlice.reducer; 