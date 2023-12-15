import { PhotoCamera } from "@mui/icons-material"

function DisplayCreateEvent() {

    return (
        <div className="w-[30%] h-[100%] bg-white rounded-md p-2
        hover:z-[77] hover:scale-[1.02] transition-[1s]  
        shadow-2xl shadow-[#00000039] relative">
            <h2 className="font-bold absolute left-2 top-2">Criação de Evento</h2>

            <section className="w-full h-[20%] flex flex-col gap-2 justify-center items-center mt-4">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Títullo do leilão</span>
                    <input type="text" className="w-full h-[40px] p-2 border-[1px] border-zinc-300 bg-transparent" />
                </div>
            </section>

            <section className="w-full h-[26%] flex flex-col gap-2 justify-center items-center">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Títullo do leilão</span>
                    <select name="" id="" className="w-full bg-transparent h-[40px] p-2 border-[1px] border-zinc-300">
                        <option value="">miniaturas</option>
                        <option value="">relíquias</option>
                        <option value="">espadas</option>
                        <option value="">brinquedos</option>
                    </select>
                </div>
            </section>

            <section className="w-full h-[30%] flex flex-col gap-2 justify-center items-center mt-6">
                <div className="w-[80%] flex flex-col gap-3">
                    <span>Capa do leilão</span>
                    <div className="w-full h-[20vh] border-[1px] border-zinc-300 rounded-lg flex justify-center items-center cursor-pointer">
                        <PhotoCamera style={{ fontSize: '60px' }} />
                    </div>
                </div>
            </section>

        </div>
    )
}

export default DisplayCreateEvent;