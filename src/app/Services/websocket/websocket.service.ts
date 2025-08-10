// websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../../Interfaces/Message/message';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client|undefined;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  public messages$: Observable<ChatMessage[]> = this.messageSubject.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const serverUrl = 'http://localhost:8080/ws'; // Make sure this matches your backend
    const socket = new SockJS(serverUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.onConnect = (frame) => {
      this.stompClient?.subscribe('/topic/public', (message: Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        const currentMessages = this.messageSubject.getValue();
        this.messageSubject.next([...currentMessages, chatMessage]);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  public sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
    }
  }

  public joinChat(username: string): void {
    const joinMessage: ChatMessage = {
      sender: username,
      content: `${username} has joined the chat`,
      type: 'JOIN'
    };
    this.sendMessage(joinMessage);
  }
}