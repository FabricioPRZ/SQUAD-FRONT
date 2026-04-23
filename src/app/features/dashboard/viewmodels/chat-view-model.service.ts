import { Injectable, signal } from '@angular/core';
import { ChatService, ChatMessageDto } from '@shared/services/chat.service';
import { Subscription } from 'rxjs';

export interface ChatMessage {
  id: number;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  imageUrl?: string;
  timestamp: string;
  isOwn: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatViewModelService {
  private _messages = signal<ChatMessage[]>([]);
  readonly messages = this._messages.asReadonly();
  
  private chatSub?: Subscription;
  private currentUserId?: number;

  constructor(private chatService: ChatService) {}

  init(lobbyId: number) {
    const user = this.chatService.getCurrentUser();
    this.currentUserId = user?.id;

    this.chatSub = this.chatService.messages$.subscribe(dtos => {
      const messages = dtos.map((dto: ChatMessageDto) => ({
        id: dto.id || Date.now(),
        senderId: dto.senderId?.toString() || 'unknown',
        senderName: dto.username || 'Usuario',
        senderAvatar: dto.avatar || '',
        text: dto.type === 'TEXT' ? dto.content : '',
        imageUrl: dto.type === 'IMAGE' ? dto.content : undefined,
        timestamp: dto.sentAt ? new Date(dto.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ahora',
        isOwn: !!dto.isOwn
      }));
      this._messages.set(messages);
    });
    this.chatService.connectToLobby(lobbyId);
  }

  destroy() {
    this.chatSub?.unsubscribe();
    this.chatService.disconnect();
  }

  sendMessage(lobbyId: number, content: string, type: 'text' | 'image') {
    if (!content.trim()) return;
    
    const tempMessage: ChatMessage = {
      id: Date.now(),
      senderId: this.currentUserId?.toString() || '0',
      senderName: 'Tú',
      senderAvatar: '',
      text: type === 'text' ? content : '',
      imageUrl: type === 'image' ? content : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    this._messages.update(msgs => [...msgs, tempMessage]);
    this.chatService.sendMessage(lobbyId, content, type);
  }
}
