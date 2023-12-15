




function DisplayLimitations(){

    return(
        <div className="w-[33%] h-[100%] bg-white 
        rounded-md shadow-2xl shadow-[#00000039] 
        p-3 relative flex flex-col justify-around">
            <h2 className="font-bold">Limitações</h2>
            <span className="text-[14px]">limitar participantes</span>
            <input type="number" className="bg-transparent p-3 border-[1px] border-zinc-400 w-[70%]"/>
        </div>
    )
}

export default DisplayLimitations;