import { useEffect, useState } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import TimerComponent from "./statics-elements/TimerComponent";
import PanelGraph from "./panels/PanelGraph";
import LastAuctsTable from "./tables/LastAuctsTable";

// import PanelLives from "./panels/PanelLives"
// import PanelUsers from "./panels/PanelUsers"
// import { Money, People, MonetizationOn } from "@mui/icons-material"

function AdminDashboard() {
  const [usersCount, setUsersCount] = useState({});
  const [usersPorcentage, setUsersPorcentage] = useState({
    porcentageAdvertiser: "",
    porcentageClients: "",
    porcentageAdms: "",
  });
  const [totalUsers, setTotalUsers] = useState();

  useEffect(() => {
    // INPUT DO GRAFICO CIRCULAR................................................
    GetStaticUsers(800, 50100, 200);
  }, []);

  const GetStaticUsers = (advertisers, clients, adms) => {
    setUsersCount({
      advertisers,
      clients,
      adms,
    });

    const totalUsers = advertisers + clients + adms;
    const porcentage_advertisers = (advertisers / totalUsers) * 100;
    const porcentage_clients = (clients / totalUsers) * 100;
    const porcentage_adms = (adms / totalUsers) * 100;

    setUsersPorcentage({
      porcentageAdvertiser: porcentage_advertisers,
      porcentageClients: porcentage_clients,
      porcentageAdms: porcentage_adms,
    });

    setTotalUsers(totalUsers);
  };

  return (
    <div
      className="w-full lg:h-[100vh] h-auto 
        bg-[#D8DEE8] text-zinc-600 lg:overflow-x-hidden custom-scrollbar overflow-x-auto
        flex justify-start items-start lg:flex-row flex-col"
    >
      <AssideAdmin MenuSelected="menu-1" />
      <section className="w-full h-[100vh] flex flex-col justify-start items-center">
        <NavAdmin />

        <section className="lg:w-[90%] w-full h-[20vh] flex justify-center items-center lg:gap-6 lg:pt-0 pt-10 flex-col lg:flex-wrap mb-7 lg:mb-0">
          {/* Display Saldo */}
          <div className="w-[80%] lg:w-[30%] lg:h-[90%] h-[40vh]  bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3 mb-4 lg:mb-0">
            <div className="flex flex-col justify-start items-start gap-3 border-l-[4px] border-[#314B8E]">
              <span className="text-[16px] ml-3">Carteira</span>
              <span className="text-[22px] ml-3">R$ 20.000,00</span>
            </div>
            <span className="text-[#10A55C] text-[12px]">
              12,8% + em relação a semana anterior
            </span>
          </div>

          {/* Display Ao vivo */}
          <div className="w-[70%] h-[90%] bg-[#fff] rounded-md shadow-lg shadow-[#17171722] p-3 relative lg:block hidden">
            <h2 className="bg-[#FA3A3A]/40 text-[#AF0000] p-1 rounded-full w-[80px] font-bold text-center">
              ao vivo
            </h2>
          </div>
        </section>

        <section className="lg:w-[90%] w-full lg:h-[60vh] h-full flex justify-center items-center lg:gap-6 flex-col lg:flex-wrap lg:mt-0 mt-3 ">
          {/* Círculo de estatística */}
          <div className="w-[80%] lg:w-[40%] h-full mt-3 bg-[#fff] rounded-md shadow-lg shadow-[#17171722] relative flex flex-row">
            <div>
              <TimerComponent
                advertiser_percentage={usersPorcentage.porcentageAdvertiser}
                clients_percentage={usersPorcentage.porcentageClients}
                adms_percentage={usersPorcentage.porcentageAdms}
                totalUsers={totalUsers}
              />
            </div>

            <div>
              <div className="w-full flex flex-col justify-start gap-3 lg:mt-6 mt-12 lg:ml-4 ml-3 lg:p-6 p-3">
                <div className="w-full flex flex-col justify-start gap-3 lg:text-[14px] text-[12px] ">
                  <span className="lg:inline hidden">
                    Anunciantes -{" "}
                    <span>
                      {typeof usersPorcentage.porcentageAdvertiser === "number"
                        ? usersPorcentage.porcentageAdvertiser.toFixed(1)
                        : ""}
                    </span>
                    %
                  </span>
                  <li className="text-[#000000] ml-3">
                    {usersCount.advertisers}
                  </li>
                </div>

                <div className="w-full flex flex-col justify-start gap-3 text-[14px]">
                  <span>
                    Clientes{" "}
                    <span className="lg:inline hidden">
                      -
                      {typeof usersPorcentage.porcentageClients === "number"
                        ? usersPorcentage.porcentageClients.toFixed(1)
                        : ""}
                      %
                    </span>
                  </span>
                  <li className="text-[#6400C8] ml-3">{usersCount.clients}</li>
                </div>

                <div className="w-full flex flex-col justify-start gap-3 text-[14px]">
                  <span>
                    Administradores{" "}
                    <span className="lg:inline hidden">
                      {typeof usersPorcentage.porcentageAdms === "number"
                        ? usersPorcentage.porcentageAdms.toFixed(1)
                        : ""}
                      %
                    </span>
                  </span>
                  <li className="text-[#D87400] ml-3">{usersCount.adms}</li>
                </div>
              </div>
            </div>
          </div>
          {/* Gráfico */}
            <div className="lg:w-[60%] w-full lg:h-[94%] h-full bg-[#fff] rounded-md shadow-lg shadow-[#17171722] lg:mt-0 mt-6 lg:ml-0 ml-16 ">
              <PanelGraph />
            </div>
        </section>

        <section className="lg:w-[90%] w-full lg:h-[40vh]  h-full  flex flex-col lg:justify-start lg:items-start lg:flex-wrap lg:mt-0 lg:ml-0 ml-16">
          {/* Tabela de Ultimos Leilões realizados */}
          <div
            className="w-full lg:h-[80%] h-auto lg:mt-7 mt-10 bg-[#fff] rounded-md 
                    shadow-lg shadow-[#17171722] flex 
                    flex-col justify-start items-center  lg:mb-0 mb-6"
          >
            <div className="w-full p-3">
              <h2>Últimos leilões realizados.</h2>
            </div>
            {/* INPUT INFORMAÇÔES DE TABELAS */}
            <div
              className="lg:w-[98%] w-full lg:max-h-[40vh] max-h-[full] lg:overflow-y-auto custom-scrollbar bg-[#fff] rounded-b
                    shadow-lg shadow-[#17171722]"
            >
              <LastAuctsTable />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;
