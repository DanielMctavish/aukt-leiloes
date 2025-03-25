/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

function DisplayClock({ message }) {
  const [displayMessage, setDisplayMessage] = useState("AUKT");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fallbackMessages] = useState([
    "LEMBRE-SE DE CONFIGURAR A FORMA DE PAGAMENTO",
    "Configure o frete aqui mesmo na nossa plataforma",
    "Atencao ao tempo de cada pregao",
    "Não se esqueça de revisar os lances antes de finalizar",
    "Acompanhe o tempo restante do leilão",
    "Verifique as condições de entrega do produto",
  ]);
  const refClockMsg = useRef();
  const contentRef = useRef();
  const containerRef = useRef();

  // Função auxiliar para tratar acentos corretamente
  const normalizeText = (text) => {
    // Manter o texto em maiúsculo, mas sem alterar os caracteres especiais
    return text.toUpperCase();
  };

  useEffect(() => {
    // Se tiver uma mensagem enviada via props, use-a imediatamente
    if (message && message.trim() !== '') {
      setDisplayMessage(normalizeText(message));
    }
  }, [message]);

  useEffect(() => {
    if (!refClockMsg.current || !contentRef.current || !containerRef.current) return;

    // Obter largura real do conteúdo e do container
    const contentWidth = contentRef.current.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;
    
    // Calcular tempo baseado no tamanho do texto 
    // Quanto maior o texto, mais tempo levará para passar
    // Base: 20 segundos para 500px, aumentando proporcionalmente
    const baseSpeed = 60; // pixels por segundo
    const totalDistance = contentWidth + containerWidth;
    const transitionDuration = Math.max(totalDistance / baseSpeed * 1000, 10000); // Mínimo de 10 segundos

    const moveClock = () => {
      refClockMsg.current.style.transition = "none";
      refClockMsg.current.style.transform = `translateX(${containerWidth}px)`;

      refClockMsg.current.offsetHeight; // Trigger reflow

      refClockMsg.current.style.transition = `transform ${transitionDuration / 1000}s linear`;
      refClockMsg.current.style.transform = `translateX(-${contentWidth}px)`;
    };

    // Inicia a animação imediatamente
    moveClock();

    const newInterval = setInterval(() => {
      // Se não houver mensagem definida nas props, use o sistema de rotação de mensagens
      if (!message || message.trim() === '') {
        setCurrentMessageIndex((prevIndex) =>
          prevIndex === fallbackMessages.length - 1 ? 0 : prevIndex + 1
        );

        setDisplayMessage(() =>
          normalizeText(fallbackMessages[currentMessageIndex])
        );
      }
      
      // Reiniciar a animação
      moveClock();
    }, transitionDuration);

    return () => clearInterval(newInterval);
  }, [currentMessageIndex, displayMessage, fallbackMessages, message]);

  return (
    <div 
      ref={containerRef}
      className="w-[400px] h-[40px] bg-[#70707057]
      flex justify-start items-center p-1 overflow-hidden rounded-md relative shadow-md border border-[#ffffffa6]"
    >
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#fff] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#ffffffa9] to-transparent z-10"></div>
      <span
        ref={refClockMsg}
        className="flex gap-3 absolute text-base tracking-wide whitespace-nowrap"
      >
        <p ref={contentRef} className="text-[#012038] font-bold">{displayMessage}</p>
      </span>
    </div>
  );
}

DisplayClock.propTypes = {
  message: PropTypes.string
};

DisplayClock.defaultProps = {
  message: ''
};

export default DisplayClock;
