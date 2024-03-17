import axios from "axios"
import { Close } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";

function AddProductMod() {
    const [files, setFiles] = useState([]);
    const stateSelectedProduct = useSelector(state => state.selectedProduct)
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

    useEffect(() => {
        console.log('observando files -> ', files);
    }, [files]);

    const handleCloseCurrentWindow = () => {
        const currentProductWindow = document.querySelector(".section-add-product");
        currentProductWindow.style.display = "none";
    };

    const handleDeleteImageFromList = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    }

    const handleUploadProductImages = async () => {

        const formDataSingle = new FormData();
        formDataSingle.append("aukt-product-img", files[0]);

        try {
            //ADICIONANDO SINGLE IMAGE..............................................................
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/upload-cover-img?product_id=${stateSelectedProduct.product.id}`, formDataSingle)
                .then(() => {
                    console.log('upload single sucess!');
                }).catch(err => {
                    console.log('primeira requisição -> ', err.response.data);
                })
            //ADICIONANDO MULTIPLES IMAGE..............................................................
            if (files.length > 1) {
                const filesOutIndex0 = await files.filter((_, i) => i !== 0)
                console.log('observando imagens filtradas',filesOutIndex0);
                const formDataMultiples = new FormData();
                filesOutIndex0.forEach((image)=>{
                    formDataMultiples.append("aukt-products-imgs", image);
                })

                await axios.post(`${import.meta.env.VITE_APP_BACKEND_API}/products/upload-products-imgs?product_id=${stateSelectedProduct.product.id}`, formDataMultiples)
                    .then(() => {
                        console.log('upload multiples sucess!');
                    }).catch(err => {
                        console.log('segunda requisição -> ', err.response.data);
                    })
            }
            // //ATUALIZANDO PRODUTO.....................................................................
            // await axios.patch(`${import.meta.env.VITE_APP_BACKEND_API}/products/update?product_id=${stateSelectedProduct.product.id}`, {
            //     cover_img_url: currentProductCover,
            //     group_imgs_url: currentProductMultiples
            // }).catch(err => {
            //     console.log('terceira requisição -> ', err.response.data);
            // })

        } catch (error) {
            console.log('erro ao tentar adicionar fotos ao produto ->');
        }
    }

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    return (
        <div className="flex flex-col gap-2 window-add-product border-[1px] border-[#d2d2d2] justify-center items-center w-[60%] h-[80vh] bg-white rounded-md shadow-lg shadow-[#0f0f0f50] relative z-[99]">
            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-800 cursor-pointer z-[99]">
                <Close />
            </span>

            <div className="flex w-full h-[20vh] text-zinc-600 justify-center items-center absolute top-0">
                <h1 className="font-bold text-[30px]">{stateSelectedProduct.product.title}</h1>
            </div>

            {/* DRAG AND DROP AREA */}
            <div {...getRootProps({ className: "dropzone" })}
                ref={refLabelZoneArea}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className="w-[80%] h-[50%] flex justify-center items-center border-[3px] border-[#13384d] hover:bg-[#13384d16] text-zinc-400 rounded-2xl border-dashed">
                {isDragActive ? (<h2 className="text-[#29a8c4]">solte o arquivo</h2>) : (<h2>arraste e solte as fotos do produto aqui</h2>)}
            </div>

            <input {...getInputProps()} type="file" className="hidden" />

            {/* ALL PHOTOS ADDED DISPLAY */}
            <div className="w-[80%] flex justify-start items-center gap-2 z-[100]">
                {files.map((file, index) => (
                    <div key={index} className="w-[80px] h-[80px] bg-red-300 rounded-md overflow-hidden flex justify-center relative">
                        <span
                            onClick={() => handleDeleteImageFromList(index)}
                            className="absolute top-[1px] right-[1px] cursor-pointer">
                            <Close />
                        </span>
                        <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover" />
                    </div>
                ))}
            </div>

            <button
                onClick={handleUploadProductImages}
                className="text-zinc-600 bg-zinc-200 p-3 rounded-md">confirmar</button>
        </div>
    );
}

export default AddProductMod;
