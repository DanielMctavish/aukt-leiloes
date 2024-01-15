import { useState } from "react"
import { useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


function AdvertiserRegister() {
    const refName = useRef()
    const refCpf = useRef()
    const refNickname = useRef()
    const refEmail = useRef()
    const refPassword = useRef()
    const refPasswordConfirm = useRef()
    const [fakeUrl, setFakeUrl] = useState()
    //address fields
    const refState = useRef()
    const refCity = useRef()
    const refStreet = useRef()
    const refNumber = useRef()
    const refCep = useRef()

    const [messageDisplay, setMessageDisplay] = useState("")

    const navigate = useNavigate()

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
            nickname: refNickname.current.value,
            email: refEmail.current.value,
            password: refPassword.current.value,
            url_fake_cover: fakeUrl,
            url_profile_cover: fakeUrl,
            address: JSON.stringify(addressInformations)
        }).then((res) => {

            setMessageDisplay("Usuário criado com sucesso!")
            console.log(res.data);
            navigate("/advertiser/login")

        }).catch(err => {
            console.log(err.response);
        })
    }

    const handleSelectFakeAvatar = (event) => {

        setFakeUrl(event.target.src)

        const allImgs = document.querySelectorAll("#all-profile-imgs img")

        allImgs.forEach(img => {
            img.style.border = 'none'
        })

        const currentProfile = document.getElementById(event.target.id)
        currentProfile.style.border = "3px solid white"
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
                        <span>nickname</span>
                        <input ref={refNickname} type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
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
                    <span className="font-bold">Avatar Provisório</span>

                    <div className="flex gap-3 justify-center items-center" id="all-profile-imgs">

                        <img id="batman" src="https://i.pinimg.com/474x/d6/e2/b9/d6e2b92c45c41819cbd4000bb447c50e.jpg" alt="avatar-batman"
                            onClick={handleSelectFakeAvatar}
                            className="w-[63px] h-[63px] object-cover rounded-full cursor-pointer hover:w-[73px] hover:h-[73px] transition-all" />
                        <img id="iron-man" src="https://pbs.twimg.com/profile_images/1347424672808275968/DAdlTKTM_400x400.jpg" alt="avatar-batman"
                            onClick={handleSelectFakeAvatar}
                            className="w-[63px] h-[63px] object-cover rounded-full cursor-pointer hover:w-[73px] hover:h-[73px] transition-all" />
                        <img id="wonder" src="https://avatarfiles.alphacoders.com/249/249759.jpg" alt="avatar-batman"
                            onClick={handleSelectFakeAvatar}
                            className="w-[63px] h-[63px] object-cover rounded-full cursor-pointer hover:w-[73px] hover:h-[73px] transition-all" />
                        <img id="spider" src="https://cdn.openart.ai/uploads/image_kPtAojaB_1692809575664_512.webp" alt="avatar-batman"
                            onClick={handleSelectFakeAvatar}
                            className="w-[63px] h-[63px] object-cover rounded-full cursor-pointer hover:w-[73px] hover:h-[73px] transition-all" />

                    </div>

                    <span className="font-bold">Endereço</span>
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

                    <div className="flex flex-col justify-start items-start">
                        <span>Cep</span>
                        <input ref={refCep} type="text" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                    </div>

                </div>

            </section>

        </div>
    )
}

export default AdvertiserRegister