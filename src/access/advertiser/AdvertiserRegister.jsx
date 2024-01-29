/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


function AdvertiserRegister() {
    const refName = useRef()
    const refCpf = useRef()
    const refCNPJ = useRef()
    const refCompanyName = useRef()
    const refEmail = useRef()
    const refPassword = useRef()
    const refPasswordConfirm = useRef()

    //address fields
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()
    const refNumber = useRef()
    const refCep = useRef()

    const [messageDisplay, setMessageDisplay] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
        if (currentLocalAdvertiser) {
            navigate('/advertiser/dashboard')
        }
    }, [])

    const handleRegisterAdvertiser = async () => {

        if (!refName.current.value || !refEmail.current.value
            || !refPassword.current.value || !refPasswordConfirm.current.value
            || !refState.current.value || !refCity.current.value
            || !refStreet.current.value || !refNumber.current.value
            || !refCep.current.value) {
            setMessageDisplay("Preencha todos os campos")
            return
        }

        if (refPassword.current.value !== refPasswordConfirm.current.value) {
            setMessageDisplay("As senhas não conferem")
            return
        }

        const addressInformations = {
            state: refState.current.value,
            city: refCity.current.value,
            street: refStreet.current.value,
            number: refNumber.current.value,
            cep: refCep.current.value
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/create-advertiser`, {
            name: refName.current.value,
            CPF: refCpf.current.value,
            CNPJ: refCNPJ.current.value,
            company_name: refCompanyName.current.value,
            company_adress:JSON.stringify(addressInformations),
            email: refEmail.current.value,
            password: refPassword.current.value,
            address: JSON.stringify(addressInformations)
        }).then((res) => {

            setMessageDisplay("Usuário criado com sucesso!")
            console.log(res.data);
            navigate("/advertiser/login")

        }).catch(err => {
            console.log(err.response);
        })
    }

    const handleGetAddress = (event) => {
        //console.log('observando target ->', event.target.value);
        //API CEP https://viacep.com.br/ws/53409400/json/
        const cep = event.target.value
        const url = `https://viacep.com.br/ws/${cep}/json/`
        axios.get(url).then(res => {
            console.log('res ai ->', res.data);
            refState.current.value = res.data.uf
            refCity.current.value = res.data.localidade
            refStreet.current.value = res.data.logradouro
        }).catch(err => {
            console.log(err.response);
        })

    }


    return (

        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3">

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
                        <input ref={refCpf} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>senha</span>
                        <input ref={refPassword} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <div className="flex flex-col justify-start items-start">
                        <span>confirmar senha</span>
                        <input ref={refPasswordConfirm} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                    <button onClick={handleRegisterAdvertiser} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#012038]">registrar</button>
                    <button onClick={() => {
                        navigate("/advertiser/login")
                    }}>já tem uma conta? Entrar</button>
                </div>

                <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">

                    <div onChange={handleGetAddress} className="flex flex-col justify-start items-start">
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
                            <input ref={refCNPJ} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>
                    </section>

                </div>

            </section>

        </div>
    )
}

export default AdvertiserRegister