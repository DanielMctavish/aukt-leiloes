import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Hook para gerenciar atualizações em tempo real
const useRealTimeUpdates = (currentAuctId, currentProductId, onBidReceived) => {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!currentAuctId || !currentProductId) return;
        
        // Conectar ao servidor WebSocket
        const socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`);
        socketRef.current = socket;
        
        // Escutar eventos de novos lances em catálogo
        socket.on(`${currentAuctId}-bid-cataloged`, (message) => {
            console.log('Evento de lance em catálogo recebido:', message);
            
            const newBid = message.data.body;
            console.log('Valor do novo lance:', newBid?.value);
            console.log('Produto do lance:', newBid?.product_id);
            
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === currentProductId) || 
                          (newBid.product_id === currentProductId))) {
                
                console.log('Lance corresponde ao produto atual, notificando');
                onBidReceived(currentProductId, newBid);
            }
        });
        
        // Também escutar o evento normal de lance
        socket.on(`${currentAuctId}-bid`, (message) => {
            console.log('Evento de lance normal recebido:', message);
            
            const newBid = message.data.body || message.data;
            
            if (newBid && newBid.product_id === currentProductId) {
                console.log('Lance normal corresponde ao produto atual, notificando');
                onBidReceived(currentProductId, newBid);
            }
        });
        
        // Escutar eventos de novos lances não catalogados
        socket.on(`${currentAuctId}-bid-uncataloged`, (message) => {
            console.log('Evento de lance não catalogado recebido:', message);
            
            const newBid = message.data.body;
            
            if (newBid && ((newBid.Product && newBid.Product[0] && newBid.Product[0].id === currentProductId) || 
                          (newBid.product_id === currentProductId))) {
                
                console.log('Lance não catalogado corresponde ao produto atual, notificando');
                onBidReceived(currentProductId, newBid);
            }
        });
        
        // Limpar ao desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [currentAuctId, currentProductId, onBidReceived]);

    return socketRef;
};

export default useRealTimeUpdates; 