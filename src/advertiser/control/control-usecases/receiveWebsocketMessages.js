import io from 'socket.io-client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

class ReceiveWebsocketMessages {
    socket;
    generalAUK;
    advertiserInfo;
    instanceId;

    constructor(generalAUK) {
        this.saveAdvertiserSession();
        this.generalAUK = generalAUK;
        this.instanceId = `control_${uuidv4()}`;
        this.setupSocket();
    }

    setupSocket() {
        // Desconectar socket existente se houver
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(`${import.meta.env.VITE_APP_BACKEND_WEBSOCKET}`, {
            transports: ['websocket'],
            upgrade: false,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            forceNew: true,
            query: {
                instance_id: this.instanceId,
                client_type: "control_panel",
                auct_id: this.generalAUK.auct.id
            }
        });

        // Log de conexão para debug
        this.socket.on('connect', () => {
            console.log('WebSocket Connected - Control Panel');
            this.joinAuctionRoom();
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket Error:', error);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket Disconnected:', reason);
            if (reason === 'io server disconnect') {
                this.socket.connect();
            }
        });

        // Adicionar listener para reconexão
        this.socket.on('reconnect', () => {
            console.log('WebSocket Reconnected - Control Panel');
            this.joinAuctionRoom();
        });
    }

    joinAuctionRoom() {
        if (this.socket && this.socket.connected) {
            this.socket.emit('join-auction-room', {
                auct_id: this.generalAUK.auct.id,
                instance_id: this.instanceId,
                client_type: "control_panel"
            });
        }
    }

    receivePlayingAuction(callback) {
        const eventName = `${this.generalAUK.auct.id}-playing-auction`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            if (!message?.data?.body?.product?.advertiser_id) return;

            console.log('playing auction receive -> ', message)
            
            const advertiserId = message.data.body.product.advertiser_id;
            if(this.verifyAuctionOwner(advertiserId)){
                callback(message);
            }
        });
    }

    receiveBidMessage(callback) {
        const eventName = `${this.generalAUK.auct.id}-bid`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            callback(message);
        });
    }

    receiveWinnerMessage(callback) {
        const eventName = `${this.generalAUK.auct.id}-winner`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            if (!message?.data?.body?.product?.advertiser_id) return;
            const advertiserId = message.data.body.product.advertiser_id;
            if(this.verifyAuctionOwner(advertiserId)){
                callback(message);
            }
        });
    }

    receiveAuctionFinishedMessage(callback) {
        const eventName = `${this.generalAUK.auct.id}-auct-finished`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {

            console.log("message auction finished", message.data)
            if (!message?.data?.body?.advertiserId) return;
            const advertiserId = message.data.body.advertiserId;
            if(this.verifyAuctionOwner(advertiserId)){
                callback(message);
            }
        });
    }

    receiveBidCatalogedMessage(callback) {
        const eventName = `${this.generalAUK.auct.id}-bid-cataloged`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            callback(message);
        });
    }

    async saveAdvertiserSession() {
        try {
            const currentLocalAdvertiser = JSON.parse(localStorage.getItem('advertiser-session-aukt'));
            if(currentLocalAdvertiser && currentLocalAdvertiser.email && currentLocalAdvertiser.token){
                try {
                    const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_API}/advertiser/find-by-email?email=${currentLocalAdvertiser.email}`, {
                        headers: {
                            'Authorization': `Bearer ${currentLocalAdvertiser.token}`
                        }
                    });

                    this.advertiserInfo = response.data;
                    console.log("anunciante salvo com sucesso");
                    
                } catch (error) {
                    console.error("Error fetching advertiser info:", error);
                    this.advertiserInfo = null;
                }
            } else {
                console.warn("No valid advertiser session found");
                this.advertiserInfo = null;
            }
        } catch (error) {
            console.error("Error parsing advertiser session:", error);
            this.advertiserInfo = null;
        }
    }
    
    verifyAuctionOwner(advertiser_id) {
        if (!this.advertiserInfo) return false;
        return this.advertiserInfo.id === advertiser_id;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default ReceiveWebsocketMessages;
