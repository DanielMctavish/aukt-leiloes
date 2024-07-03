/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Alert from "../medias/vector/vector.svg";
import ArrowLeft from "../medias/vector/arrow-left.svg";
import ArrowRight from "../medias/vector/arrow-right.svg";
import Car from "../medias/backgrounds/car.png";

function CardMarked() {
  const [offset, setOffset] = useState(0);
 
   
  return (
    <div className="lg:flex w-[67%] justify-center items-center">
        <span>cards de leilões futuros</span>
    </div>
  );
}

export default CardMarked;
