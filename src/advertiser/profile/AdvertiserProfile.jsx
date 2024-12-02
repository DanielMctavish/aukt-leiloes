import NavAdvertiser from "../_navigation/NavAdvertiser";
import AssideAdvertiser from "../_asside/AssideAdvertiser";
import FormProfile from "./form/FormProfile";

function AdvertiserProfile() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#D8DEE8] to-[#e8edf4] text-zinc-600">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <AssideAdvertiser MenuSelected="menu-9" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navigation */}
          <NavAdvertiser path="Perfil" />

          {/* Content Area */}
          <main className="flex-1 p-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#012038] mb-8">
                Configurações do Perfil
              </h1>
              <FormProfile />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdvertiserProfile;
