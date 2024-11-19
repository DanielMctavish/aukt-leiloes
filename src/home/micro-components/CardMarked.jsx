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
      setAllAuctions(response.data)
    }).catch(error => {
      return error
    });

  }

  const handleRedirectToAdvertiser = (advertiser_id) => {
    navigate(`advertiser/home/${advertiser_id}`)
  }

  useEffect(() => { }, [allAuctions])

  return (
    <div className="lg:flex lg:w-[71%] w-full justify-start items-center gap-3  lg:h-[300px] h-full z-[33] ">

      <div className='lg:flex hidden justify-center items-center min-w-[40px] 
      lg:h-[300px] h-full bg-[#404040] z-10 rounded-[6px] cursor-pointer hover:bg-[#5d5d5d] gap-2'>
        <ArrowCircleLeft />
      </div>

      <Swiper
        breakpoints={
          // breakpoints
          {
            768: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        spaceBetween={6}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
      >

        {
          allAuctions.map((auct) => {

            return (
              auct.status === "cataloged" ?
                <SwiperSlide key={auct.id}>
                  <div className="w-full lg:h-[300px] h-[800px] rounded-[12px] shadow-lg shadow-[#15151589] 
                relative gap-2 overflow-hidden flex justify-center items-center"
                    onClick={() => handleRedirectToAdvertiser(auct.advertiser_id)}>
                    <img src={auct.auct_cover_img} alt="" className="object-cover w-[100%] lg:h-[300px] h-[800px] absolute" />

                    <span style={{textShadow:"1px 2px 1px #0f0f0f8c"}} className='font-bold text-white z-[99]'>{auct.title}</span>

                  </div>
                </SwiperSlide> : ""
            )
          })
        }
      </Swiper>

    </div >
  );
}

export default CardMarked;
