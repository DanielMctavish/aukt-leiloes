

function CenterFloor() {

    return (
        <section className="w-full h-full flex 
        justify-center items-center rounded-[22px] bg-[#d2d2d2ad] 
        backdrop-blur-lg shadow-xl shadow-[#1414143a] 
        border-b-[2px] border-[#e3e3e3] z-[2] p-3 gap-3">

            <div className="w-[40%] h-[80%] flex flex-col relative justify-center items-center gap-2">

                <img src="https://http2.mlstatic.com/D_NQ_NP_687960-MLU72010442633_092023-O.webp" alt=""
                    className="w-full h-full object-cover rounded-[2px]" />

            </div>

            <div className="w-[50%] h-[80%] flex flex-col justify-start items-center p-1 bg-[#393939] gap-1">
                <h1 className="font-bold text-[44px] text-white drop-shadow-lg">TÍTULO DO LEILÃO | AO VIVO</h1>

                <section className="flex w-[90%] justify-end h-[100px] relative">

                    <div className="flex justify-end items-end bg-[#135680] 
                    w-[80%] h-full rounded-md text-white text-[26px] p-2">
                        <p className="text-right">
                            peças relevantes e raras no mundo das miniaturas.
                        </p>
                    </div>

                </section>

                <section className="w-[90%] h-[50%] overflow-y-auto">
                    <p className="text-white drop-shadow-md shadow-[#0c0c0c99]">
                        Prepare-se para um evento emocionante! Nesta noite, às 19:00, teremos um leilão imperdível de miniaturas de carros raros e exclusivos. Se você é um colecionador apaixonado por automóveis, esta é a sua chance de adquirir peças únicas para a sua coleção.

                        Entre os destaques do leilão estão modelos clássicos e contemporâneos, em perfeito estado de conservação e com detalhes incríveis. Os entusiastas de carros antigos encontrarão modelos vintage que remontam décadas de história automotiva, enquanto os fãs de carros modernos poderão disputar modelos mais recentes e colecionáveis.

                        O leilão será conduzido por um experiente leiloeiro, garantindo que cada lance seja emocionante e justo. Não perca a oportunidade de participar deste evento único e levar para casa uma miniatura que irá encantar e impressionar qualquer colecionador de carros.

                        O evento acontecerá em nosso salão de leilões, localizado na [endereço]. As inscrições começam às 18:00 e o leilão terá início pontualmente às 19:00. Venha fazer parte desta experiência incrível e quem sabe sair daqui com a miniatura dos seus sonhos. Esperamos por você!
                    </p>
                </section>

            </div>

        </section>
    )
}

export default CenterFloor;