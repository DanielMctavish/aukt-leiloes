import { useState } from 'react';

// Hook para gerenciar a sessão do usuário/cliente
const useProductSession = () => {
    const [currentSession, setCurrentSession] = useState(() => {
        // Inicializar a partir do localStorage se disponível
        try {
            const storedSession = localStorage.getItem("client-auk-session-login");
            return storedSession ? JSON.parse(storedSession) : null;
        } catch (error) {
            console.error('Erro ao carregar sessão do localStorage:', error);
            return null;
        }
    });

    return { currentSession, setCurrentSession };
};

export default useProductSession; 