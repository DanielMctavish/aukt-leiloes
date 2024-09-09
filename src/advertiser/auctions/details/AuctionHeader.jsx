/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { Timelapse } from "@mui/icons-material";
import dayjs from "dayjs";

const AuctionHeader = ({ currentAuct, editCurrentAuct, handleDeleteAuction, isDeleting }) => {

    // Função para calcular o valor estimado
    const getEstimatedValue = () => {
        return currentAuct.product_list.reduce((total, product) => {
            return total + product.initial_value;
        }, 0);
    };

    // Função para calcular o valor vendido
    const getSoldValue = () => {
        return currentAuct.product_list.reduce((total, product) => {
            if (product.winner_id) {
                return total + product.initial_value;
            }
            return total;
        }, 0);
    };

    // Função para formatar valores monetários
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <section className="w-[97%] h-[27vh] bg-white rounded-md mt-3 relative flex flex-col justify-center gap-6 items-center overflow-hidden">
            <img src={currentAuct.auct_cover_img} alt="auct-cover" className="object-cover cover-auct-image absolute opacity-20" />

            <h1 style={{ textShadow: "2px 2px 12px black" }} className="text-[18px] font-bold absolute left-1 top-1">{currentAuct.nano_id}</h1>
            <div className="absolute text-zinc-700 flex right-1 top-1 gap-2 z-[99]">
                <button onClick={editCurrentAuct} className="w-[100px] h-[30px] flex justify-center items-center bg-zinc-700 
                rounded-md text-white text-[12px]">
                    editar
                </button>

                {
                    !isDeleting ?
                        <button onClick={() => handleDeleteAuction(currentAuct.id)}
                            className="w-[100px] h-[30px] flex justify-center items-center bg-red-700 
                        rounded-md text-white text-[12px]">
                            excluir
                        </button> :
                        <span>deletando...</span>
                }

            </div>

            <div className="flex gap-2 z-[99] justify-start items-center">
                <img src={currentAuct.Advertiser ? currentAuct.Advertiser.url_profile_cover : ''} alt="" className="rounded-full bg-zinc-600 w-[80px] 
                h-[80px] object-cover" />
                <div className="flex flex-col text-zinc-900 font-bold gap-3">
                    <span className="text-[22px]">{currentAuct.title}</span>
                    <div>
                        Promotor(a):
                        <span style={{ textShadow: '2px 2px 6px #0000003d' }} className="text-[#315fa3]">
                            {currentAuct.Advertiser ? currentAuct.Advertiser.email : ''}
                        </span>
                    </div>
                    {currentAuct && <div className="flex gap-2">
                        {currentAuct.auct_dates ?
                            currentAuct.auct_dates.map((date, index) => (
                                <div key={index}
                                    className="text-zinc-700 font-bold 
                            flex justify-between items-center 
                            gap-3 bg-zinc-100 p-2 text-[12px] 
                            rounded-md shadow-md shadow-[#0e0e0e33]">
                                    <Timelapse style={{ fontSize: "12px" }} />
                                    {dayjs(date.date_auct, "YYYY-MM-DDTHH:mm:ssZ").format('DD/MM/YYYY - HH:mm')}
                                </div>
                            )) : ''
                        }
                    </div>}
                </div>
            </div>

            <div className="flex gap-3 z-[99]">
                <div className="flex flex-col justify-center items-center text-zinc-600
                w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                    <span className="text-[12px]">Status</span>
                    <span className="text-[18px]">{currentAuct.status}</span>
                </div>
                <div className="flex flex-col justify-center items-center text-zinc-600
                w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                    <span className="text-[12px]">Valor Estimado</span>
                    <span className="text-[18px] font-bold">{formatCurrency(getEstimatedValue())}</span>
                </div>
                <div className="flex flex-col justify-center items-center text-zinc-600
                w-[308px] h-[80px] bg-[#E9EFFA] rounded-md shadow-lg shadow-[#1313131e]">
                    <span className="text-[12px]">Valor Vendido</span>
                    <span className="text-[18px] font-bold">{formatCurrency(getSoldValue())}</span>
                </div>
            </div>
        </section>
    );
};

export default AuctionHeader;