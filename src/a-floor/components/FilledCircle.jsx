/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const FilledCircle = ({ percentage }) => {
    const [strokeDasharray, setStrokeDasharray] = useState('0 0');
    const radius = 10;  // Define o raio do círculo
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const fill = (circumference * percentage) / 100;
        setStrokeDasharray(`${fill} ${circumference}`);
    }, [percentage, circumference]);

    return (
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" className="z-10">
            <circle
                cx="25"  // Coordenada x do centro do círculo
                cy="25"  // Coordenada y do centro do círculo
                r={radius}
                fill="none"
                stroke="#ccc"
                strokeWidth="21"  // Largura do traçado
            />
            <circle
                cx="25"
                cy="25"
                r={radius}
                fill="none"
                stroke="#505050"
                strokeWidth="19"
                strokeDasharray={strokeDasharray}
                transform="rotate(-90 25 25)"
            />
        </svg>
    );
};

export default FilledCircle;
