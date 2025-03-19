import { useState } from 'react';

// Hook para gerenciar o sistema de notificações
const useNotifications = () => {
    const [showOutbidNotification, setShowOutbidNotification] = useState(false);
    const [lastBidClient, setLastBidClient] = useState(null);
    const [outbidNotificationMessage, setOutbidNotificationMessage] = useState('');

    return {
        showOutbidNotification,
        setShowOutbidNotification,
        lastBidClient,
        setLastBidClient,
        outbidNotificationMessage,
        setOutbidNotificationMessage
    };
};

export default useNotifications; 