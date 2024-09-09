import { useState } from "react"


function FloorMessageSet() {
    const [currentMessage, setMessage] = useState('digite aqui sua mensagem...')

    return (
        <div className="flex lg:w-[50%] w-full h-full p-3 bg-white rounded-md">
            <div className="flex flex-col w-full h-full bg-white rounded-md 
            overflow-hidden shadow-lg shadow-[#12121244] justify-start items-center relative">
                <span className="flex justify-start items-center w-full h-[46px] bg-[#012038] text-white p-2 font-bold text-[14px]">
                    Mensagem Pregão
                </span>

                <textarea onChange={(e) => setMessage(e.target.value)} value={currentMessage}
                    className="w-[98%] h-[70%] bg-[#dedede] mt-[2vh] rounded-md p-2">
                </textarea>

                <button className="bg-[#012038] text-white p-2 font-bold rounded-md absolute bottom-2 left-2">enviar mensagem</button>

            </div>
        </div>
    )
}

export default FloorMessageSet