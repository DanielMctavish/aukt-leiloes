const cleanColors = {
    1: "#B8F1B0",
    2: "#7B9CC4",
    3: "#FDCEDF",
    4: "#C2B8A3",
    5: "#C3AED6",
    6: "#D47D7D",
    7: "#DCE381",
    8: "#efefef",
}

const candyColors = {
    1: "#F3C623",
    2: "#006CD0",
    3: "#F95454",
    4: "#00B8A9",
    5: "#D14D72",
    6: "#17B978",
    7: "#DC0000",
    8: "#efefef"
}

const sizeTypes = {
    small: "SMALL",    // 25vh
    medium: "MEDIUM",  // 50vh
    full: "FULL"      // 100vh
}

const sectionTypes = {
    gallery: {
        id: 'gallery',
        label: 'Galeria de Produtos',
        description: 'Exibe os produtos de um leilão específico em um carrossel',
        config: {
            selectedAuctId: null,
            layout: 'grid', // ou 'carousel'
            itemsPerRow: 4,
            showPrice: true,
            showTitle: true,
            autoplay: true,
            speed: 3000
        }
    },
    text: {
        id: 'text',
        label: 'Seção de Texto',
        description: 'Área para conteúdo textual livre',
        config: {
            content: '',
            alignment: 'left', // 'center', 'right'
            fontSize: '16', // Agora é uma string com o valor em pixels
            showTitle: true,
            title: '',
            textColor: '#000000',
            preserveLineBreaks: true // Nova propriedade
        }
    },
    form: {
        id: 'form',
        label: 'Formulário de Contato',
        description: 'Formulário personalizável para captação de leads',
        config: {
            title: 'Entre em contato',
            destination: 'whatsapp', // ou 'email'
            whatsappNumber: '',
            email: '',
            fields: [
                { type: 'text', label: 'Nome', required: true },
                { type: 'email', label: 'Email', required: true },
                { type: 'tel', label: 'Telefone', required: false },
                { type: 'textarea', label: 'Mensagem', required: false }
            ],
            buttonText: 'Enviar',
            successMessage: 'Mensagem enviada com sucesso!'
        }
    },
    auctList: {
        id: 'auctList',
        label: 'Lista de Leilões',
        description: 'Exibe os leilões disponíveis do anunciante',
        config: {
            layout: 'grid', // ou 'list'
            itemsPerRow: 3,
            showDate: true
        }
    }
};

const darkColors = {
    1: "#510000",
    2: "#03001C",
    3: "#3C2A21",
    4: "#2E001F",
    5: "#711D00",
    6: "#384A00",
    7: "#2b2b2b",
    8: "#021208",
    9: "#efefef",
}

const monochromaticColors = {
    1: "#EEEEEE",
    2: "#272121",
    3: "#423F3E",
    4: "#3C2A21",
    5: "#697565",
    6: "#3C3D37",
    7: "#181C14",
    8: "#ffffff",
}

const fontStyles = {
    robotoCondensed: "'Roboto Condensed', sans-serif",
    anton: "'Anton', sans-serif",
    oswald: "'Oswald', sans-serif",
    ptSans: "'PT Sans', sans-serif",
    bebasNeue: "'Bebas Neue', sans-serif",
    dancingScript: "'Dancing Script', cursive",
    pacifico: "'Pacifico', cursive",
    caveat: "'Caveat', cursive",
    lobster: "'Lobster', cursive",
    rajdhani: "'Rajdhani', sans-serif",
    mysteryQuest: "'Mystery Quest', cursive",
    bahianita: "'Bahianita', cursive",
    barrio: "'Barrio', cursive",
    tillana: "'Tillana', cursive"
}

