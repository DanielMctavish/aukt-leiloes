import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

// Definindo os tipos de seção diretamente aqui
const SECTION_TYPES = {
    gallery: {
        label: 'Galeria de Produtos',
        description: 'Exibe produtos em formato de grade ou carrossel',
        config: {
            layout: 'GRID',
            itemsPerRow: 3,
            showTitle: true,
            showPrice: true,
            selectedAuctId: null,
            speed: 3000,
            autoplay: true
        }
    },
    text: {
        label: 'Texto',
        description: 'Área para texto livre com título opcional',
        config: {
            content: 'Novo conteúdo',
            fontSize: '16',
            alignment: 'LEFT',
            textColor: '#ffffff',
            preserveLineBreaks: true
        }
    },
    form: {
        label: 'Formulário de Contato',
        description: 'Formulário para contato via WhatsApp',
        config: {
            title: 'Entre em Contato',
            buttonText: 'Enviar Mensagem',
            whatsappNumber: '',
            fields: [
                { type: 'text', label: 'Nome', required: true },
                { type: 'email', label: 'E-mail', required: true },
                { type: 'text', label: 'Telefone', required: false },
                { type: 'textarea', label: 'Mensagem', required: true }
            ]
        }
    },
    auct_list: {
        label: 'Lista de Leilões',
        description: 'Exibe leilões em formato de grade',
        config: {
            layout: 'GRID',
            itemsPerRow: 3,
            showProductCount: true,
            showStartDate: true,
            showEndDate: true
        }
    }
};

const initialState = {
    sectionsData: {
        id: null,
        sections: [], // Array de seções
        selectedPalette: 'clean', // Paleta de cores atual
        sectionTypes: SECTION_TYPES // Tipos de seções disponíveis
    }
}

// Action Thunk para carregar o template
export const fetchTemplate = createAsyncThunk(
    'sections/fetchTemplate',
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

const sectionsSlice = createSlice({
    name: "sections_template",
    initialState,
    reducers: {
        addSection: (state, action) => {
            const sectionType = action.payload.toLowerCase();
            const newSection = {
                type: sectionType,
                config: {
                    ...SECTION_TYPES[sectionType].config
                },
                sizeType: 'MEDIUM',
                color: '#2e2e2e'
            };
            state.sectionsData.sections.push(newSection);
        },
        removeSection: (state, action) => {
            // action.payload = índice da seção
            state.sectionsData.sections = state.sectionsData.sections.filter(
                (_, index) => index !== action.payload
            );
        },
        updateSection: (state, action) => {
            const { index, key, value } = action.payload;
            if (key === 'type') {
                const sectionType = value.toLowerCase();
                state.sectionsData.sections[index] = {
                    ...state.sectionsData.sections[index],
                    type: sectionType,
                    config: {
                        ...SECTION_TYPES[sectionType].config
                    }
                };
            } else {
                state.sectionsData.sections[index] = {
                    ...state.sectionsData.sections[index],
                    [key]: value
                };
            }
        },
        updateSectionConfig: (state, action) => {
            const { index, config } = action.payload;
            state.sectionsData.sections[index].config = {
                ...state.sectionsData.sections[index].config,
                ...config
            };
        },
        setSectionPalette: (state, action) => {
            state.sectionsData.selectedPalette = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            console.log("Sections Template Response:", action.payload);
            if (!action.payload) return;

            const template = action.payload;
            
            state.sectionsData = {
                ...state.sectionsData,
                id: template.id,
                sections: template.sections.map(section => {
                    const sectionType = section.type.toLowerCase();
                    return {
                        type: sectionType,
                        color: section.color,
                        sizeType: section.sizeType,
                        config: {
                            ...SECTION_TYPES[sectionType].config,
                            ...section.config
                        }
                    };
                })
            };

            console.log("Sections State After Update:", state.sectionsData);
        });
    }
});

export const {
    addSection,
    removeSection,
    updateSection,
    updateSectionConfig,
    setSectionPalette
} = sectionsSlice.actions;

export const sectionsReducer = sectionsSlice.reducer; 