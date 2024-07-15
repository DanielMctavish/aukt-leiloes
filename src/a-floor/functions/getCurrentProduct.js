import axios from "axios"

const getCurrentProduct = async (product_id, setCurrentProduct) => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
        .then(async response => {
            setCurrentProduct(response.data)
        }).catch(err => {
            console.log('err get product >>', err.message)
        })

}

export { getCurrentProduct }