import axios from "axios"

const handleBidproduct = async (bidValue, messageRef, currentProduct,
    currentClient, currentAuct, sessionClient, setBidValue, setSuccessBid, successBid, setIsloadingBid) => {
    //console.log("observando produto -> ", currentProduct.id)
    setIsloadingBid &&
        setIsloadingBid(true)

    if (messageRef && bidValue <= 0 || typeof parseInt(bidValue) !== 'number' || !bidValue) {
        messageRef.current.style.transition = "1s"
        messageRef.current.style.marginTop = "0"
        messageRef.current.innerHTML = "O valor do lance deve ser maior que 0"
        messageRef.current.style.color = "red"

        setTimeout(() => {
            messageRef.current.style.marginTop = "-30px"
        }, 6000);

        return
    }

    if (messageRef && bidValue <= currentProduct.initial_value) {
        messageRef.current.style.transition = "1s"
        messageRef.current.style.marginTop = "0"
        messageRef.current.innerHTML = "O valor do lance deve ser maior que o valor inicial"
        messageRef.current.style.color = "#bd9202"

        setTimeout(() => {
            messageRef.current.style.marginTop = "-30px"
        }, 6000);

        return
    }

    const isValueAbove = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/client/find-bid?value=${parseFloat(bidValue)}`, {
        headers: {
            "Authorization": `Bearer ${sessionClient.token}`
        }
    }).then(response => {
        if (response.data) {
            setIsloadingBid(false)
            console.log("valor precisa ser maior do que o atual!")
            return
        }
    }).catch(error => {
        console.log("error ao tentar encontrar um bid", error.message)

    })

    try {
        if (isValueAbove && isValueAbove.data.value < bidValue) {
            setIsloadingBid(false)
            console.log("valor precisa ser maior do que o atual!")
            return
        }

        if (isValueAbove && parseFloat(isValueAbove.data.value) === parseFloat(bidValue)) {
            setIsloadingBid(false)
            console.log("valor já foi lancado!")
            return
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/bid-auct`, {
            value: parseFloat(bidValue),
            client_id: currentClient.id,
            auct_id: currentAuct.id,
            product_id: currentProduct.id
        }, {
            headers: {
                "Authorization": `Bearer ${sessionClient.token}`
            }
        }).then((response) => {
            //console.log("lance realizado com sucesso... ", response.data)
            if (messageRef) {
                messageRef.current.style.transition = "1s"
                messageRef.current.style.marginTop = "10px"
                messageRef.current.innerHTML = "Parabéns! seu lance foi registrado"
                messageRef.current.style.color = "#105500"
            }
            setTimeout(() => {
                messageRef.current.style.marginTop = "-30px"
            }, 6000);
            if (setBidValue)
                setBidValue(response.data.value)
            setSuccessBid(!successBid)
            setIsloadingBid(false)
        })

    } catch (error) {
        setIsloadingBid &&
            setIsloadingBid(false)
        console.log(error.message)
    }

}

export { handleBidproduct }