const constructorModels = {
    model_01: {
        elements: [
            {
                id: "element_1",
                clean: {
                    saturation: 100,
                    lightness: 81,
                },
                candy: {
                    saturation: 70,
                    lightness: 61,
                },
                dark: {
                    saturation: 60,
                    lightness: 9,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 16,
                },
                color: "#FFFF",
                main: false
            },
            {
                id: "element_2",
                clean: {
                    saturation: 100,
                    lightness: 70,
                },
                candy: {
                    saturation: 100,
                    lightness: 36,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 8,
                },
                dark: {
                    saturation: 100,
                    lightness: 9,
                },
                color: "#FFFF",
                main: false
            },
            {
                id: "element_3",
                clean: {
                    saturation: 100,
                    lightness: 82,
                },
                candy: {
                    saturation: 70,
                    lightness: 36,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 14,
                },
                dark: {
                    saturation: 60,
                    lightness: 9,
                },
                color: "#FFFF",
                main: false
            },
            {
                id: "element_4",
                clean: {
                    saturation: 100,
                    lightness: 75,
                },
                candy: {
                    saturation: 70,
                    lightness: 50,
                },
                dark: {
                    saturation: 60,
                    lightness: 12,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 20,
                },
                color: "#FFFF",
                main: true
            },
            {
                id: "element_5",
                clean: {
                    saturation: 100,
                    lightness: 82,
                },
                candy: {
                    saturation: 70,
                    lightness: 61,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 14,
                },
                dark: {
                    saturation: 100,
                    lightness: 9,
                },
                color: "#FFFF",
                main: false
            },
            {
                id: "element_6",
                clean: {
                    saturation: 100,
                    lightness: 82,
                },
                candy: {
                    saturation: 70,
                    lightness: 61,
                },
                monochromatic: {
                    saturation: 17,
                    lightness: 14,
                },
                dark: {
                    saturation: 100,
                    lightness: 9,
                },
                color: "#FFFF",
                main: false
            }
        ],
        background_element: {
            clean: {
                saturation: 70,
                lightness: 70,
            },
            candy: {
                saturation: 100,
                lightness: 26,
            },
            monochromatic: {
                saturation: 17,
                lightness: 30,
            },
            dark: {
                saturation: 100,
                lightness: 4,
            },
            color: "#FFFF",
            main: false
        },
        background_img: ""
    }
}

const textsSessions = {
    textsHeader: [
        {
            model: 1,
            texts: [
                {
                    id: 1,
                    title: "Título Principal",
                    content: "Conteúdo principal do seu leilão. Descreva aqui os principais destaques e informações importantes.",
                    position: {
                        top: '30%',
                        left: '5%',
                        width: '30vw'
                    },
                    style: {
                        titleBackground: 'transparent',
                        titleColor: '#ffffff',
                        contentColor: '#ffffff',
                        titleSize: '1x', 
                        titleBorderRadius: '0px' 
                    },
                    visible: true
                },
                {
                    id: 2,
                    title: "Título Secundário",
                    content: "Informações adicionais sobre seu leilão. Use este espaço para detalhar condições especiais ou outros aspectos relevantes.",
                    position: {
                        top: '45%',
                        left: '60%',
                        width: '30vw'
                    },
                    style: {
                        titleBackground: 'transparent',
                        titleColor: '#ffffff',
                        contentColor: '#ffffff',
                        titleSize: '1x', 
                        titleBorderRadius: '0px' 
                    },
                    visible: true
                }
            ],
            carousel: {
                enabled: false,
                title: "Produtos em Destaque",
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
            }
        }
    ],
    textsSections: [],
    textsFooter: []
};

const socialLinks = {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
};

const templateModels = {
    colorPalette: 'clean',
    fontStyle: 'robotoCondensed',
    header: {
        color: cleanColors[1],
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
            positionTop: "50%",
            positionLeft: "50%",
            showTitle: true,
            showPrice: true,
            showCarouselTitle: true,
            showNavigation: true
        }
    },
    footer: {
        color: cleanColors[4],
        sizeType: 'MEDIUM',
        sections: {
            section_1: {
                title: "Sobre Nós",
                links: [
                    {
                        label: "Nossa História",
                        url: "#"
                    },
                    {
                        label: "Contato",
                        url: "#"
                    }
                ]
            },
            section_2: {
                title: "Links Úteis",
                links: [
                    {
                        label: "FAQ",
                        url: "#"
                    },
                    {
                        label: "Termos de Uso",
                        url: "#"
                    }
                ]
            }
        },
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: ""
        },
        companyName: "EMPRESA",
        showSocialLinks: true,
        textColor: "#FFFFFF",
        borderColor: "rgba(255,255,255,0.2)",
        elementsOpacity: 100
    },
    sections: []
};


export { templateModels, cleanColors, candyColors, darkColors, monochromaticColors, sizeTypes, sectionTypes, fontStyles, constructorModels, textsSessions, socialLinks }
