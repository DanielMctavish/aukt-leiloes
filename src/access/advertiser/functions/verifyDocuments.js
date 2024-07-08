

const verifyCpf = (e, data) => {

    const { setCpf } = data

    let input = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (input.length > 11) {
        input = input.slice(0, 11); // Limita o input a 11 caracteres
    }

    if (input.length === 11) {
        setCpf(input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4"));
    } else {
        setCpf(input); // Define o valor do CPF sem formatação enquanto está incompleto
    }
};


const verifyCnpj = (e, data) => {
    const { setCnpj } = data

    let input = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (input.length > 14) {
        input = input.slice(0, 14); // Limita o input a 14 caracteres
    }

    if (input.length === 14) {
        setCnpj(input.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5"));
    } else {
        setCnpj(input); // Define o valor do CNPJ sem formatação enquanto está incompleto
    }
};

export { verifyCnpj, verifyCpf }