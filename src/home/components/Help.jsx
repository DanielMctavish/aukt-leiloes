import { useState, useEffect } from 'react';
import { HelpOutline, KeyboardArrowDown, KeyboardArrowUp, Email, WhatsApp, Chat, KeyboardArrowRight } from '@mui/icons-material';
import Navigation from '../navigation/Navigation';

function Help() {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Dados das FAQs
  const faqs = [
    {
      id: 1,
      pergunta: "Como funciona o processo de leilão na plataforma?",
      resposta: "Na Aukt Leilões, o processo é simples e transparente. Primeiro você precisa se cadastrar na plataforma e verificar sua identidade. Depois, pode explorar os leilões disponíveis, estudar os lotes, fazer seus lances e, caso seja o vencedor, seguir as instruções para pagamento e retirada dos itens arrematados. Nossa plataforma utiliza tecnologia avançada para garantir a segurança e a lisura de todas as operações."
    },
    {
      id: 2,
      pergunta: "Qual é o valor da comissão para compradores?",
      resposta: "A comissão padrão para compradores é de 5% sobre o valor da arrematação. Esta taxa é automaticamente calculada e incluída no valor final a ser pago após o arremate. Em alguns leilões especiais, a comissão pode variar, mas isso será sempre informado claramente na descrição do leilão antes que você faça seu lance."
    },
    {
      id: 3,
      pergunta: "Como posso anunciar meus produtos para leilão?",
      resposta: "Para anunciar seus produtos, você precisa se cadastrar como anunciante na plataforma. Após a aprovação do cadastro, você poderá criar seus leilões, adicionar descrições detalhadas e fotos dos itens, definir preços mínimos e agendar a data do leilão. Nossa equipe está disponível para auxiliar em todo o processo e garantir que seus produtos tenham a melhor exposição possível."
    },
    {
      id: 4,
      pergunta: "Qual a garantia de que receberei o produto que arrematei?",
      resposta: "A Aukt Leilões funciona como intermediária entre vendedores e compradores, garantindo a segurança de ambas as partes. O valor pago pelo arrematante só é repassado ao vendedor após a confirmação de que o produto foi entregue conforme descrito. Caso haja qualquer discrepância, nossa política de proteção ao comprador assegura a devolução do valor ou a solução do problema."
    },
    {
      id: 5,
      pergunta: "Como funciona o sistema de pagamento?",
      resposta: "Oferecemos diversas opções de pagamento, incluindo cartão de crédito, boleto bancário, transferência PIX e carteiras digitais. Os pagamentos são processados através de plataformas seguras, e você receberá recibos e comprovantes de todas as transações. O prazo para pagamento após a arrematação é de 24 horas, e todos os detalhes específicos estão disponíveis no regulamento de cada leilão."
    },
    {
      id: 6,
      pergunta: "Posso cancelar um lance já realizado?",
      resposta: "Por padrão, lances confirmados não podem ser cancelados, pois isso comprometeria a integridade do processo de leilão. Porém, em casos excepcionais e devidamente justificados, nossa equipe de suporte pode analisar a situação. Recomendamos sempre verificar todos os detalhes do lote antes de efetuar seus lances."
    }
  ];

  // Função para expandir/recolher FAQs
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#012038] to-[#0D1733]">
      <Navigation />
      
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-[#001828] to-[#012038] text-white">
        <div className="container mx-auto py-20 px-4 md:px-8">
          <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Centro de Ajuda</h1>
            <p className="text-lg md:text-xl max-w-2xl opacity-90">Encontre respostas para suas dúvidas e aprenda a aproveitar ao máximo a plataforma Aukt Leilões.</p>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto py-12 px-4 md:px-8">
        {/* Barra de pesquisa */}
        <div className={`bg-white/5 backdrop-blur-sm rounded-lg shadow-md p-6 mb-12 transition-all duration-500 transform border border-white/10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-white mb-3">Como podemos ajudar?</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Busque por perguntas frequentes..."
                  className="w-full p-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent placeholder-gray-400"
                />
                <HelpOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4ECDC4]" />
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <button className="w-full md:w-auto bg-[#247557] hover:bg-[#1a5740] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
                Pesquisar
              </button>
            </div>
          </div>
        </div>
        
        {/* FAQs */}
        <div className={`mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-white mb-6">Perguntas Frequentes</h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-white/10">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id}
                className={`border-b border-white/10 last:border-b-0 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-white/5 focus:outline-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="font-medium text-white">{faq.pergunta}</span>
                  {expandedFaq === faq.id ? 
                    <KeyboardArrowUp className="text-[#4ECDC4]" /> : 
                    <KeyboardArrowDown className="text-gray-400" />
                  }
                </button>
                <div 
                  className={`px-5 overflow-hidden transition-all duration-300 ${
                    expandedFaq === faq.id ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-300 leading-relaxed">{faq.resposta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Opções de contato */}
        <div className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-2xl font-bold text-white mb-6">Ainda precisa de ajuda?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-white/10">
              <div className="p-3 bg-[#012038]/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-[#4ECDC4]/30">
                <Email className="text-[#4ECDC4]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300 mb-4">
                Envie-nos um email para <span className="text-[#4ECDC4]">suporte@auktleiloes.com.br</span> e responderemos em até 24 horas úteis.
              </p>
              <a href="mailto:suporte@auktleiloes.com.br" className="text-[#4ECDC4] hover:text-white font-medium inline-flex items-center">
                Enviar email <KeyboardArrowRight className="ml-1" fontSize="small" />
              </a>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-white/10">
              <div className="p-3 bg-[#012038]/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-[#247557]/30">
                <WhatsApp className="text-[#247557]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">WhatsApp</h3>
              <p className="text-gray-300 mb-4">
                Atendimento rápido via WhatsApp, disponível de segunda a sexta-feira, das 9h às 18h.
              </p>
              <a href="https://wa.me/5511999999999" className="text-[#247557] hover:text-white font-medium inline-flex items-center">
                Iniciar conversa <KeyboardArrowRight className="ml-1" fontSize="small" />
              </a>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-white/10">
              <div className="p-3 bg-[#012038]/50 rounded-full w-14 h-14 flex items-center justify-center mb-4 border border-[#0d4e8e]/30">
                <Chat className="text-[#0d4e8e]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chat Online</h3>
              <p className="text-gray-300 mb-4">
                Converse em tempo real com nossa equipe de suporte através do chat online da plataforma.
              </p>
              <button className="text-[#0d4e8e] hover:text-white font-medium inline-flex items-center">
                Abrir chat <KeyboardArrowRight className="ml-1" fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;