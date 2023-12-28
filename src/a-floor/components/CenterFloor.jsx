import {AccountCircle} from "@mui/icons-material"


function CenterFloor() {

    return (
        <section className="w-full h-[100%] flex justify-center items-center">

            <div className="w-[50%] h-[100%] flex flex-col relative justify-center items-center gap-2">
                <h2>Miniatura Ferrari</h2>

                <div className="w-[80%] h-[80%] relative fex justify-center items-center overflow-hidden p-2 rounded-md">

                    <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                        className="w-full h-full object-cover rounded-md" />

                    <section className="w-full h-[130px] flex justify-start items-center gap-3 p-2 absolute bottom-0 overflow-x-auto">

                        <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                            className="w-[100px] h-[100px] object-cover rounded-md shadow-md" />

                        <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                            className="w-[100px] h-[100px] object-cover rounded-md shadow-md" />

                        <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                            className="w-[100px] h-[100px] object-cover rounded-md shadow-md" />

                    </section>

                </div>

            </div>

            <div className="w-[40%] h-[100%] flex flex-col justify-center items-center p-1">

                <div className="w-full flex flex-col gap-3">
                    <span className="text-[#191F2F] font-bold">1/100 - Lotes</span>

                    <span className="w-full h-[17px] bg-white rounded-md relative">
                        <span className="w-[70%] h-[17px] flex bg-[#00D42F] rounded-md relative"></span>
                    </span>
                </div>

                <div className="w-full flex flex-col justify-start items-start gap-3">
                    <span className="text-[#9D9D9D] font-bold text-[16px]">Ranked - Arremates</span>

                    <div className="w-full h-[140px] rounded-md bg-white shadow-md flex justify-around items-center relative">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <AccountCircle style={{fontSize:'60px'}}/>
                            <span>Daniel Arruda</span>
                        </div>
                        <div className="w-[60%] h-[80%] bg-[#C8CCD3] flex rounded-md">

                        </div>
                    </div>

                </div>

            </div>

        </section>
    )
}

export default CenterFloor;