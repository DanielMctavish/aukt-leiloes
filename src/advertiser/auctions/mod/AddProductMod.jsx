/* eslint-disable react/prop-types */
import axios from "axios"
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { uploadFinished } from "../../../features/product/UploadFinished";

function AddProductMod({ onClose }) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadFinished, setLoadFinished] = useState(false)
    const [files, setFiles] = useState([]);
    const [errMessage, setErrMessage] = useState('')
    const stateSelectedProduct = useSelector(state => state.selectedProduct)
    const dispatch = useDispatch();
    const refCurrentWindow = useRef()
    //const currentLocalAdvertiser = localStorage.getItem('advertiser-session-aukt')
    //const localAdvertiser = JSON.parse(currentLocalAdvertiser)

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const dropzone = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg'],
            'image/jpg': ['.jpg'],
            'image/gif': ['.gif'],
        }
    });

    const refLabelZoneArea = useRef();

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        refLabelZoneArea.current.style.border = "2px dashed red";
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        refLabelZoneArea.current.style.border = "3px dashed #13384d";
    };

    useEffect(() => {}, [files, loadFinished]);

    const handleCloseCurrentWindow = () => {
        onClose();
    }

    const handleDeleteImageFromList = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }

    const handleUploadProductImages = async () => {

        setIsLoading(true)
        const formDataSingle = new FormData();
        formDataSingle.append("aukt-product-img", files[0]);
        const localErrors = []

        try {
            //ADICIONANDO SINGLE IMAGE..............................................................
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/upload-cover-img?product_id=${stateSelectedProduct.product.id}`, formDataSingle)
                .then(() => {
                    setIsLoading(false)
                    setLoadFinished(true)
                }).catch(err => {
                    if (err.response.data === "O arquivo é muito grande, máximo 2MB") {
                        setErrMessage(err.response.data)
                        setIsLoading(false)
                        localErrors.push(err.response.data)
                        return
                    }
                })
            //ADICIONANDO MULTIPLES IMAGE..............................................................
            if (files.length > 1) {
                const filesOutIndex0 = await files.filter((_, i) => i !== 0)
                const formDataMultiples = new FormData();
                filesOutIndex0.forEach((image) => {
                    formDataMultiples.append("aukt-products-imgs", image);
                })

                await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/upload-products-imgs?product_id=${stateSelectedProduct.product.id}`, formDataMultiples)
                    .then(() => {
                        setIsLoading(false)
                        dispatch(uploadFinished({
                            payload: true
                        }))
                    }).catch(err => {
                        setIsLoading(false)
                        if (err.response.data === "O arquivo é muito grande, máximo 2MB") {
                            setErrMessage(err.response.data)
                            setIsLoading(false)
                            localErrors.push(err.response.data)
                            return
                        }
                    })
            }

            if (localErrors.length === 0) {
                setErrMessage("")
                setIsLoading(false)
                setLoadFinished(false)
                onClose();
                setFiles([])
            }

        } catch (error) {
            setFiles([])
            setIsLoading(false)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    if (isLoading) {
        return (
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                <div className="h-64 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012038]"></div>
                    <p className="mt-4 text-gray-600 font-medium">Adicionando imagens, aguarde...</p>
                </div>
            </div>
        )
    }

    if (loadFinished) {
        setTimeout(() => {
            onClose();
        }, 1500);

        return (
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                <div className="h-64 flex flex-col items-center justify-center text-green-600">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="mt-4 font-medium">Imagens enviadas com sucesso!</p>
                </div>
            </div>
        )
    }

    return (
        <div ref={refCurrentWindow} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    {stateSelectedProduct.product.title}
                </h2>
                <button 
                    onClick={handleCloseCurrentWindow}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Close className="text-gray-500" />
                </button>
            </div>

            <div className="p-6">
                {/* Área de Drop */}
                <div 
                    {...getRootProps({ className: "dropzone" })}
                    ref={refLabelZoneArea}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className="w-full aspect-video flex flex-col items-center justify-center 
                        border-2 border-dashed border-gray-300 rounded-xl 
                        bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div className="text-center">
                            <div className="text-blue-500 mb-2">
                                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-blue-500 text-lg font-medium">Solte as imagens aqui</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-gray-400 mb-2">
                                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg mb-2">Arraste e solte as imagens aqui</p>
                            <p className="text-sm text-gray-400">ou clique para selecionar</p>
                        </div>
                    )}
                </div>

                {/* Preview das Imagens */}
                {files.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Imagens selecionadas ({files.length})
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {files.map((file, index) => (
                                <div 
                                    key={index} 
                                    className={`relative group ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt={file.name} 
                                        className={`w-24 h-24 object-cover rounded-lg 
                                            ${index === 0 ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                                    />
                                    <button
                                        onClick={() => handleDeleteImageFromList(index)}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full 
                                            shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Close className="text-sm" />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute -top-2 -left-2 px-2 py-1 bg-blue-500 text-white 
                                            text-xs font-medium rounded-full">
                                            Capa
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mensagem de Erro */}
                {errMessage && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                        {errMessage}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleCloseCurrentWindow}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg 
                            transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleUploadProductImages}
                        disabled={files.length === 0}
                        className="px-4 py-2 bg-[#012038] hover:bg-[#012d52] text-white rounded-lg 
                            transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex 
                            items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Enviar Imagens
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProductMod;
