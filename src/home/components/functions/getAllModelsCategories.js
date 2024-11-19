import axios from "axios"

const getAllModelsCategories = async (setCurrentCategory) => {
    const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/category`);
    setCurrentCategory(response.data);
};


export { getAllModelsCategories }