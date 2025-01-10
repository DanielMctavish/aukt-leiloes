import { useNavigate } from 'react-router-dom';
import { Store, Person } from '@mui/icons-material';
import logoAuk from '../media/logos/logos-auk/aukt_blue.png';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SelectLoginType() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        listProducts();
    }, []);

    const listProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });

            // Extrair todos os produtos dos leilões
            const allProducts = response.data.reduce((acc, auction) => {
                return acc.concat(auction.product_list.map(product => ({
                    ...product,
                    auction_title: auction.title
                })));
            }, []);

            // Embaralhar e pegar 8 produtos aleatórios
            const shuffledProducts = allProducts
                .filter(product => product.cover_img_url !== "string") // Filtrar produtos sem imagem
                .sort(() => 0.3 - Math.random())
                .slice(0, 12);

            setProducts(shuffledProducts);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProducts([]);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Lado Cliente - Verde */}
            <div className="w-1/2 bg-gradient-to-br from-[#1dad24] to-[#168d1d] p-8 
                hover:w-[55%] transition-all duration-500 ease-in-out cursor-pointer
                flex flex-col items-center justify-center relative group overflow-hidden"
                onClick={() => navigate('/client/login')}
            >
                {/* Bolinhas flutuantes com produtos reais */}
                {products.map((product, index) => {
                    const size = Math.random() * 200 + 30;
                    
                    return (
                        <div
                            key={product.id}
                            className="absolute rounded-full shadow-lg overflow-hidden
                                animate-float  transition-opacity opacity-70
                                pointer-events-none backdrop-blur-sm"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                left: `${Math.random() * 95}%`,
                                top: `${Math.random() * 95}%`,
                                animationDelay: `${index * 0.7}s`,
                                animationDuration: `${Math.random() * 2 + 12}s`,
                                position: 'absolute',
                                zIndex: 1,
                                transform: `scale(${Math.random() * 0.5 + 0.8})`
                            }}
                        >
                            <img
                                src={product.cover_img_url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    );
                })}

                {/* Conteúdo existente */}
                <div className="absolute top-8 left-8 z-10">
                    <img 
                        src={logoAuk} 
                        alt="AUK Leilões" 
                        className="h-8 brightness-0 invert cursor-pointer hover:scale-105 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/');
                        }}
                    />
                </div>

                <div className="text-center transform group-hover:scale-110 
                transition-all duration-500 z-10 backdrop-blur-[3px]">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center
                        mb-6 mx-auto backdrop-blur-sm">
                        <Person className="text-white text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Cliente</h2>
                    <p className="text-white/80 text-lg max-w-md">
                        Participe de leilões e dê seus lances
                    </p>
                </div>

                <div className="absolute bottom-8 left-8 text-white/60 text-sm z-10">
                    Entrar como cliente →
                </div>
            </div>

            {/* Lado Anunciante - Azul */}
            <div className="w-1/2 bg-gradient-to-bl from-[#012038] to-[#01284a] p-8
                hover:w-[55%] transition-all duration-500 ease-in-out cursor-pointer
                flex flex-col items-center justify-center relative group"
                onClick={() => navigate('/advertiser/login')}
            >
                <div className="absolute top-8 right-8">
                    <img 
                        src={logoAuk} 
                        alt="AUK Leilões" 
                        className="h-8 cursor-pointer hover:scale-105 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/');
                        }}
                    />
                </div>

                <div className="text-center transform group-hover:scale-110 transition-all duration-500">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center
                        mb-6 mx-auto backdrop-blur-sm">
                        <Store className="text-white text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Anunciante</h2>
                    <p className="text-white/80 text-lg max-w-md">
                        Crie e gerencie seus leilões
                    </p>
                </div>

                <div className="absolute bottom-8 right-8 text-white/60 text-sm">
                    Entrar como anunciante →
                </div>
            </div>
        </div>
    );
}

// Adicione estes estilos no seu arquivo CSS ou como uma tag style
const styles = `
@keyframes float {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
    20% {
        transform: translate(${Math.random() * 100}px, ${Math.random() * -100}px) rotate(5deg) scale(1.05);
    }
    40% {
        transform: translate(${Math.random() * -100}px, ${Math.random() * 100}px) rotate(-5deg) scale(0.95);
    }
    60% {
        transform: translate(${Math.random() * 100}px, ${Math.random() * 100}px) rotate(3deg) scale(1.02);
    }
    80% {
        transform: translate(${Math.random() * -100}px, ${Math.random() * -100}px) rotate(-3deg) scale(0.98);
    }
    100% {
        transform: translate(0, 0) rotate(0deg) scale(1);
    }
}

.animate-float {
    animation: float var(--duration, 20s) cubic-bezier(0.4, 0, 0.2, 1) infinite;
    animation-delay: var(--delay, 0s);
}
`;

// Adicione os estilos ao head do documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SelectLoginType; 