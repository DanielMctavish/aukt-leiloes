import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Gavel } from "@mui/icons-material";
import { changeLote } from "../control-usecases/auctionControlUseCases";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ChangeLoteController() {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState([]);
    const [cookieSession, setCookieSession] = useState(null);
    const generalAUK = useSelector(state => state.generalAUK);

    useEffect(() => {
        const session = localStorage.getItem('advertiser-session-aukt');
        if (session) {
            setCookieSession(JSON.parse(session));
        }
    }, []);

    // Função para formatar moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    useEffect(() => {
        if (generalAUK.group) {
            const myProducts = generalAUK.auct.product_list
                .filter(product => product.group === generalAUK.group)
                .sort((a, b) => (a.lote || 0) - (b.lote || 0));
            setProductList(myProducts);
        }
    }, [generalAUK]);

    const handleProductSelect = async (product) => {
        setSelectedProduct(product);
        if (cookieSession && generalAUK.auct) {
            try {
                await changeLote(cookieSession, generalAUK.auct, product.lote);
            } catch (error) {
                console.error("Error changing lot:", error);
            }
        }
    };

    if (!productList.length) {
        return (
            <div className="flex w-full h-full bg-white/5 rounded-xl backdrop-blur-sm 
                justify-center items-center">
                <div className="flex flex-col items-center gap-3 text-white/70">
                    <Gavel sx={{ fontSize: 32 }} />
                    <p>Nenhum produto disponível neste grupo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white/5 rounded-xl backdrop-blur-sm overflow-hidden p-4 flex items-center">
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full max-h-[500px]"
                spaceBetween={20}
                slidesPerView={7}
                centeredSlides={true}
                slideToClickedSlide={true}
                initialSlide={0}
                breakpoints={{
                    320: { slidesPerView: 3 },
                    640: { slidesPerView: 5 },
                    1024: { slidesPerView: 7 }
                }}
            >
                {productList.map((product) => (
                    <SwiperSlide key={product.id}>
                        {() => (
                            <div 
                                className={`flex flex-col cursor-pointer transition-all duration-300 h-full
                                    ${selectedProduct?.id === product.id ? 
                                      'scale-110 z-20 shadow-xl shadow-black/30 h-[90%]' : 
                                      'scale-100 hover:scale-105'
                                    }`}
                                onClick={() => handleProductSelect(product)}
                            >
                                {/* Container da Imagem */}
                                <div className={`relative aspect-square rounded-lg overflow-hidden
                                    ${selectedProduct?.id === product.id ? 
                                      'ring-4 ring-green-500 ring-offset-2 ring-offset-[#012038]' : 
                                      'ring-1 ring-white/10'}`}>
                                    <img
                                        src={product.cover_img_url || 'placeholder-image-url'}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Badge do Lote */}
                                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full
                                        backdrop-blur-sm text-white text-xs font-medium
                                        ${selectedProduct?.id === product.id ? 
                                          'bg-green-500' : 
                                          'bg-black/50'}`}>
                                        Lote {product.lote}
                                    </div>

                                    {/* Indicador de Selecionado */}
                                    {selectedProduct?.id === product.id && (
                                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                                Selecionado
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Informações do Produto */}
                                <div className={`mt-2 text-white transition-all duration-300
                                    ${selectedProduct?.id === product.id ? 
                                      'text-green-400 font-medium' : 
                                      'text-white/90'}`}>
                                    <h3 className="text-sm font-medium line-clamp-1 text-center">
                                        {product.title}
                                    </h3>
                                    <p className={`text-xs mt-1 text-center
                                        ${selectedProduct?.id === product.id ? 
                                          'text-green-400' : 
                                          'text-white/70'}`}>
                                        {formatCurrency(product.initial_value)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ChangeLoteController;