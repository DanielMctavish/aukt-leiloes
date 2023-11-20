

export const Navigation = ()=>{

    return(
        <div className="
        w-[283px] h-[90vh] 
        lg:relative absolute bg-[#012038] 
        lg:left-auto left-1 rounded-lg 
        flex flex-col 
        justify-start items-center p-3 gap-3">

            <button className="bg-[#262626] w-[99%] p-3 rounded-lg text-[14px]">Importar Produtos</button>
            <button className="bg-[#022A33] w-[99%] p-3 rounded-lg text-[14px]">Cadastrar um produto</button>
            <button className="bg-[#022A33] w-[99%] p-3 rounded-lg text-[14px]">Todos os Produtos</button>
            <button className="bg-[#022A33] w-[99%] p-3 rounded-lg text-[14px]">Financeiro</button>
            <button className="bg-[#022A33] w-[99%] p-3 rounded-lg text-[14px]">Agenda de leilões</button>
            <button className="bg-[#022A33] w-[99%] p-3 rounded-lg text-[14px]">configurações</button>
            
        </div>
    )
}