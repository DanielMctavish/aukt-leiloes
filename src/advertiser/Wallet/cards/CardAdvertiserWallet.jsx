import { useState } from 'react';
import Wallet from "../../data/Wallet.json";
import MasterLogo from "../../../media/logos/MasterCardlogo.svg";
import VisaLogo from "../../../media/logos/visalogo.svg";
import { Add, ContentCopy } from "@mui/icons-material";

function getCardStyle(numero) {
  const isVisa = /^4/.test(numero);
  const isMastercard = /^5/.test(numero);

  if (isVisa) {
    return {
      imagem: VisaLogo,
      gradiente: "from-[#1A1F71] to-[#0E1D8B]",
      logo: "text-white"
    };
  } else if (isMastercard) {
    return {
      imagem: MasterLogo,
      gradiente: "from-[#EB001B] to-[#C79000]",
      logo: "text-white"
    };
  }
  return {
    imagem: MasterLogo,
    gradiente: "from-gray-800 to-gray-900",
    logo: "text-white"
  };
}

function CardAdvertiserWallet() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyNumber = (numero) => {
    navigator.clipboard.writeText(numero);
    setCopiedId(numero);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCardNumber = (numero) => {
    return numero.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="space-y-4">
      {Wallet.map((card, index) => {
        const cardStyle = getCardStyle(card.numero);

        return (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-xl bg-gradient-to-r ${cardStyle.gradiente} 
              shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
          >
            {/* Conteúdo do Cartão */}
            <div className="p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-xs opacity-80">Válido até</p>
                  <p className="font-medium">{card.data}</p>
                </div>
                <img
                  src={cardStyle.imagem}
                  alt="Card Logo"
                  className="h-8 object-contain"
                />
              </div>

              {/* Número do Cartão */}
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-lg tracking-wider">
                  {formatCardNumber(card.numero)}
                </p>
                <button 
                  onClick={() => handleCopyNumber(card.numero)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ContentCopy className="text-white/80 text-sm" />
                </button>
              </div>

              {/* Feedback de Cópia */}
              {copiedId === card.numero && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Copiado!
                </div>
              )}

              {/* Código de Segurança */}
              <div className="text-xs opacity-80">
                <span>Código de Segurança: •••</span>
              </div>
            </div>

            {/* Efeito de Brilho */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
              pointer-events-none transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                transform -skew-x-12"></div>
            </div>
          </div>
        );
      })}

      {/* Botão Adicionar Cartão */}
      <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl 
        text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center 
        justify-center gap-2"
      >
        <Add />
        <span>Adicionar novo cartão</span>
      </button>
    </div>
  );
}

export default CardAdvertiserWallet;
