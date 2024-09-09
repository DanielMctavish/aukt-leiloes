/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

function Recomendados({ anotherProducts }) {

    const navigate = useNavigate()

    return (
        <section className='flex flex-col w-[80%] h-[300px] bg-[#C4CDCE] shadow-lg shadow-[#11111142]
                rounded-[12px] mt-[3vh] justify-between items-center relative p-3'>

            <div className='flex w-full h-[70px] p-2 justify-start items-center'>
                <span className='text-[22px] font-bold text-left text-[#252525]'>Recomendamos pra você</span>
            </div>

            <div className='flex w-full justify-start items-center gap-2 overflow-x-auto overflow-y-hidden p-3'>
                <Swiper spaceBetween={3}
                    slidesPerView={5}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper">
                    {
                        anotherProducts.map((product) => {

                            return (
                                <SwiperSlide key={product.id}>
                                    <img src={product.cover_img_url} alt={product.title}
                                        onClick={() => navigate(`/advertiser/home/product/${product.id}`)}
                                        className='w-[200px] h-[200px] hover:scale-[1.2] object-cover rounded-[12px] cursor-pointer' />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>

        </section>
    )
}

export default Recomendados;