import axios from "axios";

export const getAuctsByBids = async (allBids, setAllAucts) => {
    const currentSessionClient = JSON.parse(localStorage.getItem("client-auk-session-login"));
    let aucts = [];
    let seenAuctIds = new Set();

    for (const bid of allBids) {
        if (!seenAuctIds.has(bid.auct_id)) {
            seenAuctIds.add(bid.auct_id);
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${bid.auct_id}`, {
                    headers: {
                        "Authorization": `Bearer ${currentSessionClient.token}`
                    }
                });
                aucts.push(response.data);
            } catch (error) {
                return error
            }
        }
    }

    setAllAucts(aucts);
};