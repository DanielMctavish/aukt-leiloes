/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';

function RenderHeaderAdvertiser({ header, fontStyle }) {
    const headerRef = useRef(null);
    const [carouselProducts, setCarouselProducts] = useState([]);

    useEffect(() => {
        if (header?.carousel?.selectedAuctId) {
            fetchCarouselProducts();
        }
    }, [header?.carousel?.selectedAuctId]);

    const fetchCarouselProducts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/list-by-filters`,
                {
                    params: { auct_id: header.carousel.selectedAuctId }
                }
            );
            console.log("responde data carousel products -> ", response.data)
            setCarouselProducts(response.data.products);
        } catch (error) {
            console.error("Erro ao buscar produtos do carrossel:", error);
        }
    };

    const getElementStyle = () => {
        return {
            backgroundColor: header.color,
            opacity: header.elementsOpacity
        };
    };

    const getBackgroundStyle = () => {
        if (!header.backgroundImage) {
            return {};
        }

        const baseStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: header.backgroundImageOpacity || 1,
            filter: `blur(${header.backgroundImageBlur || 0}px) brightness(${header.backgroundImageBrightness || 1})`,
            zIndex: 0
        };

        if (header.backgroundImage.startsWith('http') || header.backgroundImage.startsWith('/')) {
            return {
                ...baseStyle,
                backgroundImage: `url(${header.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }

        if (header.backgroundImage.startsWith('linear-gradient')) {
            return {
                ...baseStyle,
                backgroundImage: header.backgroundImage
            };
        }

        return {
            ...baseStyle,
            backgroundColor: header.backgroundImage
        };
    };

    // Renderiza os elementos decorativos
    const RenderDecorative = () => {
        const decorativeElements = {
            MODEL_1: () => (
                <div className="absolute inset-0 z-10">
                    <div name="element_3" className="w-[110px] h-full absolute right-[48%]"
                        style={getElementStyle()}></div>
                    <div name="element_4" className="w-[110px] h-full absolute right-[40%]"
                        style={getElementStyle()}></div>
                    <div name="element_2" className="w-[120px] h-[60vh] absolute left-[34vh] bottom-[-10vh] origin-bottom-left 
                    transform rotate-[-50deg]" style={getElementStyle()}></div>
                    <div name="element_1" className="w-[100px] h-[60vh] absolute left-[34vh] bottom-[-28vh] origin-bottom-left 
                    transform rotate-[-50deg]" style={getElementStyle()}></div>
                    <div name="element_5" className="w-[120px] h-[60vh] absolute right-[34vh] top-[-13vh] origin-top-right 
                    transform rotate-[-50deg]" style={getElementStyle()}></div>
                    <div name="element_6" className="w-[100px] h-[60vh] absolute right-[34vh] top-[-28vh] origin-top-right 
                    transform rotate-[-50deg]" style={getElementStyle()}></div>
                </div>
            ),
            MODEL_2: () => (
                <div className="absolute inset-0 z-10">
                    <div className="w-[260px] h-[260px] rounded-full absolute right-[20vh] bottom-[-4vh]"
                        style={getElementStyle()}></div>
                    <div className="w-[300px] h-[300px] rounded-full absolute right-[-4vh] bottom-[-4vh]"
                        style={getElementStyle()}></div>
                    <div className="w-[260px] h-[260px] rounded-full absolute left-[17vh] bottom-[-4vh]"
                        style={getElementStyle()}></div>
                    <div className="w-[290px] h-[290px] rounded-full absolute left-[-4vh] bottom-[-4vh]"
                        style={getElementStyle()}></div>
                    <div className="w-[300px] h-[300px] rounded-full absolute left-[-100px] top-[-100px]"
                        style={getElementStyle()}></div>
                    <div className="w-[360px] h-[360px] rounded-full absolute right-[-7vh] top-[-10vh]"
                        style={getElementStyle()}></div>
                    <div className="w-[240px] h-[240px] rounded-full absolute right-[20vh] top-[-50px]"
                        style={getElementStyle()}></div>
                </div>
            ),
            MODEL_3: () => (
                <div className="absolute inset-0 z-10">
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex w-full h-[5vh] mt-[2vh]">
                            {[...Array(12)].map((_, index) => (
                                <div key={`top-${index}`} className="flex-1 mx-[0.5vh]"
                                    style={getElementStyle()}></div>
                            ))}
                        </div>
                        <div className="flex w-full h-[5vh] mb-[2vh]">
                            {[...Array(12)].map((_, index) => (
                                <div key={`bottom-${index}`} className="flex-1 mx-[0.5vh]"
                                    style={getElementStyle()}></div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
            MODEL_4: () => (
                <div className="absolute inset-0 z-10">
                    <div className="absolute top-0 left-0 w-full h-1/2 transform -skew-y-6"
                        style={getElementStyle()}></div>
                    <div className="absolute bottom-0 right-0 w-full h-1/2 transform skew-y-6"
                        style={getElementStyle()}></div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                        <div className="w-3 h-3 rounded-full" style={getElementStyle()}></div>
                        <div className="w-3 h-3 rounded-full" style={getElementStyle()}></div>
                        <div className="w-3 h-3 rounded-full" style={getElementStyle()}></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-4 rounded-full"
                        style={getElementStyle()}></div>
                </div>
            ),
            MODEL_5: () => (
                <div className="absolute inset-0 z-10">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-[300px] h-[300px] rounded-full"
                            style={getElementStyle()}></div>
                        <div className="absolute inset-0 w-[400px] h-[400px] rounded-full border-[20px] -translate-x-[50px] -translate-y-[50px]"
                            style={getElementStyle()}></div>
                    </div>
                    <div className="absolute top-10 left-10 w-20 h-20 rounded-full"
                        style={getElementStyle()}></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full"
                        style={getElementStyle()}></div>
                    <div className="absolute top-20 right-20 w-12 h-12 rounded-full"
                        style={getElementStyle()}></div>
                    <div className="absolute bottom-20 left-20 w-14 h-14 rounded-full"
                        style={getElementStyle()}></div>
                </div>
            ),
            MODEL_6: () => (
                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 right-0 flex gap-0 h-[33.33%]">
                            <div className="w-[40%] h-full border-[2px]"
                                style={getElementStyle()}></div>
                            <div className="w-[25%] h-full border-[2px] border-l-0"
                                style={getElementStyle()}></div>
                            <div className="w-[35%] h-full border-[2px] border-l-0"
                                style={getElementStyle()}></div>
                        </div>
                        <div className="absolute top-[33.33%] left-0 right-0 flex gap-0 h-[33.33%]">
                            <div className="w-[30%] h-full border-[2px] border-t-0"
                                style={getElementStyle()}></div>
                            <div className="w-[45%] h-full border-[2px] border-l-0 border-t-0"
                                style={getElementStyle()}></div>
                            <div className="w-[25%] h-full border-[2px] border-l-0 border-t-0"
                                style={getElementStyle()}></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex gap-0 h-[33.33%]">
                            <div className="w-[50%] h-full border-[2px] border-t-0"
                                style={getElementStyle()}></div>
                            <div className="w-[20%] h-full border-[2px] border-l-0 border-t-0"
                                style={getElementStyle()}></div>
                            <div className="w-[30%] h-full border-[2px] border-l-0 border-t-0"
                                style={getElementStyle()}></div>
                        </div>
                    </div>
                </div>
            ),
            MODEL_7: () => (
                <div className="absolute inset-0 z-10">
                    <div className="w-full h-full grid grid-cols-8 gap-1 p-1">
                        {[...Array(48)].map((_, index) => (
                            <div
                                key={index}
                                className="w-full h-full"
                                style={getElementStyle()}
                            ></div>
                        ))}
                    </div>
                </div>
            ),
            MODEL_8: () => null,
            MODEL_9: () => (
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {[...Array(6)].map((_, index) => {
                        const duration = 15 + (index * 3);
                        return (
                            <div
                                key={`wave-${index}`}
                                className="absolute w-[300%] h-[40px] animate-diagonalMove"
                                style={{
                                    ...getElementStyle(),
                                    top: `${index * 20}%`,
                                    left: `${index * 10}%`,
                                    '--duration': `${duration}s`
                                }}
                            ></div>
                        );
                    })}
                </div>
            ),
            MODEL_10: () => (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={`circle-${index}`}
                            className="absolute rounded-full animate-pulse"
                            style={{
                                ...getElementStyle(),
                                width: `${(6 - index) * 100}px`,
                                height: `${(6 - index) * 100}px`,
                                animationDelay: `${index * 0.2}s`
                            }}
                        ></div>
                    ))}
                </div>
            ),
            MODEL_11: () => (
                <div className="absolute inset-0 z-10">
                    <div className="grid grid-cols-6 gap-2 p-4 h-full">
                        {[...Array(36)].map((_, index) => (
                            <div
                                key={`hex-${index}`}
                                className="aspect-square rotate-45"
                                style={getElementStyle()}
                            ></div>
                        ))}
                    </div>
                </div>
            ),
            MODEL_12: () => (
                <div className="absolute inset-0 z-10 flex flex-col justify-between py-8">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={`zigzag-${index}`}
                            className="h-[2px] w-full flex"
                            style={{ transform: index % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)' }}
                        >
                            <div className="w-full h-full"
                                style={{
                                    ...getElementStyle(),
                                    clipPath: 'polygon(0 0, 25% 100%, 50% 0, 75% 100%, 100% 0)'
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            ),
            MODEL_13: () => (
                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 flex flex-col">
                        <div className="h-1/2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-[120%] h-[200%] origin-top-left -rotate-12"
                                style={getElementStyle()}></div>
                            <div className="absolute top-[20%] left-[30%] w-[100%] h-[180%] origin-top-left -rotate-12"
                                style={getElementStyle()}></div>
                            <div className="absolute top-[40%] left-[60%] w-[80%] h-[160%] origin-top-left -rotate-12"
                                style={getElementStyle()}></div>
                        </div>
                        <div className="h-1/2 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-[120%] h-[200%] origin-bottom-right rotate-12"
                                style={getElementStyle()}></div>
                            <div className="absolute bottom-[20%] right-[30%] w-[100%] h-[180%] origin-bottom-right rotate-12"
                                style={getElementStyle()}></div>
                            <div className="absolute bottom-[40%] right-[60%] w-[80%] h-[160%] origin-bottom-right rotate-12"
                                style={getElementStyle()}></div>
                        </div>
                    </div>
                </div>
            ),
            MODEL_14: () => (
                <div className="absolute inset-0 z-10">
                    <div className="grid grid-cols-6 gap-4 p-8 h-full">
                        {[...Array(24)].map((_, index) => (
                            <div
                                key={`diamond-${index}`}
                                className="aspect-square rotate-45"
                                style={getElementStyle()}
                            ></div>
                        ))}
                    </div>
                </div>
            ),
            MODEL_15: () => (
                <div className="absolute inset-0 z-10 p-8">
                    <div className="w-full h-full border-[20px] relative"
                        style={getElementStyle()}>
                        <div className="absolute top-4 left-4 w-20 h-20 border-t-4 border-l-4"
                            style={getElementStyle()}></div>
                        <div className="absolute top-4 right-4 w-20 h-20 border-t-4 border-r-4"
                            style={getElementStyle()}></div>
                        <div className="absolute bottom-4 left-4 w-20 h-20 border-b-4 border-l-4"
                            style={getElementStyle()}></div>
                        <div className="absolute bottom-4 right-4 w-20 h-20 border-b-4 border-r-4"
                            style={getElementStyle()}></div>
                    </div>
                </div>
            ),
            MODEL_16: () => (
                <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[300px] h-[300px] animate-spinSlow">
                            <div className="absolute inset-0 rounded-full border-[30px]"
                                style={getElementStyle()}></div>

                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={`ray-${index}`}
                                    className="absolute top-1/2 left-1/2 w-[400px] h-[3px] -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        ...getElementStyle(),
                                        transform: `translate(-50%, -50%) rotate(${index * 45}deg)`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
            MODEL_17: () => (
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {[...Array(40)].map((_, index) => {
                        const size = Math.random() * 60 + 20;
                        const duration = Math.random() * 15 + 10;
                        const delay = Math.random() * -20;
                        const translateX = Math.random() * 200 - 100;
                        const brightness = 0.8 + Math.random() * 0.4;

                        return (
                            <div
                                key={`sphere-${index}`}
                                className="absolute animate-fallingSphere rounded-full"
                                style={{
                                    ...getElementStyle(),
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    left: `${Math.random() * 100}%`,
                                    '--duration': `${duration}s`,
                                    '--tx': `${translateX}px`,
                                    animationDelay: `${delay}s`,
                                    filter: `brightness(${brightness})`,
                                    boxShadow: `0 0 ${size / 4}px rgba(255,255,255,${0.1 + Math.random() * 0.2})`
                                }}
                            ></div>
                        );
                    })}
                </div>
            ),
            MODEL_18: () => (
                <div className="absolute inset-0 z-10 p-4">
                    <div className="grid grid-cols-8 grid-rows-6 gap-2 h-full">
                        {[...Array(48)].map((_, index) => (
                            <div
                                key={`grid-${index}`}
                                className={`w-full ${index % 3 === 0 ? 'h-full row-span-2' : 'h-full'}`}
                                style={getElementStyle()}
                            ></div>
                        ))}
                    </div>
                </div>
            )
        };

        const RenderModel = decorativeElements[header.model];
        return RenderModel ? <RenderModel /> : null;
    };

    // Renderiza os textos do header
    const RenderTexts = () => {
        if (!header.texts) return null;

        return (
            <section className='absolute inset-0 z-20'>
                {header.texts.map((text, index) => (
                    <div
                        key={index}
                        className='text-white absolute'
                        style={{
                            top: text.positionTop || '50%',
                            left: text.positionLeft || '50%',
                            transform: 'translate(-50%, -50%)',
                            minWidth: '200px',
                            maxWidth: text.positionWidth || '80%'
                        }}
                    >
                        <div className="cursor-default">
                            <h1
                                className="font-bold select-none"
                                style={{
                                    fontSize: text.titleSize || '60px',
                                    color: text.titleColor || 'white',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            >
                                {text.title}
                            </h1>
                            <p
                                className="select-none mt-2"
                                style={{
                                    color: text.contentColor || 'white',
                                    fontSize: '16px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            >
                                {text.content}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        );
    };

    // Renderiza o carrossel
    const RenderCarousel = () => {
        if (!header.carousel?.enabled || !carouselProducts?.length) return null;

        return (
            <div
                className="absolute z-20"
                style={{
                    top: header.carousel.positionTop || '60%',
                    left: header.carousel.positionLeft || '10%',
                    width: header.carousel.sizeWidth || '100%',
                    height: header.carousel.sizeHeight || '40%'
                }}
            >
                {header.carousel.showCarouselTitle !== false && (
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        {header.carousel.title}
                    </h2>
                )}
                <div className="w-full h-full">
                    <Swiper
                        modules={[FreeMode, Navigation, Autoplay]}
                        spaceBetween={header.carousel.spaceBetween}
                        slidesPerView={Math.min(header.carousel.itemsToShow || 3, carouselProducts.length)}
                        navigation={header.carousel.showNavigation !== false}
                        autoplay={{
                            delay: header.carousel.speed || 3000,
                            disableOnInteraction: false,
                        }}
                        className="w-full h-full"
                        style={{
                            '--swiper-navigation-color': '#fff',
                            '--swiper-pagination-color': '#fff',
                            ...(header.carousel.showNavigation === false && {
                                '--swiper-navigation-size': '0',
                            })
                        }}
                    >
                        {carouselProducts.map((product, index) => (
                            <SwiperSlide key={index} className="!h-full">
                                <div className="w-full h-full bg-gray-800">
                                    <div className="w-full h-full">
                                        <img
                                            src={product.cover_img_url}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {(header.carousel.showTitle !== false || header.carousel.showPrice !== false) && (
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                            {header.carousel.showTitle !== false && (
                                                <h3 className="text-white text-sm font-semibold truncate mb-1">
                                                    {product.title}
                                                </h3>
                                            )}
                                            {header.carousel.showPrice !== false && (
                                                <p className="text-gray-200 text-xs">
                                                    R$ {product.initial_value?.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        );
    };

    return (
        <header
            ref={headerRef}
            className={`w-full flex flex-col relative overflow-hidden bg-red-300
                ${header.sizeType === "FULL" && "min-h-[100vh]"} 
                ${header.sizeType === "MEDIUM" && "min-h-[50vh]"}
                ${header.sizeType === "SMALL" && "min-h-[25vh]"}`}
            style={{ fontFamily: fontStyle }}>

            {header.backgroundImage && (
                <div
                    className="absolute inset-0 w-full h-full z-[99]"
                    style={getBackgroundStyle()}
                />
            )}

            {/* Container para elementos decorativos em tela cheia */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
                <RenderDecorative />
            </div>

            {/* Container centralizado para textos e carrossel */}
            <section className='flex justify-center items-center absolute inset-0 z-20 w-[80%] mx-auto'>
                <RenderTexts />
                <RenderCarousel />
            </section>
        </header>
    );
}

export default RenderHeaderAdvertiser;