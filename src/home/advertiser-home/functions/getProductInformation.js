import axios from "axios"

const getProductInformations = async (product_id, setBidInformations, setCurrentProduct, setCurrentAuct, setCurrentAdvertiser) => {

    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));

    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/products/find?product_id=${product_id}`);
        const currentBids = response.data.Bid;

        const bidPromises = currentBids.map(async (bid) => {

            try {
                const currentClient = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-client?client_id=${bid.client_id}`, {
                    headers: {
                        "Authorization": `Bearer ${currentSessionClient.token}`
                    }
                });
                return {
                    value: bid.value,
                    client: currentClient.data,
                    bidTime: bid.created_at // Supondo que há um campo 'created_at' para data do lance
                };
            } catch (error) {
                console.log("Error at get client -> ", error.message);
                return null; // Retorne null em caso de erro para filtrar posteriormente
            }
            
        });

        const bidResults = await Promise.all(bidPromises);
        const validBids = bidResults.filter(bid => bid !== null);

        // Ordenar os lances de forma que o mais recente esteja no topo
        const sortedBids = validBids.sort((a, b) => new Date(b.bidTime) - new Date(a.bidTime));

        setBidInformations(sortedBids);
        setCurrentProduct(response.data);
        setCurrentAuct(response.data.Auct);
        setCurrentAdvertiser(response.data.Advertiser);
    } catch (error) {
        console.log("Error at get product information -> ", error.message);
    }
    
};

export { getProductInformations }