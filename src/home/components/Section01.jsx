/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Submenu from "../navigation/Submenu";
import Camisa from "../medias/posts/camisa_2002.png";
import TablePicture from "../medias/posts/pngtree.png";
import Springfield from "../medias/posts/Springfield.png";

function Section01() {
  const images = [Springfield, Camisa, TablePicture];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="sm:mt-2 mt-10 sm:mb-10">
      <Submenu />
      <div className="w-[1520px] h-[0.4px] bg-[#B5B5B5] mt-2 sm:flex hidden"></div>

      <div className="flex items-center justify-center sm:pt-[90px] pt-2 relative overflow-hidden ">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className={`mx-6 sm:w-full w-[70vh] ${
              index === 0 || index === images.length - 1 ? "w-1/2" : ""
            }`}
          />
        ))}

        {images.length > 1 && (
          <div className="absolute sm:space-x-[480px] top-1/1 flex justify-center">
            <div className="flex sm:space-x-16">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded cursor-pointer"
                disabled={currentImageIndex === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="45"
                  height="45"
                  viewBox="0 0 45 45"
                  fill="none"
                >
                  <g filter="url(#filter0_d_108_9)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20.5 35C29.6127 35 37 27.6127 37 18.5C37 9.3873 29.6127 2 20.5 2C11.3873 2 4 9.3873 4 18.5C4 27.6127 11.3873 35 20.5 35ZM18.3468 18.4926L24.5336 24.2215C25.1555 24.7973 25.1395 25.7423 24.5336 26.3181C23.9117 26.894 22.9072 26.894 22.2853 26.3181L14.9664 19.5409C14.3445 18.9651 14.3445 18.0349 14.9664 17.4591L22.2853 10.6819C22.9072 10.106 23.9117 10.106 24.5336 10.6819C25.1555 11.2577 25.1555 12.1879 24.5336 12.7638L18.3468 18.4926Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_108_9"
                      x="0"
                      y="0"
                      width="45"
                      height="45"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="2" dy="4" />
                      <feGaussianBlur stdDeviation="3" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.49 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_108_9"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_108_9"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </button>
              <div className="sm:w-[400px] w-[280px] text-[#FFF] text-shadow-md font-inter sm:pb-[70px]">
                <h2 className="sm:text-[22px] text-[16px] sm:mb-2 font-semibold">
                  CAMISA OFICIAL DA COPA 2002
                </h2>
                <span className="sm:text-[14px] text-[12px] block md:mb-8 font-normal tracking-widest">
                  Lorem ipsum dolor sit amet, consectetur <br />
                  adipisci elit, sed eiusmod tempor incidunt ut labore et dolore
                  magna aliqua. Ut enim ad minim veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam.
                </span>
                <button className="w-[161px] h-[36px] bg-[#012038] rounded-[2px] text-[#f2f2f2] text-[14px] font-normal" >DAR UM LANCE</button>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded cursor-pointer"
              disabled={currentImageIndex === images.length - 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="45"
                height="45"
                viewBox="0 0 45 45"
                fill="none"
              >
                <g filter="url(#filter0_d_108_15)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M20.5 2C11.3873 2 4 9.3873 4 18.5C4 27.6127 11.3873 35 20.5 35C29.6127 35 37 27.6127 37 18.5C37 9.3873 29.6127 2 20.5 2ZM22.6532 18.5074L16.4664 12.7785C15.8445 12.2027 15.8605 11.2577 16.4664 10.6819C17.0883 10.106 18.0928 10.106 18.7147 10.6819L26.0336 17.4591C26.6555 18.0349 26.6555 18.9651 26.0336 19.5409L18.7147 26.3181C18.0928 26.894 17.0883 26.894 16.4664 26.3181C15.8445 25.7423 15.8445 24.8121 16.4664 24.2362L22.6532 18.5074Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_108_15"
                    x="0"
                    y="0"
                    width="45"
                    height="45"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="2" dy="4" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.49 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_108_15"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_108_15"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


export default Section01;


