/* eslint-disable react/prop-types */
import { ArrowLeft, ArrowRight, Visibility, ViewModule } from "@mui/icons-material";

// Componente para o cabeçalho do produto com navegação e controles
const ProductHeader = ({ props, navigate, handlePrevProduct, handleNextProduct, showMessage }) => {
    const handleViewCatalog = () => {
        if (props.currentAuct && props.currentAuct.id) {
            navigate(`/advertiser/home/shop/${props.currentAuct.id}`);
        } else {
            showMessage("Não foi possível abrir o catálogo deste leilão.", "error");
        }
    };
    
    return (
        <div className='sticky top-0 z-10 bg-white p-6 border-b border-gray-100'>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                    <span className='text-gray-500 text-sm'>Lote</span>
                    <span className='font-semibold text-2xl text-gray-800'>{props.currentProduct.lote}</span>
                </div>

                {/* Botões de ação */}
                <div className="flex items-center gap-2">
                    {/* Botão Ver Catálogo */}
                    <button
                        onClick={handleViewCatalog}
                        className="flex items-center gap-2 px-4 py-2 
                            bg-gradient-to-r from-[#012038] to-[#144870] 
                            hover:from-[#144870] hover:to-[#144870]
                            text-white rounded-full shadow-md hover:shadow-lg 
                            transition-all duration-300 text-sm font-medium mr-2"
                    >
                        <ViewModule sx={{ fontSize: 18 }} />
                        <span>Ver Catálogo</span>
                    </button>
                    
                    {/* Botão de ver/ocultar lances */}
                    <button
                        onClick={() => props.setShowBids(!props.showBids)}
                        className="flex items-center gap-2 px-4 py-2 
                            bg-gradient-to-r from-[#143247] to-blue-600 
                            hover:from-blue-600 hover:to-blue-700
                            text-white rounded-full shadow-md hover:shadow-lg 
                            transition-all duration-300 text-sm font-medium"
                    >
                        <Visibility sx={{ fontSize: 18 }} />
                        <span>{props.showBids ? 'Ocultar Lances' : 'Ver Lances'}</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePrevProduct(
                            props.currentAuct,
                            props.currentProduct,
                            props.setCurrentProduct,
                            props.setBidInformations,
                            navigate,
                            showMessage
                        )}
                        className={`p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                            ${props.currentProduct.lote <= 1
                                ? 'opacity-50 cursor-not-allowed text-gray-400'
                                : 'text-gray-600 hover:text-gray-800'}`}
                        disabled={props.currentProduct.lote <= 1}
                    >
                        <ArrowLeft sx={{ fontSize: "32px" }} />
                    </button>
                    <button
                        onClick={() => handleNextProduct(
                            props.currentAuct,
                            props.currentProduct,
                            props.setCurrentProduct,
                            props.setBidInformations,
                            navigate,
                            showMessage
                        )}
                        className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300
                            text-gray-600 hover:text-gray-800"
                    >
                        <ArrowRight sx={{ fontSize: "32px" }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductHeader; 