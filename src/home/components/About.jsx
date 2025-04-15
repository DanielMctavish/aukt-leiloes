import { useState, useEffect } from 'react';
import { Business, LocalAtm, Group, History, Phone } from '@mui/icons-material';
import Navigation from '../navigation/Navigation';

function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    {
      icon: <Business />,
      title: "Quem Somos",
      color: "#012038",
      content: "A Aukt Leilões é uma empresa especializada em leilões online, oferecendo uma plataforma moderna e segura para compradores e vendedores interagirem de forma transparente. Fundada com o objetivo de revolucionar o mercado de leilões no Brasil, a Aukt proporciona experiências de compra e venda acessíveis e confiáveis."
    },
    {
      icon: <LocalAtm />,
      title: "Nossa Missão",
      color: "#247557",
      content: "Facilitar transações através de leilões online transparentes e seguros, conectando vendedores a potenciais compradores de maneira eficiente e com o máximo de valor para ambas as partes. Nossa plataforma foi desenvolvida para proporcionar uma experiência prática e intuitiva."
    },
    {
      icon: <Group />,
      title: "Nossa Equipe",
      color: "#0d4e8e",
      content: "Contamos com uma equipe diversificada de profissionais especializados em tecnologia, atendimento ao cliente, finanças e legislação específica para leilões. Nossos colaboradores estão sempre em constante atualização para oferecer o melhor serviço possível."
    },
    {
      icon: <History />,
      title: "Nossa História",
      color: "#4ECDC4",
      content: "A Aukt Leilões surgiu da necessidade de modernizar o setor de leilões no Brasil. Desde nossa fundação, buscamos unir tecnologia de ponta com a tradição e seriedade que o mercado de leilões exige. Ao longo dos anos, expandimos nossas operações e hoje somos referência no segmento."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#012038] to-[#0D1733]">
      <Navigation />
      
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#001828] to-[#012038] text-white">
        <div className="container mx-auto py-20 px-4 md:px-8">
          <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Sobre a Aukt Leilões</h1>
            <p className="text-lg md:text-xl max-w-2xl opacity-90">Conheça nossa história, valores e missão. Uma plataforma moderna de leilões, conectando pessoas e oportunidades.</p>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto py-12 px-4 md:px-8">
        {/* Seções informativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <div 
              key={index}
              className={`bg-white/5 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-white/10 mr-4 group-hover:scale-110 transition-transform duration-300" style={{ color: section.color }}>
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Contato */}
        <div className={`bg-gradient-to-r from-[#012038] to-[#0d4e8e] rounded-lg p-8 text-center transition-all duration-700 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block p-3 bg-white/10 rounded-full mb-4 text-[#4ECDC4]">
            <Phone fontSize="large" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Entre em Contato</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Estamos à disposição para atender suas dúvidas e sugestões sobre nossa plataforma de leilões.</p>
          <a 
            href="mailto:contato@auktleiloes.com.br" 
            className="inline-block bg-[#247557] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#1a5740] transition-colors duration-300"
          >
            Envie uma mensagem
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;