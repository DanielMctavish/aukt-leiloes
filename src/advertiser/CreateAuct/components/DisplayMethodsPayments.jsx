


function DisplayMethodsPayments(){

    return(
        <div className="w-[33%] h-[100%] bg-white 
        flex flex-col justify-around items-start
        rounded-md shadow-2xl shadow-[#00000039] p-3 relative">
            
            <h2 className="font-bold">Métodos de pagamento aceitos</h2>
            <span className="text-[14px]">forma de pagamento</span>

            <select name="" id="" className="bg-transparent p-3 border-[1px] border-zinc-400 w-[70%]">
                <option value="">cŕedito, débito e pix</option>
                <option value="">apenas pix</option>
                <option value="">apenas crédito</option>
                <option value="">apenas débito</option>
            </select>
        </div>
    )
}

export default DisplayMethodsPayments;