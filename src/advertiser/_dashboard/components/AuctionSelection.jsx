import { useState, useEffect } from 'react';
import { Gavel, Inventory, AccountBalanceWallet } from "@mui/icons-material";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { selectAuctionForGraph } from '../../../features/auct/SelectedToGraph';

const AuctionSelection = () => {
  const [auctions, setAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [advertiserAmount, setAdvertiserAmount] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCreatorIdAndAuctions = async () => {
      try {
        const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
        if (!currentLocalAdvertiser) {
          throw new Error('Advertiser not logged in');
        }

        // Fetch creator_id and amount
        const advertiserResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email`, {
          params: { email: currentLocalAdvertiser.email },
          headers: {
            'Authorization': `Bearer ${currentLocalAdvertiser.token}`
          }
        });
        const advertiser = advertiserResponse.data;
        const creatorId = advertiser.id;
        setAdvertiserAmount(advertiser.amount);

        // Fetch auctions
        const auctionsResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct`, {
          params: { creator_id: creatorId },
          headers: {
            'Authorization': `Bearer ${currentLocalAdvertiser.token}`
          }
        });
        setAuctions(auctionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar leilões ou ID do criador:', error);
        setError('Erro ao buscar leilões. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchCreatorIdAndAuctions();
  }, []);

  const handleSelection = (event) => {
    const selectedAuctionId = event.target.value;
    setSelectedAuction(selectedAuctionId);
    const selectedAuction = auctions.find(auction => auction.id === selectedAuctionId);
    setProductCount(selectedAuction.product_list.length);
    dispatch(selectAuctionForGraph(selectedAuction));
  };

  if (loading) {
    return <div className="flex justify-center items-center w-full h-full">Carregando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center w-full h-full text-red-500">{error}</div>;
  }

  return (
    <div className="flex w-full p-4 bg-white shadow-md rounded-md justify-start items-center gap-6">

      <div className="flex justify-start items-center relative w-[260px] bg-[#0D1733] p-2 rounded-lg">
        <div className="inset-y-0 left-0 flex items-center">
          <Gavel className="text-white" />
        </div>
        <select
          onChange={handleSelection}
          value={selectedAuction}
          className="p-2 w-full h-[70px] text-white rounded-md bg-transparent"
        >
          <option value="">
            Selecione um leilão
          </option>
          {auctions.map((auction) => (
            <option key={auction.id} value={auction.id}>
              {auction.title}
            </option>
          ))}
        </select>
      </div>
     
      <div className="flex justify-start items-center relative w-[260px] h-[80px] bg-[#60B6D7] p-2 rounded-lg text-white">
        <Inventory className="mr-2" />
        Produtos: {productCount}
      </div>

      <div className="flex justify-start items-center relative w-[260px] h-[80px] bg-[#60B6D7] p-2 rounded-lg text-white">
        <AccountBalanceWallet className="mr-2" />
        Carteira: R$ {advertiserAmount !== null ? advertiserAmount.toFixed(2) : 'Carregando...'}
      </div>
      
    </div>
  );
};

export default AuctionSelection;