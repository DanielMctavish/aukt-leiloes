import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class ReceiveWebsocketOnFloor {
    socket;
    auct_id;
    instanceId;

    constructor(auct_id) {
        this.auct_id = auct_id;
        this.instanceId = `floor_${uuidv4()}`;
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
                client_type: "floor",
                auct_id: this.auct_id
            }
        });

        // Log de conexão para debug
        this.socket.on('connect', () => {
            console.log('WebSocket Connected - Floor');
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
            console.log('WebSocket Reconnected - Floor');
            this.joinAuctionRoom();
        });
    }

    joinAuctionRoom() {
        if (this.socket && this.socket.connected) {
            this.socket.emit('join-auction-room', {
                auct_id: this.auct_id,
                instance_id: this.instanceId,
                client_type: "floor"
            });
        }
    }

    receivePlayingAuction(callback) {
        const eventName = `${this.auct_id}-playing-auction`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            callback(message);
        });
    }

    receiveBidMessage(callback) {
        const eventName = `${this.auct_id}-bid`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            console.log("mensagem recebida Bid: ", message.data)
            callback(message);
        });
    }

    receiveWinnerMessage(callback) {
        const eventName = `${this.auct_id}-winner`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            console.log("mensagem recebida Winner: ", message.data)
            callback(message);
        });
    }

    receiveAuctionFinishedMessage(callback) {
        const eventName = `${this.auct_id}-auct-finished`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            console.log("message auction finished", message.data)
            callback(message);
        });
    }

    receiveBidCatalogedMessage(callback) {
        const eventName = `${this.auct_id}-bid-cataloged`;
        // Remover listener anterior se existir
        this.socket.off(eventName);
        
        this.socket.on(eventName, (message) => {
            callback(message);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default ReceiveWebsocketOnFloor;
