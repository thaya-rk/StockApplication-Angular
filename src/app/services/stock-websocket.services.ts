import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockWebSocketService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:8080/ws/stock');

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected to Spring Boot');
    };

    this.socket.onclose = (event) => {
      console.log('❌ WebSocket closed:', event);
    };

    this.socket.onerror = (error) => {
      console.error('⚠️ WebSocket error:', error);
    };
  }

  public onMessage(callback: (data: any) => void): void {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      callback(message);
    };
  }

  // ✅ Add this method to send subscription request
  public subscribeToSymbols(symbols: string[]): void {
    const payload = {
      event: 'subscribe',
      symbols: symbols
    };

    // Send when WebSocket is open, or wait a bit
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    } else {
      this.socket.onopen = () => {
        console.log('🔁 Subscribing to symbols after open');
        this.socket.send(JSON.stringify(payload));
      };
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
