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
  const [totalBids, setTotalBids] = useState(0);
  const dispatch = useDispatch();

  // Função para formatar moeda em Reais
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

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
    setProductCount(selectedAuction?.product_list?.length || 0);
    
    // Calcula total de lances
    const totalBids = selectedAuction?.product_list?.reduce((total, product) => {
      return total + (product.Bid?.length || 0);
    }, 0) || 0;
    setTotalBids(totalBids);
    
    dispatch(selectAuctionForGraph(selectedAuction));
  };

  if (loading) {
    return (
      <div className="w-full p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D1733]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-center items-center h-20 text-red-500">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1920px] mx-auto">
        {/* Seletor de Leilão */}
        <div className="bg-[#0D1733] rounded-xl shadow-lg overflow-hidden h-[120px]">
          <div className="px-4 py-3 border-b border-[#ffffff1a]">
            <span className="text-white/60 text-sm">Leilão Selecionado</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Gavel className="text-white/80" />
              <select
                onChange={handleSelection}
                value={selectedAuction || ''}
                className="w-full bg-transparent text-white border-0 focus:ring-0 outline-none"
              >
                <option value="" className="bg-[#0D1733]">
                  Selecione um leilão
                </option>
                {auctions.map((auction) => (
                  <option key={auction.id} value={auction.id} className="bg-[#0D1733]">
                    {auction.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card de Produtos */}
        <div className="bg-[#60B6D7] rounded-xl shadow-lg overflow-hidden h-[120px]">
          <div className="px-4 py-3 border-b border-[#ffffff1a]">
            <span className="text-white/60 text-sm">Total de Produtos</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Inventory className="text-white/80" />
              <span className="text-2xl font-semibold text-white">
                {productCount}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Total de Lances */}
        <div className="bg-[#60B6D7] rounded-xl shadow-lg overflow-hidden h-[120px]">
          <div className="px-4 py-3 border-b border-[#ffffff1a]">
            <span className="text-white/60 text-sm">Total de Lances</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <svg 
                className="w-6 h-6 text-white/80" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-2xl font-semibold text-white">
                {totalBids}
              </span>
            </div>
          </div>
        </div>

        {/* Card da Carteira */}
        <div className="bg-[#60B6D7] rounded-xl shadow-lg overflow-hidden h-[120px]">
          <div className="px-4 py-3 border-b border-[#ffffff1a]">
            <span className="text-white/60 text-sm">Saldo em Carteira</span>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <AccountBalanceWallet className="text-white/80" />
              <span className="text-2xl font-semibold text-white">
                {advertiserAmount !== null ? formatCurrency(advertiserAmount) : 'Carregando...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionSelection;