/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from 'axios';

// Definindo os tipos de seção diretamente aqui
const SECTION_TYPES = {
    PRODUCT_CAROUSEL: {
        label: 'Carrosel de Produtos',
        description: 'Exibe produtos em formato de carrossel',
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
    GALLERY: {
        label: 'Galeria de Produtos',
        description: 'Exibe produtos em formato de grade',
        config: {
            layout: 'GRID',
            itemsPerRow: 3,
            showTitle: true,
            showPrice: true,
            selectedAuctId: null
        }
    },
    TEXT: {
        label: 'Texto',
        description: 'Área para texto livre com título opcional',
        config: {
            content: 'Novo conteúdo',
            fontSize: '16',
            alignment: 'LEFT',
            textColor: '#000000',
            preserveLineBreaks: true
        }
    },
    FORM: {
        label: 'Formulário de Contato',
        description: 'Formulário para contato via WhatsApp',
        config: {
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
    AUCT_LIST: {
        label: 'Lista de Leilões',
        description: 'Exibe leilões em formato de grade',
        config: {
            layout: 'GRID',
            itemsPerRow: 3,
            showProductCount: true,
            showStartDate: true,
            showEndDate: true
        }
    },
    TESTIMONIALS: {
        label: 'Depoimentos',
        description: 'Exibe depoimentos de clientes',
        config: {
            layout: 'GRID',
            itemsPerRow: 3
        }
    }
};

const initialState = {
    sectionsData: {
        id: null,
        sections: [],
        selectedPalette: 'clean'
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
        updateSectionsData: (state, action) => {
            // Este reducer único vai lidar com todas as atualizações do estado
            state.sectionsData = {
                ...state.sectionsData,
                ...action.payload
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTemplate.fulfilled, (state, action) => {
            if (!action.payload) return;

            const template = action.payload;
            state.sectionsData = {
                ...state.sectionsData,
                id: template.id,
                sections: template.sections
            };
        });
    }
});

export const { updateSectionsData } = sectionsSlice.actions;
export const sectionsReducer = sectionsSlice.reducer; 