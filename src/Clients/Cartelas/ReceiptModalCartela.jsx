import PropTypes from 'prop-types';
import auktLogo from '../../media/logos/logos-auk/aukt_blue.png';

const ReceiptModalCartela = ({
    selectedCartela,
    closeReceiptModal,
    currentClient,
    auctionDetails,
    formatDate,
    formatCurrency,
    getStatusInfo,
    getAuctionStatusInfo
}) => {
    const handlePrint = () => {
        window.print();
    };

    const formatAddress = (addressString) => {
        try {
            const address = JSON.parse(addressString);
            return `${address.street}, ${address.number} - ${address.city}/${address.state} - CEP: ${address.cep}`;
        } catch (error) {
            return addressString;
        }
    };

    const dateStyle = {
        fontSize: '0.75rem',
        color: '#718096',
        marginTop: '0.5rem'
    };

    const auction = selectedCartela.Auct || (selectedCartela.auction_id && auctionDetails[selectedCartela.auction_id]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:block print:relative print:inset-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:w-full print:overflow-visible print:m-0 print:min-h-screen">
                <style type="text/css" media="print">
                    {`
                        @page { 
                            size: A4; 
                            margin: 20mm; 
                        }
                        .print-hidden {
                            display: none !important;
                        }
                        #receipt-content {
                            padding: 0 !important;
                            margin: 0 !important;
                            color: black !important;
                        }
                        body {
                            background: white !important;
                        }
                    `}
                </style>
                
                {/* Cabeçalho do Modal */}
                <div className="p-6 border-b print-hidden">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Recibo de Compra</h2>
                        <button
                            onClick={closeReceiptModal}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Conteúdo do Recibo */}
                <div id="receipt-content" className="p-6 space-y-6 print:p-8 print:space-y-8 print:text-black">
                    {/* Logo e Cabeçalho do Recibo */}
                    <div className="text-center border-b pb-6 print-break-inside-avoid">
                        <div className="mb-4 flex justify-center">
                            <img src={auktLogo} alt="Aukt Logo" className="h-16 object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Recibo de Compra</h1>
                        <p className="text-gray-600">Cartela #{selectedCartela.id.slice(-7)}</p>
                        <p className="text-sm text-gray-500">Data: {formatDate(selectedCartela.created_at)}</p>
                    </div>

                    {/* Informações do Leilão */}
                    {auction && (
                        <div className="border-b pb-6 print-break-inside-avoid">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Leilão</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Título do Leilão</p>
                                    <p className="font-medium">{auction.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Data do Leilão</p>
                                    <p className="font-medium">{formatDate(auction.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status do Leilão</p>
                                    <p className={`font-medium ${getAuctionStatusInfo(auction.status).color}`}>
                                        {getAuctionStatusInfo(auction.status).text}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Leiloeiro</p>
                                    <p className="font-medium">{auction.Advertiser?.name || "Não disponível"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações do Anunciante */}
                    {selectedCartela.Advertiser && (
                        <div className="border-b pb-6 print-break-inside-avoid">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Anunciante</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Nome</p>
                                    <p className="font-medium">{selectedCartela.Advertiser.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">CPF</p>
                                    <p className="font-medium">{selectedCartela.Advertiser.CPF}</p>
                                </div>
                                {selectedCartela.Advertiser.company_name && (
                                    <div>
                                        <p className="text-sm text-gray-600">Empresa</p>
                                        <p className="font-medium">{selectedCartela.Advertiser.company_name}</p>
                                    </div>
                                )}
                                {selectedCartela.Advertiser.CNPJ && (
                                    <div>
                                        <p className="text-sm text-gray-600">CNPJ</p>
                                        <p className="font-medium">{selectedCartela.Advertiser.CNPJ}</p>
                                    </div>
                                )}
                                {selectedCartela.Advertiser.email && (
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{selectedCartela.Advertiser.email}</p>
                                    </div>
                                )}
                                {selectedCartela.Advertiser.company_adress && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Endereço da Empresa</p>
                                        <p className="font-medium">{formatAddress(selectedCartela.Advertiser.company_adress)}</p>
                                    </div>
                                )}
                                {selectedCartela.Advertiser.address && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Endereço</p>
                                        <p className="font-medium">{formatAddress(selectedCartela.Advertiser.address)}</p>
                                    </div>
                                )}
                                {selectedCartela.Advertiser.police_status && (
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className={`font-medium inline-block px-2 py-1 rounded-full text-xs ${
                                            selectedCartela.Advertiser.police_status === 'REGULAR' ? 'bg-green-100 text-green-700' :
                                            selectedCartela.Advertiser.police_status === 'WARNED' ? 'bg-yellow-100 text-yellow-700' :
                                            selectedCartela.Advertiser.police_status === 'SUSPENDED' ? 'bg-orange-100 text-orange-700' :
                                            selectedCartela.Advertiser.police_status === 'BANNED' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {selectedCartela.Advertiser.police_status}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Data de Cadastro</p>
                                    <p className="font-medium">{formatDate(selectedCartela.Advertiser.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações do Comprador */}
                    <div className="border-b pb-6 print-break-inside-avoid">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Comprador</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Nome</p>
                                <p className="font-medium">{currentClient.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{currentClient.email}</p>
                            </div>
                            {currentClient.cpf && (
                                <div>
                                    <p className="text-sm text-gray-600">CPF</p>
                                    <p className="font-medium">{currentClient.cpf}</p>
                                </div>
                            )}
                            {currentClient.phone && (
                                <div>
                                    <p className="text-sm text-gray-600">Telefone</p>
                                    <p className="font-medium">{currentClient.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    <div className="border-b pb-6 print-break-inside-avoid print:break-before">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Produtos Adquiridos</h3>
                        <div className="space-y-4">
                            {selectedCartela.products.map((product, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg print-break-inside-avoid">
                                    {product.image && (
                                        <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{product.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Lote: {product.lot_number || 'N/A'}</span>
                                            <span className="font-medium text-green-600">{formatCurrency(product.real_value)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <p className="text-sm text-gray-600">Valor Total</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCartela.amount)}</p>
                        </div>
                    </div>

                    {/* Informações de Pagamento */}
                    <div className="border-b pb-6 print-break-inside-avoid">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações de Pagamento</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Status do Pagamento</p>
                                <p className={`font-medium ${getStatusInfo(selectedCartela.status).color} text-white inline-block px-2 py-1 rounded-full text-sm mt-1`}>
                                    {getStatusInfo(selectedCartela.status).text}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Data do Pagamento</p>
                                <p className="font-medium">{formatDate(selectedCartela.payment_date) || "Pendente"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Informações de Envio */}
                    {selectedCartela.tracking_code && (
                        <div className="border-b pb-6 print-break-inside-avoid">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações de Envio</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Código de Rastreio</p>
                                    <p className="font-medium font-mono bg-gray-50 p-2 rounded mt-1">
                                        {selectedCartela.tracking_code}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status de Envio</p>
                                    <p className={`font-medium ${getStatusInfo(selectedCartela.status).color} text-white inline-block px-2 py-1 rounded-full text-sm mt-1`}>
                                        {getStatusInfo(selectedCartela.status).text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Termos e Condições */}
                    <div className="text-sm text-gray-500 border-b pb-6 print-break-inside-avoid">
                        <p>Este recibo é um documento comprobatório da transação realizada. Guarde-o para futuras referências.</p>
                    </div>

                    {/* Assinaturas */}
                    <div className="grid grid-cols-2 gap-8 pt-8 print-break-inside-avoid print:mt-16">
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-2">
                                <p className="text-sm text-gray-600">Assinatura do Anunciante</p>
                                <p className="reenie-beanie-regular text-[2.5rem] mt-4 text-[#00264D] transform -rotate-2 tracking-[2px]">
                                    {selectedCartela.Advertiser?.name || "Nome do Anunciante"}
                                </p>
                                <p style={dateStyle}>
                                    {formatDate(new Date())}
                                </p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-gray-300 pt-2">
                                <p className="text-sm text-gray-600">Assinatura do Comprador</p>
                                <p className="reenie-beanie-regular text-[2.5rem] mt-4 text-[#00264D] transform -rotate-2 tracking-[2px]">
                                    {currentClient.name}
                                </p>
                                <p style={dateStyle}>
                                    {formatDate(new Date())}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rodapé do Modal */}
                <div className="sticky bottom-0 bg-white border-t p-4 print-hidden">
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={closeReceiptModal}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Imprimir Recibo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ReceiptModalCartela.propTypes = {
    selectedCartela: PropTypes.shape({
        id: PropTypes.string.isRequired,
        created_at: PropTypes.string,
        status: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        products: PropTypes.arrayOf(
            PropTypes.shape({
                image: PropTypes.string,
                title: PropTypes.string.isRequired,
                description: PropTypes.string,
                lot_number: PropTypes.string,
                value: PropTypes.number.isRequired
            })
        ).isRequired,
        tracking_code: PropTypes.string,
        payment_date: PropTypes.string,
        Advertiser: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            CPF: PropTypes.string.isRequired,
            company_name: PropTypes.string,
            CNPJ: PropTypes.string,
            company_adress: PropTypes.string,
            email: PropTypes.string.isRequired,
            address: PropTypes.string,
            police_status: PropTypes.oneOf(['REGULAR', 'WARNED', 'SUSPENDED', 'BANNED', 'UNDER_REVIEW']),
            created_at: PropTypes.string.isRequired
        }).isRequired,
        Auct: PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            created_at: PropTypes.string,
            status: PropTypes.string,
            value: PropTypes.number
        }),
        auction_id: PropTypes.string
    }).isRequired,
    closeReceiptModal: PropTypes.func.isRequired,
    currentClient: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        cpf: PropTypes.string,
        phone: PropTypes.string
    }).isRequired,
    auctionDetails: PropTypes.object.isRequired,
    formatDate: PropTypes.func.isRequired,
    formatCurrency: PropTypes.func.isRequired,
    getStatusInfo: PropTypes.func.isRequired,
    getAuctionStatusInfo: PropTypes.func.isRequired
};

export default ReceiptModalCartela;