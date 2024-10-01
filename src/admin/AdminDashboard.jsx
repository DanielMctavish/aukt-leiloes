/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import AssideAdmin from "./asside/AssideAdmin";
import NavAdmin from "./navigation/NavAdmin";
import { useNavigate } from "react-router-dom";
import { Money, People, MonetizationOn } from "@mui/icons-material"; // Importando ícones do MUI

// Dados fictícios para os anunciantes
const advertisers = [
  { id: "1", name: "João Silva", CPF: "123.456.789-00", company_name: "João's Company", amount: 1000 },
  { id: "2", name: "Maria Oliveira", CPF: "987.654.321-00", company_name: "Maria's Business", amount: 2000 },
  { id: "3", name: "Carlos Pereira", CPF: "456.789.123-00", company_name: "Carlos Inc.", amount: 1500 },
  { id: "4", name: "Marta Costa", CPF: "321.654.987-00", company_name: "Mar's Solutions", amount: 2500 },
  { id: "5", name: "Lucas Santos", CPF: "654.321.987-00", company_name: "Lucas Tech", amount: 3000 },
  { id: "6", name: "Fernanda Lima", CPF: "789.123.456-00", company_name: "Fernanda's Services", amount: 1800 },
  { id: "7", name: "Roberto Almeida", CPF: "159.753.486-00", company_name: "Roberto's Ventures", amount: 2200 },
];

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminLocal = JSON.parse(localStorage.getItem('auct-admin-session'));

    if (!adminLocal) {
      navigate("/admin/login");
    }
  }, []);

  return (
    <div
      className="w-full lg:h-[100vh] h-auto
        bg-[#D8DEE8] text-zinc-600 lg:overflow-x-hidden custom-scrollbar overflow-x-auto
        flex justify-start items-start lg:flex-row flex-col"
    >
      <AssideAdmin MenuSelected="menu-1" />
      <section className="w-full h-full flex flex-col justify-start items-center overflow-y-auto p-4">
        <NavAdmin />

        {/* section body */}
        <section className="w-full h-full flex flex-wrap justify-around items-start bg-[#e8e8e8]">
          {/* Painel Saldo */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] 
            flex flex-col justify-start items-center p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <Money className="text-[#314B8E] mb-2" fontSize="large" />
            <div className="flex flex-col justify-start items-start gap-3 border-l-[4px] border-[#314B8E]">
              <span className="text-[16px] ml-3">Carteira</span>
              <span className="text-[22px] ml-3">R$ 20.000,00</span>
            </div>
          </div>

          {/* Painel Anunciante */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] 
            flex flex-col justify-start items-center p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <People className="text-[#314B8E] mb-2" fontSize="large" />
            <div className="flex flex-row justify-around items-center w-full mt-2">
              <div className="flex flex-col items-center">
                <span className="text-[16px]">Anunciantes</span>
                <span className="text-[22px]">8</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[16px]">Clientes</span>
                <span className="text-[22px]">8</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[16px]">Produtos</span>
                <span className="text-[22px]">887</span>
              </div>
            </div>
          </div>

          {/* Nova Seção: Estatísticas */}
          <div className="w-[80%] lg:w-[30%] h-[30%] bg-[#fff] p-3 rounded-md shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center">Estatísticas</h2>
            <div className="flex justify-around mt-4">
              <div className="flex flex-col items-center">
                <MonetizationOn className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Total Vendas</span>
                <span className="text-[22px]">R$ 50.000,00</span>
              </div>
              <div className="flex flex-col items-center">
                <People className="text-[#314B8E]" fontSize="large" />
                <span className="text-[16px]">Total Clientes</span>
                <span className="text-[22px]">150</span>
              </div>
            </div>
          </div>

          {/* Lista de Anunciantes */}
          <div className="w-full bg-[#fff] p-3 rounded-md 
          flex justify-center items-center flex-col
          shadow-lg shadow-[#17171722] m-2">
            <h2 className="text-center font-bold">Todos Anunciantes - Lista</h2>
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Nome</th>
                  <th className="p-2 text-left">CPF</th>
                  <th className="p-2 text-left">Nome da Empresa</th>
                  <th className="p-2 text-left">Valor</th>
                </tr>
              </thead>
              <tbody>
                {advertisers.map(advertiser => (
                  <tr key={advertiser.id} className="border-b hover:bg-[#194b81] cursor-pointer hover:text-[#fff]">
                    <td className="p-2">{advertiser.name}</td>
                    <td className="p-2">{advertiser.CPF}</td>
                    <td className="p-2">{advertiser.company_name}</td>
                    <td className="p-2">R$ {advertiser.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="bg-[#e8e8e8] p-2 mt-[2vh] text-[#464646] rounded-md">ver mais</button>
          </div>

          {/* Botões de Ação */}
          <div className="w-[80%] lg:w-[30%] flex justify-around items-center m-2">
            <button className="bg-[#032c3c] text-white p-2 rounded">Criar Novo Anunciante</button>
            <button className="bg-green-500 text-white p-2 rounded">Criar Novo Cliente</button>
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;
