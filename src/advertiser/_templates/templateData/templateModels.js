const cleanColors = {
    1: "#ffffff",
    2: "#c6ffe6",
    3: "#dcf7ff",
    4: "#d0e8ff",
    5: "#fff5e7",
    6: "#ffecd4",
    7: "#e5ffe5",
}

const candyColors = {
    1: "#ff5b79",
    2: "#02ff91",
    3: "#039eff",
    4: "#00d9ff",
    5: "#ffa633",
    6: "#fefe34",
    7: "#4af94a",
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
    1: "#1a1a1a",
    2: "#360101",
    3: "#09291d",
    4: "#291710",
    5: "#1f0625",
    6: "#0e1b35",
    7: "#070109",
}

const monochromaticColors = {
    1: "#ffffff",
    2: "#eaeaea",
    3: "#c9c9c9",
    4: "#969696",
    5: "#b3b3b3",
    6: "#a4b3b7",
    7: "#a5a9a7",
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

const templateModels = {
    colorPalette: 'clean',
    fontStyle: fontStyles.robotoCondensed,
    header: {
        color: cleanColors[1],
        sizeType: sizeTypes.third
    },
    sections: [],
    footer: {
        color: cleanColors[4],
        sizeType: sizeTypes.third
    }
}

export { templateModels, cleanColors, candyColors, darkColors, monochromaticColors, sizeTypes, sectionTypes, fontStyles }
