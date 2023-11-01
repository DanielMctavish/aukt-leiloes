

function Register() {

    return (

        <div className="text-white w-full h-[100vh] bg-zinc-600 flex flex-col justify-center items-center gap-3">

            <span className="text-[22pt]">AUKT Registro</span>
            <input type="text" className="bg-transparent border-b-[1px] border-white p-2" placeholder="nome" />
            <input type="text" className="bg-transparent border-b-[1px] border-white p-2" placeholder="email" />
            <input type="password" className="bg-transparent border-b-[1px] border-white p-2" placeholder="criar senha" />
            <input type="password" className="bg-transparent border-b-[1px] border-white p-2" placeholder="confirmar senha" />

            <button className="mt-6">Registrar</button>
            <button className="absolute text-[14px] bottom-6">já tem uma conta?</button>

        </div>
    )
}

export default Register