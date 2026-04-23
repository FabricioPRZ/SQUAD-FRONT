import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '@features/auth/services/auth.service';
import { environment } from '@env';

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

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private socket: Socket | null = null;
  private activeLobbyId: number | null = null;

  private messagesSubject = new BehaviorSubject<ChatMessageDto[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private messageHistorySubject = new Subject<ChatMessageDto[]>();
  public messageHistory$ = this.messageHistorySubject.asObservable();

  constructor(private authService: AuthService) {}

  public connectToLobby(lobbyId: number) {
    if (this.socket?.connected && this.activeLobbyId === lobbyId) return;

    this.disconnect();
    this.activeLobbyId = lobbyId;
    this.messagesSubject.next([]);

    this.socket = io(environment.apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.socket?.emit('join_lobby', { lobby_id: lobbyId });
    });

    this.socket.on('message_history', (history: ChatMessageDto[]) => {
      const mapped = history.map(msg => ({
        ...msg,
        isOwn: msg.senderId === this.authService.currentUser()?.id
      }));
      this.messagesSubject.next(mapped);
    });

    this.socket.on('new_message', (msg: ChatMessageDto) => {
      const payload: ChatMessageDto = {
        ...msg,
        isOwn: msg.senderId === this.authService.currentUser()?.id
      };
      const currentMessages = this.messagesSubject.getValue();
      this.messagesSubject.next([...currentMessages, payload]);
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });
  }

  public sendMessage(lobbyId: number, content: string, type: 'text' | 'image' = 'text') {
    if (this.socket?.connected) {
      this.socket.emit('send_message', {
        lobby_id: lobbyId,
        content,
        type: type.toUpperCase()
      });
    } else {
      console.error('Socket.IO not connected.');
    }
  }

  public getCurrentUser() {
    return this.authService.currentUser();
  }

  public disconnect() {
    if (this.socket && this.activeLobbyId) {
      this.socket.emit('leave_lobby', { lobby_id: this.activeLobbyId });
    }
    this.socket?.disconnect();
    this.socket = null;
    this.activeLobbyId = null;
  }

  ngOnDestroy() {
    this.disconnect();
  }
}