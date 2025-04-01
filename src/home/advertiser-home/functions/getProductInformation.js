import axios from "axios"

const getProductInformations = async (product_id, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser) => {

    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
  
        setCurrentProduct(response.data);
        setCurrentAuct(response.data.Auct);
        setCurrentAdvertiser(response.data.Advertiser);
    } catch (error) {
        return error
    }
};

export { getProductInformations }