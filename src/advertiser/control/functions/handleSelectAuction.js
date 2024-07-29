

const handleSelectAuction = (auction, setSelectedAuction, setCurrentProduct, setTimer) => {
    //console.log("Auction selected -> ", auction)
    setSelectedAuction(auction)
    setCurrentProduct({})
    setTimer(0)
}

export { handleSelectAuction }