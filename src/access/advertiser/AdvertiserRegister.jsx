

function AdvertiserRegister() {

    return (

        <div className="text-white w-full h-[100vh] bg-[#F4F4F4] flex flex-col justify-center items-center gap-3">

        <section className="w-[80%] h-[90vh] 
        flex bg-[#012038] rounded-[4px]
        justify-center items-center 
        relative overflow-hidden shadow-2xl">
            <div className="w-[50%] h-[100%] flex flex-col justify-center items-center gap-6 relative">
                <h1 className="text-left font-bold text-[33px] w-[300px]">REGISTRE-SE!</h1>

                <div className="flex flex-col justify-start items-start">
                    <span>nome</span>
                    <input type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                </div>

                <div className="flex flex-col justify-start items-start">
                    <span>email</span>
                    <input type="email" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                </div>

                <div className="flex flex-col justify-start items-start">
                    <span>senha</span>
                    <input type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                </div>

                <div className="flex flex-col justify-start items-start">
                    <span>confirmar senha</span>
                    <input type="password" className="w-[300px] h-[41px] p-2 border-[1px] border-white bg-transparent rounded-md" />
                </div>

                <button className="w-[300px] h-[41px] p-2 bg-white rounded-md text-[#012038]">registrar</button>
                <button>já tem uma conta? Entrar</button>
            </div>
        </section>

    </div>
    )
}

export default AdvertiserRegister