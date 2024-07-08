import axios from "axios"

const handleGetAddress = (event, data) => {

    const { refState, refCity, refStreet } = data;

    const cep = event.target.value
    const url = `https://viacep.com.br/ws/${cep}/json/`
    axios.get(url).then(res => {
        console.log('res ai ->', res.data);
        refState.current.value = res.data.uf
        refCity.current.value = res.data.localidade
        refStreet.current.value = res.data.logradouro
    }).catch(err => {
        console.log(err.response);
    })

}

export { handleGetAddress };