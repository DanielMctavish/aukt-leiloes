import React, { useState } from 'react';
import Logo from "../../media/logos/MasterCardlogo.svg";

function Transactions() {
   
  const Transaction = [
    {
      imagem: Logo,
      nome: "Banco BMG",
      conta: "conta corrente | 81772389928",
      valor: "+ R$ 12.240,92",
    },
    {
      imagem: Logo,
      nome: "Banco BMG",
      conta: "conta corrente | 81772389928",
      valor: "+ R$ 12.240,92",
    },
    {
      imagem: Logo,
      nome: "Banco BMG",
      conta: "conta corrente | 81772389928",
      valor: "+ R$ 12.240,92",
    },
    {
      imagem: Logo,
      nome: "Banco BMG",
      conta: "conta corrente | 81772389928",
      valor: "+ R$ 12.240,92",
    },
    {
      imagem: Logo,
      nome: "Banco BMG",
      conta: "conta corrente | 81772389928",
      valor: "+ R$ 12.240,92",
    },
    {
        imagem: Logo,
        nome: "Banco BMG",
        conta: "conta corrente | 81772389928",
        valor: "+ R$ 12.240,92",
      },
      {
        imagem: Logo,
        nome: "Banco BMG",
        conta: "conta corrente | 81772389928",
        valor: "+ R$ 12.240,92",
      },
      {
        imagem: Logo,
        nome: "Banco BMG",
        conta: "conta corrente | 81772389928",
        valor: "+ R$ 12.240,92",
      },
      {
        imagem: Logo,
        nome: "Banco BMG",
        conta: "conta corrente | 81772389928",
        valor: "+ R$ 12.240,92",
      },
      {
        imagem: Logo,
        nome: "Banco BMG",
        conta: "conta corrente | 81772389928",
        valor: "+ R$ 12.240,92",
      },
      
    
  ];


  const [visibleTransactions, setVisibleTransactions] = useState(5);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const showMoreTransactions = () => {
    const newVisibleTransactions = visibleTransactions + 5;
    setVisibleTransactions(newVisibleTransactions);

    if (newVisibleTransactions >= Transaction.length) {
      setShowScrollbar(true);
    }
  };

  const containerStyle = {
    maxHeight: '490px',
    overflowY: showScrollbar ? 'auto ' : 'hidden',
  };

  return (
    <div className="transactions-container custom-scrollbar" style={containerStyle}>
      {Transaction.slice(0, visibleTransactions).map((auction, index) => (
        <div key={index} className="flex flex-col p-4 mt-2 text-[#747474]">
          <div className="flex justify-between items-center text-[16px]">
            <div className="flex gap-8">
              <img src={auction.imagem} alt="Logo" />
              <span>{auction.nome}</span>
            </div>
            <span className="text-[16px]">{auction.valor}</span>
          </div>
          <div className="text-[#AAAAAA] text-[12px] mt-2">
            <span className="">{auction.conta}</span>
          </div>
        </div>
      ))}
      {visibleTransactions < Transaction.length && (
        <div className="flex justify-center items-center">
          <button className="text-[14px] text-[#747474]" onClick={showMoreTransactions}>
            Ver tudo
          </button>
        </div>
      )}
    </div>
  );
}


export default Transactions;
