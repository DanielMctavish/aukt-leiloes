import { useState, useCallback } from 'react';
import axios from 'axios';

// Hook para gerenciar os estados e funções relacionados a lances
const useBidding = (props, currentSession) => {
    const [bidValue, setBidValue] = useState(0);
    const [isLoadingBid, setIsloadingBid] = useState(false);
    const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
    const [hasAutoBid, setHasAutoBid] = useState(false);
    const [autoBidLimit, setAutoBidLimit] = useState(0);

    // Função para calcular o incremento de lance com base no valor atual
    const getIncrementValue = (value) => {
        const baseValue = value || 0;
        
        if (baseValue <= 600) {
            return 20;
        } else if (baseValue <= 1200) {
            return 24; // 20% a mais que 20
        } else if (baseValue <= 3000) {
            return 30; // 50% a mais que 20
        } else if (baseValue <= 6000) {
            return 40; // 100% a mais que 20
        } else if (baseValue <= 12000) {
            return 60; // 200% a mais que 20
        } else {
            return Math.ceil(baseValue * 0.01); // 1% do valor para valores muito altos
        }
    };

    // Função para calcular o próximo valor de lance
    const calculateNextBidValue = useCallback((product) => {
        if (!product) return 0;
        
        // Se não houver lances, o valor é o valor inicial
        if (!product.Bid || product.Bid.length === 0) {
            return product.initial_value;
        }
        
        // Caso contrário, é o valor atual + incremento
        const currentValue = product.real_value || product.initial_value;
        return currentValue + getIncrementValue(currentValue);
    }, []);

    const handleSetBid = (e) => {
        // Remove caracteres não numéricos, mantendo apenas números
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        
        // Converte para número considerando os centavos
        const value = numericValue ? parseFloat(numericValue) / 100 : 0;
        
        console.log('handleSetBid - valor digitado:', e.target.value);
        console.log('handleSetBid - valor processado:', value);
        
        setBidValue(value);
    };

    const handleSetAutoBidLimit = (e) => {
        // Remove caracteres não numéricos, mantendo apenas números
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        
        // Converte para número considerando os centavos
        const value = numericValue ? parseFloat(numericValue) / 100 : 0;
        
        console.log('handleSetAutoBidLimit - valor digitado:', e.target.value);
        console.log('handleSetAutoBidLimit - valor processado:', value);
        
        setAutoBidLimit(value);
    };

    const disableAutoBid = async (showMessage) => {
        if (!currentSession?.token || !props.currentProduct?.id) {
            showMessage('Sessão inválida ou produto não selecionado', 'error');
            return;
        }

        setIsloadingBid(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_BACKEND_API}/products/disable-auto-bid`,
                {
                    product_id: props.currentProduct.id,
                    client_id: props.currentClient?.id || currentSession.id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${currentSession.token}`
                    }
                }
            );

            if (response.status === 200) {
                setIsAutoBidEnabled(false);
                setHasAutoBid(false);
                showMessage('Lance automático desativado com sucesso!', 'success');
                
                // Buscar produto atualizado
                // Aqui você poderia chamar fetchUpdatedProduct, mas está sendo mantido 
                // no componente principal por enquanto
            }
        } catch (error) {
            console.error('Erro ao desativar lance automático:', error);
            const errorMessage = error.response?.data?.body || 'Erro ao desativar lance automático';
            showMessage(errorMessage, 'error');
        } finally {
            setIsloadingBid(false);
        }
    };

    const toggleAutoBid = () => {
        if (isLoadingBid) return;
        
        const newState = !isAutoBidEnabled;
        console.log('toggleAutoBid - mudando estado:', newState);
        
        // Se estiver ativando o lance automático, usa o valor do lance normal como valor inicial
        if (newState) {
            console.log('toggleAutoBid - copiando valor do lance:', bidValue);
            setAutoBidLimit(bidValue);
        }
        
        setIsAutoBidEnabled(newState);
    };

    return {
        bidValue,
        setBidValue,
        isLoadingBid,
        setIsloadingBid,
        isAutoBidEnabled,
        setIsAutoBidEnabled,
        hasAutoBid,
        setHasAutoBid,
        autoBidLimit,
        setAutoBidLimit,
        calculateNextBidValue,
        getIncrementValue,
        handleSetBid,
        handleSetAutoBidLimit,
        toggleAutoBid,
        disableAutoBid
    };
};

export default useBidding; 