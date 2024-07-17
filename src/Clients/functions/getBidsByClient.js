import axios from "axios";

export const getBidsByClient = async (client_id, currentClient, setAllBids, setBidsWinners, setBudget) => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    let allBidsByClient
    const bidsAuctined = []
    let localBudget = 0

    try {

        if (currentClient)
            await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/list-bid?client_id=${client_id}`, {
                headers: {
                    "Authorization": `Bearer ${currentSessionClient.token}`
                }
            }).then((response) => {

                allBidsByClient = response.data
                allBidsByClient.forEach((bid) => {
                    //console.log("cada lance -> ", bid.Product[0].initial_value)

                    const isWinnerExisted = bidsAuctined.filter(filteredBid => filteredBid.Product[0].winner_id === bid.Product[0].winner_id)
                    if (isWinnerExisted.length > 0) return false

                    if (bid.client_id === client_id) {
                        bidsAuctined.push(bid)
                        localBudget += bid.Product[0].initial_value
                    }

                })

                // console.log("todos os lances pelo cliente: ", allBidsByClient)
                setAllBids(allBidsByClient)
                setBidsWinners(bidsAuctined)
                setBudget(localBudget)

            });

    } catch (error) {
        console.log("error at get bids by client -> ", error.message);
    }
};