import { Settings } from "@mui/icons-material";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import NavAdvertiser from "../_navigation/NavAdvertiser";

function TransactionsDashboard() {
    return (
        <div className="w-full min-h-screen flex flex-col justify-start items-center bg-[#F4F4F4]">
            <AssideAdvertiser MenuSelected="menu-11" />

            <section className="w-full min-h-screen flex flex-col justify-start items-center gap-2 relative">
                <NavAdvertiser />

                <div className="flex flex-col lg:w-[80%] w-full h-[80vh] shadow-lg shadow-[#1919192d] bg-white rounded-lg mt-8 justify-center items-center">
                    <div className="flex flex-col items-center text-center p-8">
                        <div className="bg-blue-100 p-4 rounded-full mb-6">
                            <Settings className="text-blue-600 text-5xl" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Página em Construção</h1>
                        <p className="text-gray-600 max-w-lg text-lg mb-6">
                            Estamos trabalhando para implementar o sistema de transações. 
                            Em breve você poderá visualizar e gerenciar todas as suas transações financeiras nesta página.
                        </p>
                        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                        <p className="text-gray-500 mt-3">Progresso: 12%</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TransactionsDashboard;