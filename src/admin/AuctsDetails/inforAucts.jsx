function inforAucts () {
    return (
        <div className="flex  justify-start items-start gap-3 p-2">
          <img
            src=""
            alt="foto-perfil"
            className="w-[60px] h-[60px] bg-zinc-300 rounded-lg overflow-hidden"
          />
          <div className="flex flex-col text-[#424242] text-[14px] font-semibold">
            <span>12º leilão de instrumentos raros</span>
            <span>
              Promotor:{" "}
              <span className="text-[#00A3FF]">www.danstudio.com.br</span>
            </span>
            <span>
              Data do evento:{" "}
              <span className="text-[#00A3FF]">12/09/23</span>
            </span>
          </div>
        </div>
     
    )
}

export default inforAucts;