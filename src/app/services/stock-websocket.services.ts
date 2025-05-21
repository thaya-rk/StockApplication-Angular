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

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
