import axios from "axios";

const loadPage = async (pageIndex, auct_id, setProductsFiltered, setCurrentPage) => {

    try {
        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`, {
            params: {
                auct_id: auct_id,
                take: 12,
                skip: pageIndex * 12
            }
        }).then(response => {
            setProductsFiltered(response.data);
            setCurrentPage(pageIndex);
        })
    } catch (error) {
        console.log("Error loading page:", error.message);
    }
    
};

export { loadPage };
