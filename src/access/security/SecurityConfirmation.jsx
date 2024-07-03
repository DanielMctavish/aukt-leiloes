/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import "./SecurityStyles.css"

function SecurityConfirmation() {
    const [currentToken] = useState("ABC123!");
    const [tokenUUID, setUUID] = useState("")
    const [isTokenValid, setIsTokenValid] = useState(false);
    const navigate = useNavigate();
    const refSpan = useRef();

    useEffect(() => {
        const currentSessionToken = JSON.parse(localStorage.getItem("token-access-register-advertiser"));
        if (currentSessionToken) {
            const expiration = dayjs(currentSessionToken.expiration);
            if (expiration.isAfter(dayjs())) {
                navigate(`/advertiser/register/${currentSessionToken.token}`);
                return;
            } else {
                localStorage.removeItem("token-access-register-advertiser");
            }
        }
    }, []);

    const handleVerifyToken = (e) => {
        const tokenInput = e.target.value;

        if (tokenInput === currentToken) {
            const currentUUID = v4()
            const tokenData = {
                token: currentUUID,
                expiration: dayjs().add(4, "minute").toISOString()
            };
            localStorage.setItem("token-access-register-advertiser", JSON.stringify(tokenData));
            setIsTokenValid(true);
            setUUID(currentUUID)
        } else {
            setIsTokenValid(false);
        }
    };

    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center gap-3 bg-black text-green-400">
            <div className="font-bold text-[23px] neon-text">Confirmação de Segurança</div>
            <span className="neon-text">Você está acessando uma área sensível da plataforma, solicite um token para a equipe de desenvolvimento técnico.</span>
            <input
                onChange={handleVerifyToken}
                type="text"
                placeholder="Digite o token de acesso"
                className="w-[70%] h-[60px] p-2 rounded-md bg-black text-green-400 neon-input"
            />
            {isTokenValid && (
                <div className="flex flex-col gap-3" ref={refSpan}>
                    <span className="font-bold text-[#10dc36] neon-text">Acesso garantido</span>
                    <button onClick={() => navigate(`/advertiser/register/${tokenUUID}`)} className="neon-button">Ir para registro</button>
                </div>
            )}
        </div>
    );
}

export default SecurityConfirmation;
