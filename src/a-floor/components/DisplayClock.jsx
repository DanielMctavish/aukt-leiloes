/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

function DisplayClock() {
  const [displayMessage, setDisplayMessage] = useState("AUKT");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [messages] = useState([
    "LEMBRE-SE DE CONFIGURAR A FORMA DE PAGAMENTO",
    "Configure o frete aqui mesmo na nossa plataforma",
    "Atencao ao tempo de cada pregao",
  ]);
  const refClockMsg = useRef();

  useEffect(() => {
    const transitionDuration = 9000;

    const moveClock = () => {
      refClockMsg.current.style.transition = "none";
      refClockMsg.current.style.transform = "translateX(400px)";

      refClockMsg.current.offsetHeight;

      refClockMsg.current.style.transition = `transform ${transitionDuration / 1000}s linear`;
      refClockMsg.current.style.transform = "translateX(-460px)";
    };

    const newInterval = setInterval(() => {
      moveClock();

      setCurrentMessageIndex((prevIndex) =>
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );

      setDisplayMessage(() =>
        messages[currentMessageIndex].toUpperCase()
      );

    }, transitionDuration);

    return () => clearInterval(newInterval);
  }, [currentMessageIndex, displayMessage, messages]);

  return (
    <div className="w-[400px] h-[40px] text-[#1e2e65] flex justify-start items-center p-1 overflow-hidden rounded-md relative">
      <span
        ref={refClockMsg}
        style={{ fontFamily: "alarm clock" }}
        className="min-w-[600px] font-bold flex gap-3 absolute"
      >
        <p>{displayMessage}</p>
      </span>
    </div>
  );
}

export default DisplayClock;
