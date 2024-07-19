/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import { useState, useEffect } from "react";
import { ArrowCircleLeft } from "@mui/icons-material"

function CardMarked() {
  const [allAuctions, setAllAuctions] = useState([]);

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

  return (
    <div className="lg:flex w-[71%] justify-start items-center gap-3">
      <div className='flex justify-center items-center min-w-[40px] h-[300px] bg-[#404040] z-10 rounded-[6px] cursor-pointer hover:bg-[#5d5d5d]'>
        <ArrowCircleLeft />
      </div>
      {
        allAuctions.map((auct, i) => {
          return (
            <div key={i} className="min-w-[300px] h-[300px] rounded-[12px] shadow-lg shadow-[#15151589] 
            relative gap-2 overflow-hidden flex justify-center items-center">
              <img src={auct.auct_cover_img} alt="" className="object-cover w-[100%] h-[100%] absolute" />
              <div className="flex justify-center items-center absolute bottom-1 w-[97%] h-10 p-2 text-white bg-[#012038] rounded-[6px]">
                <p>{auct.title}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default CardMarked;
