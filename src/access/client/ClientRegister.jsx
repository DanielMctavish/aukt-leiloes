import axios from "axios"
import bgRegister from "../../media/backgrounds/social_bg_wall.jpg"
import { useRef, useState } from "react"

function ClientRegister() {
    const [name, setName] = useState('')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const refCep = useRef()
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()
    const refNumber = useRef()


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
            address: JSON.toString({
                cep: refCep.current.value,
                state: refState.current.value,
                city: refCity.current.value,
                street: refStreet.current.value,
                number: refNumber.current.value
            })
        }).then(response => {

            console.log(response);
            setIsCreating(false)

        }).catch(err => {

            console.log(err)
            setIsCreating(false)

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

            <section className="w-[80%] h-[90vh] 
            flex flex-col bg-[#1f8221ca] rounded-[4px]
            justify-center items-center backdrop-blur-md
            relative overflow-hidden shadow-2xl p-2">

                <section className="flex w-full h-full justify-center items-center">

                    <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                        <h1 className="text-left font-bold text-[33px] w-[300px]">REGISTRE-SE!</h1>

                        <div className="flex flex-col justify-start items-start">
                            <span>nome</span>
                            <input onChange={(e) => setName(e.target.value)} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>

                        <div className="flex flex-col justify-start items-start">
                            <span>CPF</span>
                            <input onChange={(e) => setCpf(e.target.value)} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>

                        <div className="flex flex-col justify-start items-start">
                            <span>email</span>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>

                        <div className="flex flex-col justify-start items-start">
                            <span>senha</span>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>

                        <div className="flex flex-col justify-start items-start">
                            <span>confirmar senha</span>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                        </div>

                    </div>

                    <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                        <h1 className="text-left font-bold text-[33px] w-[300px]">Seu Endereço</h1>

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

                        <button onClick={handleRegisterNewClient} className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#1F8220]">registrar</button>
                        <button>já tem uma conta? Entrar</button>

                    </div>

                </section>

            </section>

        </div>
    )
}

export default ClientRegister