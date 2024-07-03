/* eslint-disable no-unused-vars */
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <section className="w-full h-[40vh] border-t-[10px] border-[#1E1E1E] bg-[#012038] overflow-hidden relative">

      <div className="flex items-center justify-end absolute top-2 right-2">
        <a
          href="https://www.instagram.com/jvlclassics/"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4"
        >
          <InstagramIcon sx={{fontSize:"32px"}}/>
        </a>
      </div>

    </section>
  );
}

export default Footer;
