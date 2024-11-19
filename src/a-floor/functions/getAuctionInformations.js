import axios from "axios"

//Get Auct.............................................................................................
const getAuctionInformations = async (auct_id, setCurrentAuct) => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct?auct_id=${auct_id}`)
        .then(async response => {

            setCurrentAuct(response.data)

        }).catch(err => {
            return err
        })

}

export { getAuctionInformations }