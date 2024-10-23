const cleanColors = {
    1: "#B8F1B0",
    2: "#7B9CC4",
    3: "#FDCEDF",
    4: "#C2B8A3",
    5: "#C3AED6",
    6: "#D47D7D",
    7: "#DCE381",
}

const candyColors = {
    1: "#F3C623",
    2: "#006CD0",
    3: "#F95454",
    4: "#00B8A9",
    5: "#D14D72",
    6: "#17B978",
    7: "#DC0000",
}

const sizeTypes = {
    full: "full",//100vh
    half: "half",//50vh
    third: "third"//33vh
}

const sectionTypes = {
    section: "section",
    content: "content",
    galeria: "galeria",
    contato: "contato",
    leiloes: "leiloes",
    produtos: "produtos",
}

const darkColors = {
    1: "#510000",
    2: "#03001C",
    3: "#3C2A21",
    4: "#2E001F",
    5: "#711D00",
    6: "#384A00",
    7: "#0e0e0e",
}

const monochromaticColors = {
    1: "#EEEEEE",
    2: "#272121",
    3: "#423F3E",
    4: "#3C2A21",
    5: "#697565",
    6: "#3C3D37",
    7: "#181C14",
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

const templateModels = {
    colorPalette: 'clean',
    fontStyle: fontStyles.robotoCondensed,
    header: {
        color: cleanColors[1],
        sizeType: sizeTypes.third,
        backgroundImage: null,
        backgroundImageOpacity: 30,
        backgroundImageBlur: 2,
        backgroundImageBrightness: 100,
    },
    sections: [],
    footer: {
        color: cleanColors[4],
        sizeType: sizeTypes.third
    }
}

export { templateModels, cleanColors, candyColors, darkColors, monochromaticColors, sizeTypes, sectionTypes, fontStyles, constructorModels }
