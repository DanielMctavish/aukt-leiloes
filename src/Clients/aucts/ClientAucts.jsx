/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AssideClient from "../Asside/AssideClient";
import NavClient from "../navigation/NavClient";
import { getClientInformations } from "../functions/getClientInformations";
import { getAuctsByBids } from "../functions/getAuctsByBids";
import { getBidsByClient } from "../functions/getBidsByClient";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function ClientAucts() {
    const [currentClient, setCurrentClient] = useState({});
    const [allBids, setAllBids] = useState([]);
    const [allAucts, setAllAucts] = useState([]);
    const [filteredAucts, setFilteredAucts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bidsPerPage = 5;

    const [, setBidsWinners] = useState([]);
    const [, setBudget] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getClientInformations(navigate, getBidsByClient, setCurrentClient, setAllBids, setBidsWinners, setBudget, currentClient);
    }, []);

    useEffect(() => {
        getAuctsByBids(allBids, setAllAucts);
    }, [allBids]);

    useEffect(() => {
        setFilteredAucts(allAucts.filter(auct => auct.title.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, allAucts]);

    const handleChangeSearchTerm = (event) => {
        setSearchTerm(event.target.value);
    };

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    const indexOfLastBid = currentPage * bidsPerPage;
    const indexOfFirstBid = indexOfLastBid - bidsPerPage;
    const currentBids = filteredAucts.slice(indexOfFirstBid, indexOfLastBid);
    const totalPages = Math.ceil(filteredAucts.length / bidsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
            <div className="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
                <AssideClient MenuSelected="menu-4" />
                <section className="w-full h-[100vh] flex flex-col justify-start items-center overflow-y-auto gap-2 text-zinc-600">
                    <NavClient currentClient={currentClient} />
                    <input
                        type="text"
                        placeholder="Pesquisar pelo título"
                        value={searchTerm}
                        onChange={handleChangeSearchTerm}
                        className="w-full p-2 mb-2 border rounded-md bg-transparent"
                    />
                    <div className="flex flex-col w-full h-[92vh] bg-[#ffffff] overflow-y-auto p-2 gap-1">
                        <div className="grid grid-cols-5 gap-3 p-2 bg-gray-100 border-b-2 border-gray-300">
                            <span className="font-bold">Capa</span>
                            <span className="font-bold">ID</span>
                            <span className="font-bold">Título</span>
                            <span className="font-bold">Status</span>
                            <span className="font-bold">Produtos Qtd</span>
                        </div>
                        {
                            currentBids.map((auct, i) => (
                                <div key={i} className="grid grid-cols-5 gap-3 p-2 bg-white border-b 
                                justify-center items-center border-gray-200 hover:bg-zinc-300 cursor-pointer rounded-md transition duration-300">
                                    <div className="flex flex-col justify-center items-start gap-1">
                                        <img src={auct.auct_cover_img} alt="" className="w-[54px] h-[54px] object-cover" />
                                        <span>{dayjs(auct.created_at).format('DD/MM/YYYY')}</span>
                                    </div>
                                    <span className="font-bold">{auct.nano_id}</span>
                                    <span>{auct.title}</span>
                                    <span>{auct.status}</span>
                                    <span>{auct.product_list.length}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex w-full justify-between items-center gap-2 mt-4 p-3">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-[#b9b9b9]'}`}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-[#b9b9b9]'}`}
                        >
                            Próxima
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ClientAucts;
