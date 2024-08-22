/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import HomeAdvFooter from "./HomeAdvFooter";
import { ViewModule, ViewHeadline } from "@mui/icons-material";
import { loadPage } from "./functions/loadPage";
import PaginationComponent from "./components/Pagination";

function HomeAdvShop() {
    const [currentAuct, setCurrentAuction] = useState({});
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [pagesCount, setPagesCount] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();
    const { auct_id } = useParams();
    const shopWindowShop = useRef();

    useEffect(() => {
        getAuctionById();
    }, [auct_id]);

    const getAuctionById = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/find-auct`, {
                params: { auct_id }
            });
            setCurrentAuction(response.data);
            calculatePages(response.data.product_list.length);
        } catch (error) {
            console.log("error at get auction by id: ", error.message);
        }
    };

    const calculatePages = (totalProducts) => {
        const totalPages = Math.ceil(totalProducts / 12);
        const pagesArray = Array.from({ length: totalPages }, (_, i) => i);
        loadPage(0, auct_id, setProductsFiltered, setCurrentPage);
        setPagesCount(pagesArray);
    };


    return (
        <div ref={shopWindowShop} className="flex flex-col w-full h-[200vh] bg-[#0D1733] justify-start items-center">
            {/* Header */}
            <div className="flex w-full min-h-[40vh] overflow-hidden bg-white relative">
                <img src={currentAuct.auct_cover_img || ""} alt="" className="object-cover absolute w-full h-full" />
            </div>

            {/* Body Main */}
            <div className="flex flex-col w-[70%] h-auto bg-[#DEDEDE] mb-[3vh] mt-[3vh]">
                <div className="w-full h-[430px] bg-gradient-to-b from-[#c4c4c4] to-[#f4f4f4] shadow-inner shadow-[#1c1c1c22]">
                    <div className="w-full h-[130px] bg-white shadow-2xl shadow-[#0909093f] p-[4vh]">
                        <h1 className="text-[32px] w-fit font-bold border-b-[1px] border-[#202020] pb-[4px]">
                            {currentAuct.title}
                        </h1>
                        <div className="flex gap-2">
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[0].date_auct).format('DD')}</span>
                            <span>-</span>
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct).format('DD')}</span>
                            <span>de</span>
                            <span>{currentAuct.auct_dates && dayjs(currentAuct.auct_dates[0].date_auct).format('MMMM')}</span>
                            <span className="font-bold">
                                {currentAuct.auct_dates && dayjs(currentAuct.auct_dates[currentAuct.auct_dates.length - 1].date_auct).format('YYYY')}
                            </span>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-col w-full h-[210px] p-[3vh] relative gap-3">
                        <input type="text" placeholder="pesquisar"
                            className="w-[70%] h-[47px] bg-white border-[1px] 
                        border-[#bebebe] rounded-[3px] p-2"/>

                        <div className="flex gap-3 w-[70%]">
                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2 flex-1">
                                <option value="">todos os lotes</option>
                            </select>

                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2">
                                <option value="">categorias</option>
                            </select>

                            <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                            border-[#bebebe] rounded-[4px] p-2">
                                <option value="">grupos</option>
                                {currentAuct.auct_dates && currentAuct.auct_dates.map((date, i) => (
                                    <option key={i} value={date.id}>{date.group}</option>
                                ))}
                            </select>

                            <div className="flex justify-center items-center gap-3">
                                <span>ordenar: </span>
                                <select name="" id="" className="w-[160px] h-[47px] bg-white border-[1px] 
                                    border-[#bebebe] rounded-[4px] p-2">
                                    <option value="">Lances</option>
                                    <option value="">Lotes</option>
                                    <option value="">Valor</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <span className="font-bold ml-[3vh]">
                        {currentAuct.product_list && currentAuct.product_list.length} produtos encontrados
                    </span>
                </div>

                {/* Produtos */}
                <div className="flex flex-wrap w-full max-h-[90vh] bg-white gap-3 p-2 justify-center overflow-y-auto transition-all duration-[1s]">
                    {/* Paginação */}
                    <div className="flex w-full h-[100px] justify-center items-center bg-zinc-200 relative">

                        <PaginationComponent
                            pages_count={pagesCount}
                            current_page={currentPage}
                            auct_id={auct_id}
                            setproductsfiltered={setProductsFiltered}
                            setcurrentpage={setCurrentPage} />

                        <div className="flex absolute right-2 gap-3">
                            <ViewModule sx={{ color: "#012038", fontSize: "33px" }} className="cursor-pointer" />
                            <ViewHeadline sx={{ color: "#012038", fontSize: "33px" }} className="cursor-pointer" />
                        </div>

                    </div>

                    {productsFiltered.map(product => (
                        <div
                            key={product.id}
                            className="flex w-[220px] h-[288px] bg-[#ffffff] shadow-lg shadow-[#0c0c0c0c] 
                            relative overflow-hidden cursor-pointer hover:border-[1px] flex-col gap-2"
                            onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                        >
                            <img src={product.cover_img_url} alt=""
                                className="h-[200px] w-full object-cover" />

                            <span className="text-[10px] font-bold">{product.title}</span>
                            <span className="text-[14px]">
                                Lote {product.lote} |
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                    .format(product.initial_value)} -
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                    .format(product.reserve_value)}
                            </span>

                        </div>
                    ))}


                </div>

                <div className="flex w-full h-[70px] justify-center items-center  relative bg-white">
                    <PaginationComponent
                        pages_count={pagesCount}
                        current_page={currentPage}
                        auct_id={auct_id}
                        setproductsfiltered={setProductsFiltered}
                        setcurrentpage={setCurrentPage} />
                </div>

            </div>

            {/* Footer */}
            <HomeAdvFooter />
        </div>
    );
}

export default HomeAdvShop;
