/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from 'react-router-dom';
import { Store, Person, ArrowForward } from '@mui/icons-material';
import logoAuk from '../media/logos/logos-auk/aukt_blue.png';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function SelectLoginType() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [activeType, setActiveType] = useState('client'); // 'client' ou 'advertiser'
    
    // Refs para gerenciar o swipe
    const switchRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        listProducts();
        
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleImageLoad = (productId) => {
        setLoadedImages(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    const listProducts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
                params: {
                    status: "cataloged",
                }
            });

            const allProducts = response.data.reduce((acc, auction) => {
                return acc.concat(auction.product_list.map(product => ({
                    ...product,
                    auction_title: auction.title
                })));
            }, []);

            const productLimit = isMobile ? 6 : 12;

            const shuffledProducts = allProducts
                .filter(product => product.cover_img_url !== "string")
                .sort(() => 0.3 - Math.random())
                .slice(0, productLimit);

            setProducts(shuffledProducts);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProducts([]);
        }
    };

    // Função para navegar para a página de login baseada no tipo selecionado
    const handleLogin = () => {
        navigate(activeType === 'client' ? '/client/login' : '/advertiser/login');
    };

    // Funções para gerenciar o swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
        
        // Calcula a distância do movimento
        const distance = touchEndX.current - touchStartX.current;
        const switchWidth = switchRef.current?.offsetWidth || 0;
        
        // Limita o movimento dentro do switch
        if (Math.abs(distance) < switchWidth / 2) {
            // Aplica um efeito de "seguir o dedo" durante o swipe
            const thumbPosition = activeType === 'client' ? 2 : switchWidth / 2 + 2;
            let newPosition;
            
            if (activeType === 'client') {
                // Se estiver no modo cliente, só permite mover para a direita
                newPosition = Math.min(thumbPosition + distance, switchWidth / 2 + 2);
                newPosition = Math.max(2, newPosition);
            } else {
                // Se estiver no modo anunciante, só permite mover para a esquerda
                newPosition = Math.max(thumbPosition + distance, 2);
                newPosition = Math.min(switchWidth / 2 + 2, newPosition);
            }
            
            // Atualiza a posição visual do thumb durante o arrasto
            if (switchRef.current) {
                const thumb = switchRef.current.querySelector('.switch-thumb');
                if (thumb) {
                    thumb.style.left = `${newPosition}px`;
                    // Ajusta a transição para que seja instantânea durante o arrasto
                    thumb.style.transition = 'none';
                }
            }
        }
    };

    const handleTouchEnd = () => {
        // Restaura a transição suave
        if (switchRef.current) {
            const thumb = switchRef.current.querySelector('.switch-thumb');
            if (thumb) {
                thumb.style.transition = 'left 0.3s ease';
                
                // Força o thumb a voltar à posição correta
                thumb.style.left = activeType === 'client' ? '2px' : 'calc(50% + 2px)';
            }
        }
        
        const distance = touchEndX.current - touchStartX.current;
        
        // Se o swipe for significativo (mais de 50px), muda o estado
        if (Math.abs(distance) > 50) {
            // Swipe da esquerda para direita: ativa o anunciante
            if (distance > 0 && activeType === 'client') {
                setActiveType('advertiser');
            }
            // Swipe da direita para esquerda: ativa o cliente
            else if (distance < 0 && activeType === 'advertiser') {
                setActiveType('client');
            }
        }
    };

    // Layout para desktop
    if (!isMobile) {
        return (
            <div className="fixed inset-0 w-screen h-screen flex overflow-hidden z-[1]">
                {/* Lado Cliente - Verde */}
                <div 
                    className="relative w-1/2 bg-gradient-to-br from-[#1dad24] to-[#168d1d] p-8 
                        hover:w-[55%] transition-all duration-500 ease-in-out cursor-pointer
                        flex flex-col items-center justify-center group"
                    onClick={() => navigate('/client/login')}
                >
                    {/* Bolinhas flutuantes com produtos reais */}
                    <div className="absolute inset-0 overflow-hidden">
                        {products.map((product, index) => {
                            const size = Math.random() * 200 + 30;
                            
                            return (
                                <div
                                    key={product.id}
                                    className={`absolute rounded-full shadow-lg overflow-hidden
                                        animate-float transition-opacity
                                        pointer-events-none backdrop-blur-sm
                                        ${loadedImages[product.id] ? 'opacity-70' : 'opacity-0'}`}
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        left: `${Math.random() * 95}%`,
                                        top: `${Math.random() * 95}%`,
                                        animationDelay: `${index * 0.7}s`,
                                        animationDuration: `${Math.random() * 2 + 12}s`,
                                        zIndex: 1,
                                        transform: `scale(${Math.random() * 0.5 + 0.8})`,
                                        backgroundColor: '#1dad24'
                                    }}
                                >
                                    <img
                                        src={product.cover_img_url}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                        onLoad={() => handleImageLoad(product.id)}
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Conteúdo */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        <div className="absolute top-8 left-8">
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
                            transition-all duration-500">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center
                                mb-6 mx-auto backdrop-blur-sm">
                                <Person className="text-white text-4xl" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">Cliente</h2>
                            <p className="text-white/80 text-lg max-w-md">
                                Participe de leilões e dê seus lances
                            </p>
                        </div>

                        <div className="absolute bottom-[10vh] left-8 text-white/60 text-sm">
                            Entrar como cliente →
                        </div>
                    </div>
                </div>

                {/* Lado Anunciante - Azul */}
                <div 
                    className="relative w-1/2 bg-gradient-to-bl from-[#012038] to-[#01284a] p-8
                        hover:w-[55%] transition-all duration-500 ease-in-out cursor-pointer
                        flex flex-col items-center justify-center group"
                    onClick={() => navigate('/advertiser/login')}
                >
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
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
            </div>
        );
    }

    // Layout Mobile com Switch
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden z-[1]">
            {/* Fundo dinâmico baseado no tipo ativo */}
            <div 
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    activeType === 'client' 
                        ? 'bg-gradient-to-b from-[#1dad24] to-[#168d1d]' 
                        : 'bg-gradient-to-b from-[#012038] to-[#01284a]'
                }`}
            >
                {/* Bolinhas flutuantes com produtos reais */}
                <div className="absolute inset-0 overflow-hidden opacity-50">
                    {products.map((product, index) => {
                        const size = Math.random() * 80 + 30;
                        
                        return (
                            <div
                                key={product.id}
                                className={`absolute rounded-full shadow-lg overflow-hidden
                                    animate-float transition-opacity pointer-events-none backdrop-blur-sm
                                    ${loadedImages[product.id] ? 'opacity-70' : 'opacity-0'}`}
                                style={{
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    left: `${Math.random() * 95}%`,
                                    top: `${Math.random() * 95}%`,
                                    animationDelay: `${index * 0.7}s`,
                                    animationDuration: `${Math.random() * 2 + 12}s`,
                                    zIndex: 1,
                                    transform: `scale(${Math.random() * 0.5 + 0.8})`,
                                    backgroundColor: activeType === 'client' ? '#1dad24' : '#012038'
                                }}
                            >
                                <img
                                    src={product.cover_img_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    onLoad={() => handleImageLoad(product.id)}
                                    loading="lazy"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                {/* Logo */}
                <div className="w-full flex justify-center items-center pt-4 mb-6">
                    <img 
                        src={logoAuk} 
                        alt="AUK Leilões" 
                        className={`h-12 ${activeType === 'client' ? 'brightness-0 invert' : ''} cursor-pointer hover:scale-105 transition-all`}
                        onClick={() => navigate('/')}
                    />
                </div>

                {/* Área principal com conteúdo */}
                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md max-h-[40vh]">
                    {/* Switch Estilo Apple - Agora com suporte a swipe */}
                    <div 
                        className="relative mb-12 w-full max-w-xs"
                        ref={switchRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div 
                            className="h-14 rounded-full p-1 flex items-center transition-all duration-300 shadow-lg relative"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.15)'
                            }}
                        >
                            {/* Background do switch - Agora com classe para facilitar a manipulação */}
                            <div 
                                className="switch-thumb absolute h-12 rounded-full transition-all duration-300 shadow-inner bg-white"
                                style={{
                                    width: 'calc(50% - 4px)',
                                    left: activeType === 'client' ? '2px' : 'calc(50% + 2px)',
                                }}
                            ></div>
                            
                            {/* Dica visual de swipe */}
                            <div className="absolute w-full flex justify-center -bottom-6 text-white/40 text-xs">
                                <span>← Arraste para alternar →</span>
                            </div>
                            
                            {/* Opção Cliente */}
                            <button 
                                className={`z-10 flex-1 h-full flex items-center justify-center gap-2 text-[14px] rounded-full transition-all duration-300 ${
                                    activeType === 'client'
                                        ? 'text-[#1dad24] font-medium'
                                        : 'text-white/80'
                                }`}
                                onClick={() => setActiveType('client')}
                            >
                                <Person fontSize="small" />
                                <span>Cliente</span>
                            </button>
                            
                            {/* Opção Anunciante */}
                            <button 
                                className={`z-10 flex-1 h-full flex items-center justify-center gap-2 rounded-full transition-all duration-300 ${
                                    activeType === 'advertiser'
                                        ? 'text-[#012038] font-medium'
                                        : 'text-white/80'
                                }`}
                                onClick={() => setActiveType('advertiser')}
                            >
                                <Store fontSize="small" />
                                <span>Anunciante</span>
                            </button>
                        </div>
                    </div>

                    {/* Conteúdo baseado no tipo ativo */}
                    <div className="text-center transform transition-all duration-300 text-[14px]">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center
                            mb-6 mx-auto backdrop-blur-sm transition-all ${
                                activeType === 'client' 
                                    ? 'bg-white/10' 
                                    : 'bg-white/10'
                            }`}>
                            {activeType === 'client' 
                                ? <Person className="text-white text-4xl" />
                                : <Store className="text-white text-4xl" />
                            }
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">
                            {activeType === 'client' ? 'Cliente' : 'Anunciante'}
                        </h2>
                        <p className="text-white/80 text-lg max-w-md px-6">
                            {activeType === 'client' 
                                ? 'Participe de leilões e dê seus lances' 
                                : 'Crie e gerencie seus leilões'
                            }
                        </p>
                    </div>
                </div>

                {/* Botão de Login */}
                <button 
                    onClick={handleLogin}
                    className={`w-full max-w-xs h-14 rounded-xl flex items-center justify-center gap-2 text-lg font-medium 
                        shadow-lg mt-8 mb-6 transition-all ${
                            activeType === 'client'
                                ? 'bg-white text-[#1dad24]'
                                : 'bg-white text-[#012038]'
                        }`}
                >
                    <span>Entrar como {activeType === 'client' ? 'cliente' : 'anunciante'}</span>
                    <ArrowForward fontSize="small" />
                </button>
            </div>
        </div>
    );
}

// Estilos de animação
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

/* Animações otimizadas para mobile */
@media (max-width: 768px) {
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
        }
        20% {
            transform: translate(${Math.random() * 40}px, ${Math.random() * -40}px) rotate(3deg) scale(1.03);
        }
        40% {
            transform: translate(${Math.random() * -40}px, ${Math.random() * 40}px) rotate(-3deg) scale(0.97);
        }
        60% {
            transform: translate(${Math.random() * 40}px, ${Math.random() * 40}px) rotate(2deg) scale(1.01);
        }
        80% {
            transform: translate(${Math.random() * -40}px, ${Math.random() * -40}px) rotate(-2deg) scale(0.99);
        }
        100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
        }
    }
}
`;

// Adicione os estilos ao head do documento
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default SelectLoginType; 