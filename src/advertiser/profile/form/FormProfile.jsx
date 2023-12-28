

function FormProfile() {

    return (
        <div className="w-[96%] h-[90%] flex flex-col relative bg-white rounded-md overflow-hidden">

            <div className="w-full min-h-[239px] bg-gradient-to-r 
            from-[#012038] via-[#124A75] to-[#012038] relative">
                <span className="
                flex flex-col
                justify-center items-center
                w-[120px] h-[120px] 
                rounded-full absolute 
                bottom-[-6vh] left-[3vh]">
                    <img src="https://neofeed.com.br/wp-content/uploads/2019/12/Leonardo-Dicaprio-1.jpg" 
                    alt="avatar-profile"  className="w-[100px] h-[100px] object-cover rounded-full"/>
                    <span className="font-bold text-[#1b1b1b]">Daniel Arruda</span>
                </span>
            </div>

            <section className="w-full h-[100%] flex p-3 justify-around items-center">

                <div className="flex flex-col gap-3 h-[60%] justify-between">
                    <input type="text" placeholder="Primeiro Nome" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="Telefone" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="Estado" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="Endereço" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                </div>

                <div className="flex flex-col gap-3 h-[60%] justify-between">
                    <input type="text" placeholder="Segundo Nome" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="CPF" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="Email" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                    <input type="text" placeholder="Cidade" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                </div>

                <div className="flex flex-col gap-3 h-[60%] justify-between">
                    <input type="text" placeholder="Nickname - pregão" className="p-2 w-[270px] h-[34px] bg-transparent border-[1px] border-[#D3D3D3]" />
                </div>

            </section>

        </div>
    )
}

export default FormProfile;