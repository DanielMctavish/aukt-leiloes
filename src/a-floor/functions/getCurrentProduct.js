import axios from "axios"

const getCurrentProduct = async (product_id, setCurrentProduct) => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`)
            .then(async response => {
                setCurrentProduct(response.data)
            })
    } catch (error) {
        console.log("error at try get product: ", error.message)
    }

}

export { getCurrentProduct }