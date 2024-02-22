import { ArrowDropDown } from "@mui/icons-material"
import TbodyAdvertiserAucts from "./tbody/TbodyAdvertiserAucts";

function TableAdvertiserAucts() {



  return (
    <section className="w-full flex flex-col justify-start items-center overflow-x-auto absolute">

      <div className="w-full flex justify-between items-center gap-1 text-[12px] p-2">


        <div className="flex items-center justify-between min-w-[70px] p-2">
          Nº
          <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2">
          Título <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2">
          ID-Leilão
          <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2">
          Anunciante <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2">
          Publicação <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2">
          Produtos <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2" >
          Status <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2" >
          Valor (Lucro) <ArrowDropDown />
        </div>

        <div className="flex items-center justify-between min-w-[180px] overflow-hidden p-2" >
          Previsão <ArrowDropDown />
        </div>

      </div>

      <TbodyAdvertiserAucts />
    </section>
  );
}

export default TableAdvertiserAucts;
