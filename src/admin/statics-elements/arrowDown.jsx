import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ArrowDown () {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIconClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <span className="cursor-pointer " onClick={handleIconClick}>
      <KeyboardArrowDownIcon
        style={{ transform: isModalOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      />

      <div>
        {isModalOpen && <div className="bg-gray-200 rounded-lg p-2"></div>}
      </div>
    </span>
  );
}

export default ArrowDown;
