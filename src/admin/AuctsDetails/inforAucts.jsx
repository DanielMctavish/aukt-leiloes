function inforAucts () {

  const inforArray = [
    {
      img: "",
      title: "12º leilão de instrumentos raros",
      tipo: "Promotor:",
      site: "www.danstudio.com.br",
      data: "12/09/23",
    }
  ];

    return (
      
        <div>
          {inforArray.map((auction, index) => (
            <div key={index} className="flex  justify-start items-start gap-3 p-2">
          <img
            src={auction.img}
            alt="foto-perfil"
            className="w-[60px] h-[60px] bg-zinc-300  overflow-hidden shadow-sm shadow-zinc-600 rounded-full"
          />
          <div className="flex flex-col text-[#424242] text-[14px] font-semibold">
            <span>{auction.title}</span>
            <span>
              {auction.tipo}
              <span className="text-[#00A3FF] ml-2">{auction.site}</span>
            </span>
            <span>
              Data do evento:{" "}
              <span className="text-[#00A3FF]">{auction.data}</span>
            </span>
          </div>
          </div>
           ))}
        </div>
     
     
    )
}

export default inforAucts;