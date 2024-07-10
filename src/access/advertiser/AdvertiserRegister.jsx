/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { handleRegisterAdvertiser } from "./functions/handleRegisterAdvertiser"
import { handleGetAddress } from "./functions/handleGetAddress"
import { verifyCnpj, verifyCpf } from "./functions/verifyDocuments"
import { getSecurityTokenAccess } from "./functions/getSecurityTokenAccess"


function AdvertiserRegister() {
    const [cpf, setCpf] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [messageDisplay, setMessageDisplay] = useState("")
    const [timeTokenLeft, setTimeTokenLeft] = useState("")
    const refName = useRef()
    const refCompanyName = useRef()
    const refEmail = useRef()
    const refPassword = useRef()
    const refPasswordConfirm = useRef()

    const { register_token } = useParams()

    //address fields
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()
    const refNumber = useRef()
    const refCep = useRef()


    const navigate = useNavigate()

    useEffect(() => { }, [timeTokenLeft])
    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (currentLocalAdvertiser) {
            navigate('/advertiser/dashboard')
        }
        getSecurityTokenAccess(navigate, register_token, setTimeTokenLeft)
    }, [])

    const dataRegister = {
        refName, refEmail, refPassword, refPasswordConfirm,
        refState, refCity, refStreet, refNumber, refCep,
        refCompanyName, cpf, cnpj, setMessageDisplay, navigate
    }

    return (

        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3 relative">
            <span className="absolute top-1 left-1 text-zinc-600 text-[10px]">tempo restante: {timeTokenLeft}</span>

            <span className="text-zinc-700">{messageDisplay}</span>

            <section className="w-[80%] h-[90vh]
        shadow-[#000000b9]
        flex bg-[#012038] rounded-[4px]
        justify-center items-center 
        relative overflow-hidden shadow-2xl">

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative bg-[#144e7b]">
                    <h1 className="text-left font-bold text-[33px] w-[300px]">REGISTRE-SE!</h1>

                    <div className="flex flex-col justify-start items-start">
                        <span>nome</span>
                        <input ref={refName} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>email</span>
                        <input ref={refEmail} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>CPF</span>
                        <input
                            value={cpf}
                            type="text"
                            onChange={(e) => verifyCpf(e, { setCpf })}
                            className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>senha</span>
                        <input ref={refPassword} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>confirmar senha</span>
                        <input ref={refPasswordConfirm} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={() => handleRegisterAdvertiser(dataRegister)} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#012038]">registrar</button>
                    <button onClick={() => {
                        navigate("/advertiser/login")
                    }}>já tem uma conta? Entrar</button>
                </div>

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">

                    <div onChange={(e) => handleGetAddress(e, { refState, refCity, refStreet })} className="flex flex-col justify-start items-start">
                        <span>Cep</span>
                        <input ref={refCep} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Estado</span>
                        <input ref={refState} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Cidade</span>
                        <input ref={refCity} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>Rua</span>
                        <input ref={refStreet} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>número</span>
                        <input ref={refNumber} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>


                    <section className="w-[80%] flex flex-col justify-around items-center rounded-md bg-[#144e7b8c] gap-6 p-6">
                        <div className="flex flex-col justify-start items-start">
                            <span>Nome da Empresa</span>
                            <input ref={refCompanyName} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <span>CNPJ</span>
                            <input type="text"
                                value={cnpj}
                                onChange={(e) => verifyCnpj(e, { setCnpj })}
                                className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>
                    </section>

                </div>

            </section>

        </div>
    )
}

export default AdvertiserRegister