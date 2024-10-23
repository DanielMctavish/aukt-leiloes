import React from 'react';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

function FooterTemplate({ getSizeClass, template, textColorClass }) {
    return (
        <footer
            className={`w-full ${getSizeClass(template.footer.sizeType)} flex flex-col justify-between text-white`}
            style={{ 
                backgroundColor: template.footer.color,
                textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)'
            }}
        >
            <div className="container mx-auto px-6 py-8">
                <div className="sm:flex sm:mt-8">
                    <div className="mt-8 sm:mt-0 sm:w-full sm:px-8 flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold uppercase mb-2">Sobre nós</span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Nossa história</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Equipe</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Carreiras</a></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold uppercase mt-4 md:mt-0 mb-2">Serviços</span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Leilões</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Avaliações</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">Consultoria</a></span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold uppercase mt-4 md:mt-0 mb-2">Contato</span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">+55 11 1234-5678</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">contato@empresa.com</a></span>
                            <span className="my-2"><a href="#" className="text-md hover:text-blue-300">São Paulo, SP</a></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-6">
                <div className="mt-16 border-t-2 border-gray-600 flex flex-col items-center">
                    <div className="sm:w-2/3 text-center py-6">
                        <p className="text-sm font-bold mb-2">
                            © 2023 por EMPRESA. Todos os direitos reservados.
                        </p>
                    </div>
                    <div className="flex mb-4">
                        <a href="#" className="mx-2">
                            <Facebook className="hover:text-blue-300" />
                        </a>
                        <a href="#" className="mx-2">
                            <Twitter className="hover:text-blue-300" />
                        </a>
                        <a href="#" className="mx-2">
                            <Instagram className="hover:text-pink-300" />
                        </a>
                        <a href="#" className="mx-2">
                            <LinkedIn className="hover:text-blue-300" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterTemplate;
