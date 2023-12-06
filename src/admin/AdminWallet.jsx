import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import CardWallet from "./cards/cardWallet";
import Transactions from "./statics-elements/Transactions";

function AdminWallet() {
  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 overflow-hidden
        flex lg:flex-row flex-col justify-start items-start"
    >
      <AssideAdmin MenuSelected="menu-5" />
      <section className="w-full lg:h-[100vh] h-full flex flex-col justify-start items-center">
        <NavAdmin />

        <section className="w-[90%] h-[20vh] flex justify-center items-center gap-6">
          <div className="lg:w-[30%] w-full h-[84%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3 ">
            <div className="flex flex-col justify-start items-start gap-3 border-l-[4px] border-[#314B8E]">
              <span className="text-[16px] ml-3">Carteira</span>
              <span className="text-[22px] ml-3">R$ 20.000,00</span>
            </div>
            <span className="text-[#10A55C] text-[12px]">
              12,8% + em relação a semana anterior
            </span>
          </div>

          <div className="w-[60%] h-[80%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3 relative lg:inline hidden">
            <h2 className="bg-[#FA3A3A]/40 text-[#AF0000] p-1 rounded-full w-[80px] font-bold text-center">
              Live
            </h2>
          </div>
          <div className="lg:w-[14%] h-[80%] w-[40%]  bg-[#191F2F] text-[#FFFFFF] font-bold text-[12px] rounded-md shadow-lg shadow-[#17171722] p-3 relative flex justify-center items-center">
            <button>Transferir</button>
          </div>
        </section>

        <section className="w-[90%] h-auto flex lg:flex-row flex-col justify-center items-center gap-6 lg:mt-0 mt-4  lg:mb-0 mb-8">
          <div className="lg:w-[34%] w-full h-[auto] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3">
            <div className="flex justify-between">
              <span>Contas Bancárias registradas</span>
              <span>3/3</span>
            </div>
            <CardWallet />
          </div>
          <div className="lg:w-[70%] w-full h-[auto] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-2 relative ">
            <div className="flex border-b border-[#C9C9C9] p-2">
              <span>Transações bancárias</span>
            </div>
            <div>
              <Transactions />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminWallet;
