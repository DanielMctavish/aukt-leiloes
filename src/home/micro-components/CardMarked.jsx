/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import { useState, useEffect } from "react";
import { ArrowCircleLeft } from "@mui/icons-material"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useNavigate } from 'react-router-dom';

function CardMarked() {
  const [allAuctions, setAllAuctions] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    getAllAuctions()
  }, [])

  const getAllAuctions = async () => {

    await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/auct/list-auct-bystatus`, {
      params: {
        status: 'cataloged'
      }
    }).then(response => {
      // console.log("observandoi auctions -> ", response.data)
      setAllAuctions(response.data)
    }).catch(error => {
      console.error(error.message)
    });

  }

  const handleRedirectToAdvertiser = (advertiser_id) => {
    navigate(`advertiser/home/${advertiser_id}`)
  }

  useEffect(() => { }, [allAuctions])

  return (
    <div className="lg:flex lg:w-[71%] w-full justify-start items-center gap-3  h-[300px] z-[33]">

      <div className='lg:flex hidden justify-center items-center min-w-[40px] 
      h-[300px] bg-[#404040] z-10 rounded-[6px] cursor-pointer hover:bg-[#5d5d5d]'>
        <ArrowCircleLeft />
      </div>

      <Swiper
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 3,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 3,
          },
        }}
      >

        {
          allAuctions.map((auct) => {
            return (
              auct.status === "cataloged" ?
                <SwiperSlide key={auct.id}>
                  <div className="flex-1 h-[300px] rounded-[12px] shadow-lg shadow-[#15151589] 
                relative gap-2 overflow-hidden flex justify-center items-center">
                    <img src={auct.auct_cover_img} alt="" className="object-cover w-[100%] h-[300px] absolute" />

                    <button onClick={() => handleRedirectToAdvertiser(auct.advertiser_id)} className="flex justify-center items-center absolute bottom-1 cursor-pointer
                    w-[97%] h-10 p-2 text-white bg-[#012038] hover:bg-[#fff] hover:text-zinc-600 rounded-[6px]"
                    >
                      <p>{auct.title}</p>
                    </button>

                  </div>
                </SwiperSlide> : ""
            )
          })
        }
      </Swiper>

    </div>
  );
}

export default CardMarked;
