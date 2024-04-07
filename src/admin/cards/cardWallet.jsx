import Wallet from "../dados/Wallet.json";
import MasterLogo from "../../media/logos/MasterCardlogo.svg";
import VisaLogo from "../../media/logos/visalogo.svg";

function getCardStyle(numero) {
  const isVisa = /^4/.test(numero);
  const isMastercard = /^5/.test(numero);

  if (isVisa) {
    return {
      imagem: VisaLogo, 
      cor1: "#B60000",
      cor2: "#EB0A0A",
    };
  } else if (isMastercard) {
    return {
      imagem: MasterLogo, 
      cor1: "#9C009F",
      cor2: "#3C0051",
    };
  } else {
    return {
      imagem: MasterLogo,
      cor1: "#545454",
      cor2: "#242424",
    };
  }
}

function cardWallet() {
  return (
    <div className="flex flex-col mt-4 justify-center items-center">
      {Wallet.map((auction, index) => {
        const cardStyle = getCardStyle(auction.numero);

        return (
          <div
            key={index}
            className="w-[70%] h-[20vh] flex-shrink-0 rounded-[12px] mt-2 bg-gradient-to-r text-[#F6F6F6]"
            style={{
              background: `linear-gradient(to right, ${cardStyle.cor1}, ${cardStyle.cor2})`,
            }}
          >
            <div className="flex justify-between p-6 text-[14px]">
              <span>{auction.data}</span>
              <span>{auction.codigo}</span>
            </div>
            <span className="flex pl-6">{auction.numero}</span>
            <img
              src={cardStyle.imagem}
              alt="Card Logo"
              className="float-right mt-6 mr-2"
            />
          </div>
        );
      })}
    </div>
  );
}

export default cardWallet;
