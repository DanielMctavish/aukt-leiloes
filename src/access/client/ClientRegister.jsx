import axios from "axios"
import logoAukGreen from "../../media/logos/logos-auk/aukt_greengreen.png"
import bgRegister from "../../media/backgrounds/social_bg_wall.jpg"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
//avatares import
import avatar_01 from "../../media/avatar-floor/avatar_01.png"
import avatar_02 from "../../media/avatar-floor/avatar_02.png"
import avatar_03 from "../../media/avatar-floor/avatar_03.png"
import avatar_04 from "../../media/avatar-floor/avatar_04.png"
import avatar_05 from "../../media/avatar-floor/avatar_05.png"
import avatar_06 from "../../media/avatar-floor/avatar_06.png"
import avatar_07 from "../../media/avatar-floor/avatar_07.png"
import avatar_08 from "../../media/avatar-floor/avatar_08.png"

const avatares_pessoas = [avatar_01, avatar_02, avatar_03, avatar_04, avatar_05, avatar_06, avatar_07, avatar_08]

function ClientRegister() {
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [nextMenu, setNextMenu] = useState(0)
    const [nickname, setNickname] = useState("")
    const [clientAvatar, setClientAvatar] = useState(0)
    //Address states................................................................
    const [cep, setCep] = useState('')
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')

    //Address states.................................................................................

    const refCep = useRef()
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()

    const navigate = useNavigate()

    useEffect(() => { }, [cep, state, city, street, number, name, cpf, email, password, confirmPassword, nickname, clientAvatar])

    const handleRegisterNewClient = async () => {

        if (!name || !cpf || !email || !password || !confirmPassword) {
            alert('Preencha todos os campos')
            return
        }

        if (password !== confirmPassword) {
            alert('As senhas não conferem')
            return
        }

        setIsCreating(true)

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/client/create-client`, {
            name: name,
            cpf: cpf,
            email: email,
            password: password,
            client_avatar: clientAvatar,
            nickname: nickname,
            address: JSON.toString({
                cep: cep,
                state: state,
                city: city,
                street: street,
                number: number,
            })
        }).then(() => {
            //console.log(response);
            navigate("/client/dashboard")
            setIsCreating(false)

        }).catch(err => {

            console.log("erro ao tentar criar cliente -> ", err.response)
            setIsCreating(false)

        })

    }

    const handleGetAddress = (event) => {
        //console.log('observando target ->', event.target.value);
        //API CEP https://viacep.com.br/ws/53409400/json/
        const cep = event.target.value
        setCep(cep)
        const url = `https://viacep.com.br/ws/${cep}/json/`
        axios.get(url).then(res => {
            //console.log('res ai ->', res.data);
            setState(res.data.uf)
            setCity(res.data.localidade)
            setStreet(res.data.logradouro)
        }).catch(err => {
            console.log(err.response);
        })

    }

    const handleSelectedAvatar = (i) => {
        setClientAvatar(i)
    }

    if (isCreating) {

        return (
            <div className="text-white w-full h-[100vh] bg-[#616161] flex flex-col justify-center items-center gap-3">

                <section className="w-[80%] h-[90vh] 
            flex bg-[#1F8220] rounded-[4px]
            justify-center items-center 
            relative overflow-hidden shadow-2xl">
                    <span>criando novo usuário!</span>
                </section>

            </div>
        )
    }

    return (

        <div className="text-white w-full h-[100vh] bg-[#535353] flex flex-col justify-center items-center gap-3 relative">

            <img src={bgRegister} alt="" className="absolute w-full h-[100%] object-cover opacity-70" />

            <section className="md:w-[60%] w-[90%] h-[90vh] 
            flex flex-col bg-[#1f8221ca] rounded-[4px]
            justify-center items-center backdrop-blur-md
            relative overflow-hidden shadow-2xl p-2">

                <section className="flex w-full h-full justify-center items-center">

                    {
                        nextMenu === 0 &&
                        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                            <h1 className="text-left font-bold text-[33px] w-[300px]">REGISTRE-SE!</h1>

                            <div className="flex flex-col justify-start items-start">
                                <span>nome</span>
                                <input onChange={(e) => setName(e.target.value)} type="text" value={name}
                                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                            </div>

                            <div className="flex flex-col justify-start items-start">
                                <span>CPF</span>
                                <input onChange={(e) => setCpf(e.target.value)} type="text" value={cpf}
                                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                            </div>

                            <div className="flex flex-col justify-start items-start">
                                <span>email</span>
                                <input onChange={(e) => setEmail(e.target.value)} type="email" value={email}
                                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                            </div>

                            <div className="flex flex-col justify-start items-start">
                                <span>senha</span>
                                <input onChange={(e) => setPassword(e.target.value)} type="password" value={password}
                                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                            </div>

                            <div className="flex flex-col justify-start items-start">
                                <span>confirmar senha</span>
                                <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" value={confirmPassword}
                                    className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                            </div>

                            <button onClick={() => setNextMenu(1)}>proximo</button>
                        </div>
                    }

                    {
                        nextMenu === 1 &&
                        <>
                            <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                                <h1 className="text-left font-bold text-[33px] w-[300px]">Seu Endereço</h1>

                                <div onChange={handleGetAddress} className="flex flex-col justify-start items-start">
                                    <span>Cep</span>
                                    <input ref={refCep} type="text" value={cep}
                                        className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                                </div>

                                <div className="flex flex-col justify-start items-start">
                                    <span>Estado</span>
                                    <input ref={refState} type="text" value={state}
                                        className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                                </div>

                                <div className="flex flex-col justify-start items-start">
                                    <span>Cidade</span>
                                    <input ref={refCity} type="text" value={city}
                                        className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                                </div>

                                <div className="flex flex-col justify-start items-start">
                                    <span>Rua</span>
                                    <input ref={refStreet} type="text" value={street}
                                        className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                                </div>

                                <div className="flex flex-col justify-start items-start">
                                    <span>número</span>
                                    <input onChange={(e) => setNumber(e.target.value)} type="text" value={number}
                                        className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                                </div>

                                <button onClick={() => setNextMenu(0)}>anterior</button>
                                <button onClick={() => setNextMenu(2)}>próximo</button>
                            </div>
                        </>
                    }
                    {
                        nextMenu === 2 &&
                        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                            <h1 className="text-left font-bold text-[23px]">selecione seu avatar</h1>
                            <div className="flex flex-wrap w-[98%] max-h-[60vh] justify-center items-center gap-2 p-2">
                                {
                                    avatares_pessoas.map(
                                        (avatar, i) => {
                                            if (i === clientAvatar) {
                                                return (
                                                    <img src={avatar} alt=""
                                                        key={i}
                                                        onClick={() => handleSelectedAvatar(i)}
                                                        className="w-[100px] h-[100px] object-cover rounded-full cursor-pointer border-[3px] border-zinc-600" />
                                                )
                                            } else {
                                                return (
                                                    <img src={avatar} alt=""
                                                        key={i}
                                                        onClick={() => handleSelectedAvatar(i)}
                                                        className="w-[100px] h-[100px] object-cover rounded-full cursor-pointer" />
                                                )
                                            }

                                        }
                                    )
                                }
                            </div>

                            <button onClick={() => setNextMenu(1)}>anterior</button>
                            <button onClick={() => setNextMenu(3)}>próximo</button>
                        </div>
                    }
                    {
                        nextMenu === 3 &&
                        <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                            <h1 className="text-left font-bold text-[23px]">apelido para o pregão (nickname)</h1>

                            <div className="flex flex-col justify-start items-start">
                                <span>Apelido</span>
                                <input type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="w-[300px] h-[41px] p-2 border-[1px] 
                                border-white bg-transparent rounded-md" />
                            </div>

                            <button onClick={handleRegisterNewClient} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#1F8220]">
                                registrar</button>
                            <button onClick={() => setNextMenu(2)}>anterior</button>
                        </div>
                    }

                    <div className="flex flex-col justify-center items-center gap-1">
                        <img src={logoAukGreen} className="object-cover w-[100px]" />
                        <button onClick={() => navigate("/client/login")}>já tem uma conta? Entrar</button>
                    </div>
                </section>

            </section>

        </div>
    )
}

export default ClientRegister