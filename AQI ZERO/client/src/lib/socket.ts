import { useRef, useEffect, useState } from 'react';

type WebSocketMessage = {
    type: string;
    payload: any;
};

type MessageHandler = (payload: any) => void;

class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private reconnectInterval: number = 2000;
    private handlers: Map<string, Set<MessageHandler>> = new Map();

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    private connect() {
        // Determine strict WebSocket protocol (ws or wss) based on window location
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        // If constructed with a relative path (e.g., "/ws"), prepend the host
        const fullUrl = this.url.startsWith("/")
            ? `${protocol}//${window.location.host}${this.url}`
            : this.url;

        this.socket = new WebSocket(fullUrl);

        this.socket.onopen = () => {
            console.log('UseSocket connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                const { type, payload } = message;

                if (this.handlers.has(type)) {
                    this.handlers.get(type)?.forEach(handler => handler(payload));
                }
            } catch (e) {
                console.error('Failed to parse WS message', e);
            }
        };

        this.socket.onclose = () => {
            console.log('UseSocket disconnected, reconnecting...');
            setTimeout(() => this.connect(), this.reconnectInterval);
        };

        this.socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            this.socket?.close();
        };
    }

    public on(type: string, handler: MessageHandler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type)?.add(handler);
    }

    public off(type: string, handler: MessageHandler) {
        this.handlers.get(type)?.delete(handler);
    }
}

// Singleton instance
let socketInstance: WebSocketClient | null = null;

export function getSocket(): WebSocketClient {
    if (!socketInstance) {
        socketInstance = new WebSocketClient('/ws');
    }
    return socketInstance;
}
