// src/utils/formatCurrency.js
const formatCurrency = (value) => {
    // Garante que o valor seja um número antes de formatar
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
        // Retorna um valor padrão ou string vazia se não for um número
        // Ou pode lançar um erro, dependendo do comportamento desejado
        console.warn("formatCurrency recebeu um valor não numérico:", value);
        return 'R$ 0,00'; 
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numericValue);
};

export default formatCurrency; 