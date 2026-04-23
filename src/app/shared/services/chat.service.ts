import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../../core/services/auth.service';

export interface ChatMessageDto {
  id?: number;
  senderId?: number;
  username: string;
  avatar?: string;
  content: string;
  type: string;
  sentAt?: string;
  isOwn?: boolean;
}

const WS_URL = 'http://localhost:8080/ws';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client | null = null;
  private currentSubscription: StompSubscription | null = null;
  private activeLobbyId: number | null = null;

  private messagesSubject = new BehaviorSubject<ChatMessageDto[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private authService: AuthService) {}

  public connectToLobby(lobbyId: number) {
    if (this.stompClient?.active && this.activeLobbyId === lobbyId) {
      return;
    }

    this.disconnect();
    this.activeLobbyId = lobbyId;
    this.messagesSubject.next([]);

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      },
      debug: (msg: string) => console.log('STOMP: ' + msg),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('STOMP Connected: ' + frame);

      this.currentSubscription = this.stompClient!.subscribe(
        `/topic/lobby/${lobbyId}`,
        (message: IMessage) => {
          const payload: ChatMessageDto = JSON.parse(message.body);
          
          const currentUser = this.authService.currentUser();
          payload.isOwn = payload.senderId === currentUser?.userId;

          const currentMessages = this.messagesSubject.getValue();
          this.messagesSubject.next([...currentMessages, payload]);
        }
      );
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker error: ' + frame.headers['message']);
      console.error('Details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  public sendMessage(lobbyId: number, content: string, type: 'text' | 'image' | 'gif' = 'text') {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/lobby/${lobbyId}/send`,
        body: JSON.stringify({ content, type })
      });
    } else {
      console.error('STOMP Client NOT connected.');
    }
  }

  public disconnect() {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.activeLobbyId = null;
  }
}
