/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { CloudUpload, Close } from '@mui/icons-material';

function ProfilePhotoModal({ isOpen, onClose, currentAdvertiser, onSuccess }) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setError("Arquivo muito grande. O tamanho máximo é 2MB.");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("aukt-profile-advertiser", file);

        try {
            const advertiserSession = localStorage.getItem('advertiser-session-aukt');
            const { token } = JSON.parse(advertiserSession);

            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/advertiser/upload-cover-profile?advertiserId=${currentAdvertiser.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            onSuccess(response.data.body);
            onClose();
        } catch (error) {
            console.error("Erro no upload:", error);
            if (error.response?.status === 413) {
                setError("Arquivo muito grande. Por favor, use uma imagem menor.");
            } else {
                setError("Erro ao fazer upload da foto. Tente novamente.");
            }
        } finally {
            setIsUploading(false);
        }
    }, [MAX_FILE_SIZE, currentAdvertiser.id, onClose, onSuccess]);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'],
        },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        noClick: true
    });

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#012038]">
                        Atualizar Foto do Perfil
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {/* Foto Atual */}
                {currentAdvertiser?.url_profile_cover && (
                    <div className="mb-6 text-center">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#012038]/10">
                            <img 
                                src={currentAdvertiser.url_profile_cover}
                                alt="Foto atual"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Foto atual
                        </p>
                    </div>
                )}

                {/* Upload Area */}
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-lg p-8
                        transition-all duration-200
                        ${isDragActive ? 'border-[#012038] bg-[#012038]/5' : 'border-gray-300'}
                        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#012038]'}
                    `}
                    onClick={open}
                >
                    <input {...getInputProps()} disabled={isUploading} />
                    <div className="text-center">
                        <CloudUpload className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-600">
                            {isDragActive ? 'Solte a imagem aqui' : 'Arraste uma nova imagem ou clique para selecionar'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG ou GIF (max. 2MB)
                        </p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isUploading && (
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Fazendo upload...
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePhotoModal; 