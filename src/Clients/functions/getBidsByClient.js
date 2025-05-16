/* eslint-disable no-unreachable */
import axios from "axios";

export const getBidsByClient = async (client_id, currentClient, setAllBids, setBidsWinners, setBudget) => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    let allBidsByClient
    let localBudget = 0
    let clientFounded = {}

    try {


        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-by-email?email=${currentSessionClient.email}`, {
            headers: {
                "Authorization": `Bearer ${currentSessionClient.token}`
            }
        }).then((response) => {
            clientFounded = response.data
        })

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/list-bid?client_id=${client_id}`, {
            headers: {
                "Authorization": `Bearer ${currentSessionClient.token}`
            }
        }).then((response) => {
            const bidsAuctined = []

            allBidsByClient = response.data

            allBidsByClient.forEach((bids) => {

                if (bids.Product[0] && bids.Product[0].winner_id === clientFounded.id) {
                    bidsAuctined.push(bids)
                }
            });

            setAllBids(allBidsByClient)

            //antes de setar preciso verificar se não tem bid.id repetido...
            const bidsFiltered = []
            bidsAuctined.forEach((bid) => {
                if (!bidsFiltered.find((b) => b.Product[0].id === bid.Product[0].id)) {

                    bidsFiltered.push(bid)
                    localBudget += bid.Product[0] ? bid.Product[0].real_value : 0
                }

            })

            setBidsWinners(bidsFiltered)
            setBudget(localBudget)

        });

    } catch (error) {
       return error
    }
};