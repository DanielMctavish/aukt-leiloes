

function DisplayProductsCsv() {

    return (
        <div className="w-[33%] h-[100%]
        hover:z-[77] hover:scale-[1.02] transition-[1s]
        flex flex-col justify-center items-center 
        bg-white rounded-md relative
        shadow-2xl shadow-[#00000039] p-3">
            <h2 className="font-bold absolute top-3 left-3">Produtos</h2>

            <section className="flex gap-3 justify-center items-center">
                <span className="font-bold text-[63px]">10</span>
                <div className="flex flex-col">
                    <span>TOTAL</span>
                    <button>adicionar produto</button>
                </div>
            </section>
            <button className="p-1 w-[150px] h-[40px] bg-[#e8e8e8] rounded-md">importar CSV</button>

        </div>
    )
}

export default DisplayProductsCsv