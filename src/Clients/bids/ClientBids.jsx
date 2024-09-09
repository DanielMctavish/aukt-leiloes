/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import { useNavigate } from "react-router-dom";
import { getBidsByClient } from "../functions/getBidsByClient";
import { useSpring, animated } from 'react-spring';

function ClientBids() {
    const [currentClient, setCurrentClient] = useState({});
    const [allBids, setAllBids] = useState([]);
    const [, setBidsWinners] = useState([]);
    const [, setBudget] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const bidsPerPage = 5; // Número de lances por página
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        getClientInformations(navigate, getBidsByClient, setCurrentClient, setAllBids, setBidsWinners, setBudget, currentClient);
    }, []);

    const AnimatedNumber = ({ number }) => {
        const { number: animatedNumber } = useSpring({
            from: { number: 0 },
            number: number,
            delay: 200,
            config: { mass: 1, tension: 180, friction: 12 }
        });

        return (
            <animated.span>
                {animatedNumber.to(n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
            </animated.span>
        );
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredBids.length / bidsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const filteredBids = allBids.filter(bid => bid.Product[0].title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Cálculo dos lances para a página atual
    const indexOfLastBid = currentPage * bidsPerPage;
    const indexOfFirstBid = indexOfLastBid - bidsPerPage;
    const currentBids = filteredBids.slice(indexOfFirstBid, indexOfLastBid);

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4] overflow-y-auto">
                <AssideClient MenuSelected="menu-3" />
                <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">
                    <NavClient currentClient={currentClient} />
                    <h1 className="w-full text-left text-[28px] p-3">Seus Lances</h1>
                    <input
                        type="text"
                        placeholder="Pesquisar pelo título do produto..."
                        className="p-2 border border-gray-300 rounded-md w-full mb-4 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Resetar para a primeira página ao pesquisar
                        }}
                    />
                    <div className="flex flex-col w-full justify-around items-center gap-2 text-[#333] p-3">
                        <div className="w-full grid grid-cols-5 gap-3 p-2 bg-gray-100 border-b-2 border-gray-300">
                            <span className="font-bold">Imagem</span>
                            <span className="font-bold">Título</span>
                            <span className="font-bold">Data</span>
                            <span className="font-bold">categoria</span>
                            <span className="font-bold">Seu lance</span>
                        </div>
                        {
                            currentBids.map((bid, index) => (
                                <div className="w-full grid grid-cols-5 gap-3 p-2 bg-white border-b justify-center items-center border-gray-200 
                                hover:bg-zinc-300 cursor-pointer rounded-md transition duration-300 relative"
                                    onClick={() => navigate(`/advertiser/home/product/${bid.Product[0].id}`)}
                                    key={index}>
                                    {
                                        bid.Product[0].winner_id &&
                                        <span className="absolute bg-red-600 right-1 top-2 p-2 text-white rounded-md">arrematado!</span>
                                    }
                                    <img src={bid.Product[0].cover_img_url} alt=""
                                        className="w-[60px] h-[60px] object-cover justify-center items-center rounded-full" />
                                    <span className="w-[160px] text-[12px]">{bid.Product[0].title}</span>
                                    <span>{dayjs(bid.Product[0].updated_at).format('DD/MM/YYYY')}</span>
                                    <span>{bid.Product[0].categorie}</span>
                                    <span className="font-bold">
                                        R$ <AnimatedNumber number={bid.value} />
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-between items-center w-full p-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {Math.ceil(filteredBids.length / bidsPerPage)}</span>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-300"
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(filteredBids.length / bidsPerPage)}
                        >
                            Próxima
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ClientBids;
