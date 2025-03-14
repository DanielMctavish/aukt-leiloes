import axios from "axios"

const getAuctionsList = async (currentLocalAdvertiser, setAucts) => {

    const currentAdvertiserStorage = JSON.parse(currentLocalAdvertiser)

    try {

        const getAdvertiser = await
            axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentAdvertiserStorage.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentAdvertiserStorage.token}`
                }
            }).catch(err => {
                throw new Error('error ao tentar pegar advertiser by email: ', err.response)
            })

        await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct?creator_id=${getAdvertiser.data.id}`, {
            headers: {
                'Authorization': `Bearer ${currentAdvertiserStorage.token}`
            }
        }).then(response => {

            setAucts(response.data)

        }).catch(err => {
            return err
        })

    } catch (error) {
        return error
    }

}

export default getAuctionsList;