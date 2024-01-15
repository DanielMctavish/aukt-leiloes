/* eslint-disable react-hooks/exhaustive-deps */
import {Lock} from "@mui/icons-material"
import axios from "axios"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [messageDisplay,setMessageDisplay] = useState("")
    const refEmail = useRef()
    const refPassword = useRef()

    const navigate = useNavigate()

    useEffect(()=>{
        const currentAdminSession = localStorage.getItem("auct-admin-session")
        if(currentAdminSession){
            navigate("/admin/dashboard")
        } 
    },[])

    const loginUser = async () => {

        if(!refEmail.current.value || !refPassword.current.value){
            setMessageDisplay("Preencha todos os campos")
            return  
        }

        await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/admin/login`, {
            email: refEmail.current.value,
            password: refPassword.current.value
        }).then(response => {

            const JsonString = JSON.stringify({
                token: response.data.token,
                email: response.data.user.email,
                name: response.data.user.name,
                id: response.data.user.id
            })

            localStorage.setItem('auct-admin-session',JsonString)
           
            setMessageDisplay("logado com sucesso! Bem vindo")
            navigate("/admin/dashboard")

        }).catch(err => {

            if(err.response.status === 404){
                setMessageDisplay("usuário não encontrado")
            }else if(err.response.status === 500){
                setMessageDisplay("Internal server error")
            }else if(err.response.status === 401){
                setMessageDisplay("email ou senha inválido")
            }   
            
            console.log('erro ao tentar logar -->',err.response)
        })
    }



    return (
        <div className="w-full h-[100vh] gap-3 bg-[#1d1d1d] 
        flex flex-col justify-center 
        items-center text-white">

            <span className="absolute top-2">{messageDisplay}</span>
            <h2 className="flex gap-2"><Lock/>login ADM</h2>
            <input ref={refEmail} type="email" placeholder="seu email" className="p-2 rounded-md text-zinc-600" />
            <input ref={refPassword} type="password" className="p-2 rounded-md text-zinc-600" />
            <button onClick={loginUser}>Logar</button>

        </div>
    )
}

export default AdminLogin;