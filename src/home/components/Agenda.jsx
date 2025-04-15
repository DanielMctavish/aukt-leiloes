import { useState, useEffect } from 'react';
import { Event, CalendarMonth, AddAlert, MoreVert } from '@mui/icons-material';
import Navigation from '../navigation/Navigation';

function Agenda() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('proximos');
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Dados fictícios para demonstração
  const proximosLeiloes = [
    {
      id: 1,
      titulo: "Veículos Premium",
      data: "15/07/2023",
      horario: "14:00",
      categoria: "Automóveis",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2536&auto=format&fit=crop"
    },
    {
      id: 2,
      titulo: "Imóveis Residenciais",
      data: "18/07/2023",
      horario: "10:00",
      categoria: "Imóveis",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2573&auto=format&fit=crop"
    },
    {
      id: 3,
      titulo: "Eletrônicos e Gadgets",
      data: "22/07/2023",
      horario: "16:30",
      categoria: "Tecnologia",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2701&auto=format&fit=crop"
    },
    {
      id: 4,
      titulo: "Arte Contemporânea",
      data: "25/07/2023",
      horario: "19:00",
      categoria: "Arte",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=2748&auto=format&fit=crop"
    }
  ];

  const leiloesAnteriores = [
    {
      id: 101,
      titulo: "Maquinário Industrial",
      data: "02/06/2023",
      horario: "10:00",
      categoria: "Equipamentos",
      imagem: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2670&auto=format&fit=crop"
    },
    {
      id: 102,
      titulo: "Joias e Relógios",
      data: "10/06/2023",
      horario: "15:00",
      categoria: "Luxo",
      imagem: "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=2670&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#012038] to-[#0D1733]">
      <Navigation />
      
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#001828] to-[#012038] text-white">
        <div className="container mx-auto py-20 px-4 md:px-8">
          <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Agenda de Leilões</h1>
            <p className="text-lg md:text-xl max-w-2xl opacity-90">Confira nossa programação de leilões e não perca as melhores oportunidades.</p>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto py-8 px-4 md:px-8">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button 
            className={`px-5 py-3 font-medium text-sm md:text-base transition-colors duration-200 ${activeTab === 'proximos' ? 'text-[#4ECDC4] border-b-2 border-[#4ECDC4]' : 'text-gray-300 hover:text-white'}`}
            onClick={() => setActiveTab('proximos')}
          >
            <div className="flex items-center">
              <CalendarMonth fontSize="small" className="mr-2" />
              Próximos Leilões
            </div>
          </button>
          <button 
            className={`px-5 py-3 font-medium text-sm md:text-base transition-colors duration-200 ${activeTab === 'anteriores' ? 'text-[#4ECDC4] border-b-2 border-[#4ECDC4]' : 'text-gray-300 hover:text-white'}`}
            onClick={() => setActiveTab('anteriores')}
          >
            <div className="flex items-center">
              <Event fontSize="small" className="mr-2" />
              Leilões Anteriores
            </div>
          </button>
        </div>
        
        {/* Leilões em destaque (apenas se estiver na aba "próximos") */}
        {activeTab === 'proximos' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Leilões em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proximosLeiloes.filter(leilao => leilao.destaque).map((leilao) => (
                <div 
                  key={leilao.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: '150ms' }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={leilao.imagem} 
                      alt={leilao.titulo} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-[#247557] text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                      Em Destaque
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-white">{leilao.titulo}</h3>
                      <span className="bg-[#012038]/50 text-[#4ECDC4] text-xs font-medium px-2.5 py-0.5 rounded">
                        {leilao.categoria}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300 mb-4">
                      <Event className="text-[#4ECDC4] mr-2" fontSize="small" />
                      <span>{leilao.data} às {leilao.horario}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <button className="text-[#4ECDC4] hover:text-white font-medium transition-colors">
                        Ver detalhes
                      </button>
                      <button className="flex items-center bg-[#012038]/50 hover:bg-[#012038]/70 text-[#4ECDC4] px-3 py-1 rounded-full text-sm transition-colors border border-[#4ECDC4]/30">
                        <AddAlert fontSize="small" className="mr-1" />
                        Lembrete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Lista de leilões */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {activeTab === 'proximos' ? 'Todos os Próximos Leilões' : 'Leilões Anteriores'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(activeTab === 'proximos' ? proximosLeiloes : leiloesAnteriores).map((leilao, index) => (
              <div 
                key={leilao.id}
                className={`bg-white/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-36 overflow-hidden">
                  <img 
                    src={leilao.imagem} 
                    alt={leilao.titulo} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-white">{leilao.titulo}</h3>
                    <button className="text-gray-300 hover:text-white">
                      <MoreVert fontSize="small" />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-300 mb-3 text-sm">
                    <Event className="text-[#4ECDC4] mr-2" fontSize="small" />
                    <span>{leilao.data} às {leilao.horario}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-[#012038]/50 text-gray-300 text-xs px-2 py-1 rounded border border-white/10">
                      {leilao.categoria}
                    </span>
                    {activeTab === 'proximos' ? (
                      <button className="text-[#4ECDC4] hover:text-white text-sm font-medium transition-colors">
                        Participar
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">Encerrado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA para cadastro */}
        <div className={`mt-16 bg-gradient-to-r from-[#012038] to-[#0d4e8e] rounded-lg p-8 text-white text-center transition-all duration-700 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold mb-4">Não perca nenhum leilão!</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">Cadastre-se para receber notificações sobre novos leilões e oportunidades exclusivas.</p>
          <button className="bg-[#247557] hover:bg-[#1a5740] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
            Cadastre-se Gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
}

export default Agenda;