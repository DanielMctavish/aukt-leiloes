// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react/prop-types */
// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// function ProductsGroupArrematantes({ products }) {
//     const [productsList, setProductList] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const modalRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         setProductList(products);
//     }, [products]);

//     useEffect(() => {
//         // Adiciona listener para clicks fora do modal
//         function handleClickOutside(event) {
//             if (modalRef.current && !modalRef.current.contains(event.target)) {
//                 setSelectedProduct(null);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleProductClick = (productId) => {
//         navigate(`/advertiser/home/product/${productId}`);
//     }

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('pt-BR', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });
//     }

//     const formatCurrency = (value) => {
//         return new Intl.NumberFormat('pt-BR', {
//             style: 'currency',
//             currency: 'BRL'
//         }).format(value);
//     }

//     return (
//         <div 
//             ref={modalRef}
//             className={`bg-white shadow-lg shadow-[#18181845] rounded-lg z-[99] transition-all duration-300
//                 ${selectedProduct ? 'w-[500px]' : 'w-[300px]'}`}
//         >
//             {/* Products Grid */}
//             <div className="p-3 border-b border-gray-100">
//                 <div className="flex flex-wrap gap-2">
//                     {productsList.map(product => (
//                         <div 
//                             key={product.id}
//                             className="relative group cursor-pointer"
//                             onClick={() => setSelectedProduct(product)}
//                         >
//                             <img 
//                                 src={product.cover_img_url}
//                                 alt={product.title}
//                                 className="w-[60px] h-[60px] object-cover rounded-lg transition-transform 
//                                     hover:scale-105 border border-gray-200" 
//                             />
//                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 
//                                 rounded-lg transition-all duration-200" />
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Product Details */}
//             {selectedProduct && (
//                 <div className="p-4">
//                     <div className="flex gap-4">
//                         {/* Main Image */}
//                         <div className="w-[120px] h-[120px] flex-shrink-0">
//                             <img 
//                                 src={selectedProduct.cover_img_url}
//                                 alt={selectedProduct.title}
//                                 className="w-full h-full object-cover rounded-lg border border-gray-200"
//                             />
//                         </div>

//                         {/* Product Info */}
//                         <div className="flex-1">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-gray-800 mb-1">
//                                         {selectedProduct.title}
//                                     </h3>
//                                     <p className="text-sm text-gray-500 mb-2">
//                                         Lote: {selectedProduct.lote}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => handleProductClick(selectedProduct.id)}
//                                     className="text-xs bg-[#012038] text-white px-3 py-1.5 rounded-md 
//                                         hover:bg-[#01477f] transition-colors"
//                                 >
//                                     Ver Produto
//                                 </button>
//                             </div>

//                             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//                                 <div>
//                                     <span className="text-gray-500">Valor Inicial:</span>
//                                     <span className="ml-2 font-medium text-gray-800">
//                                         {formatCurrency(selectedProduct.initial_value)}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-500">Valor Reserva:</span>
//                                     <span className="ml-2 font-medium text-gray-800">
//                                         {formatCurrency(selectedProduct.reserve_value)}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-500">Categoria:</span>
//                                     <span className="ml-2 font-medium text-gray-800">
//                                         {selectedProduct.categorie}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <span className="text-gray-500">Grupo:</span>
//                                     <span className="ml-2 font-medium text-gray-800">
//                                         {selectedProduct.group}
//                                     </span>
//                                 </div>
//                                 <div className="col-span-2">
//                                     <span className="text-gray-500">Data Criação:</span>
//                                     <span className="ml-2 font-medium text-gray-800">
//                                         {formatDate(selectedProduct.created_at)}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div className="mt-3">
//                                 <p className="text-sm text-gray-600 line-clamp-2">
//                                     {selectedProduct.description}
//                                 </p>
//                             </div>

//                             {/* Additional Images */}
//                             {selectedProduct.group_imgs_url?.length > 0 && (
//                                 <div className="mt-3">
//                                     <div className="flex gap-2 overflow-x-auto pb-2">
//                                         {selectedProduct.group_imgs_url.slice(0, 4).map((imgUrl, index) => (
//                                             <img 
//                                                 key={index}
//                                                 src={imgUrl}
//                                                 alt={`${selectedProduct.title} - ${index + 1}`}
//                                                 className="w-12 h-12 object-cover rounded-md border border-gray-200 
//                                                     flex-shrink-0"
//                                             />
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProductsGroupArrematantes;