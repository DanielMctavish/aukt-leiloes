/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { Lock, Security, Warning } from "@mui/icons-material";

function SecurityConfirmation() {
    const [currentToken] = useState(import.meta.env.VITE_APP_TOKEN_SECURITY);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenInput, setTokenInput] = useState("");
    const navigate = useNavigate();
    const refSpan = useRef();

    useEffect(() => {
        const currentSessionToken = JSON.parse(localStorage.getItem("token-access-register-advertiser"));

        if (currentSessionToken) {
            const expiration = dayjs(currentSessionToken.expiration).valueOf()
            const currentMoment = dayjs().valueOf()

            if (expiration > currentMoment) {
                navigate(`/advertiser/register/${currentSessionToken.token}`);
                return;
            }
        }

    }, []);

    const handleVerifyToken = (e) => {
        const value = e.target.value;
        setTokenInput(value);

        if (value === currentToken) {
            setIsTokenValid(true);
        } else {
            setIsTokenValid(false);
        }
    };



    const handleRefirectToRegister = () => {

        if (tokenInput === currentToken) {
            const currentUUID = v4()
            const tokenData = {
                token: currentUUID,
                expiration: dayjs().add(2, "minute").toISOString()
            };
            localStorage.setItem("token-access-register-advertiser", JSON.stringify(tokenData));
            navigate(`/advertiser/register/${currentUUID}`)

        } else {
            setIsTokenValid(false);
            return
        }


    }


    return (
        <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-red-600 p-4 flex items-center gap-3">
                    <Warning className="text-white text-3xl" />
                    <div>
                        <h2 className="text-white font-bold text-lg">Área Restrita</h2>
                        <p className="text-red-100 text-sm">Acesso permitido apenas para pessoal autorizado</p>
                    </div>
                </div>

                {/* Corpo */}
                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <Security className="text-gray-400 text-5xl" />
                    </div>

                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-gray-800 font-semibold mb-2">Confirmação de Segurança</h3>
                            <p className="text-gray-600 text-sm">
                                Esta é uma área protegida da plataforma. Digite o token de acesso fornecido pela equipe técnica.
                            </p>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                onChange={handleVerifyToken}
                                placeholder="Digite o token de acesso"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                    focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        {isTokenValid && (
                            <div className="animate-fadeIn" ref={refSpan}>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-green-700 text-center font-medium">
                                        Token verificado com sucesso
                                    </p>
                                </div>
                                <button
                                    onClick={handleRefirectToRegister}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 
                                        rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    Prosseguir para registro
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Rodapé */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                        Esta área é monitorada e todos os acessos são registrados por questões de segurança.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SecurityConfirmation;
