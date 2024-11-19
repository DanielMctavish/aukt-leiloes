

const handleSelectAuction = (auction, setSelectedAuction, setCurrentProduct, setTimer) => {
    setSelectedAuction(auction)
    setCurrentProduct({})
    setTimer(0)
}

export { handleSelectAuction }