


function DisplayBalance() {

    return (

        < div className="w-full lg:w-[20%] lg:h-[90%]
        flex flex-col justify-center items-start 
        h-[40vh] bg-[#fff] rounded-md shadow-lg 
        shadow-[#17171722] p-3 mb-4 lg:mb-0" >
            <div className="flex flex-col justify-start items-start gap-3 border-l-[4px] border-[#314B8E] text-zinc-600">
                <span className="text-[16px] ml-3">Carteira</span>
                <span className="text-[22px] ml-3">R$ 20.000,00</span>
            </div>
            <span className="text-[#10A55C] text-[12px]">
                12,8% + em relação a semana anterior
            </span>
        </div >
    )
}

export default DisplayBalance;