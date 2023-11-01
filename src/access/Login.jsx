

function Login(){

    return(

        <div className="text-white w-full h-[100vh] bg-zinc-600 flex flex-col justify-center items-center gap-3">

            <span className="text-[22pt]">AUKT</span>

            <input type="text" className="bg-transparent border-b-[1px] border-white p-2" placeholder="email" />
            <input type="password" className="bg-transparent border-b-[1px] border-white p-2" placeholder="sua senha" />

            <button className="mt-6">login</button>
            <button className="absolute text-[14px] bottom-6">crie sua conta</button>

        </div>
    )
}

export default Login