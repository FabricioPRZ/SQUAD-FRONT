import { Injectable, signal, computed } from '@angular/core';
import { ChatService } from '../../../shared/services/chat.service';
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

  constructor(private chatService: ChatService) {}

  init(groupId: number) {
    this.chatSub = this.chatService.messages$.subscribe(dtos => {
      const messages = dtos.map(dto => ({
        id: dto.id || Date.now(),
        senderId: dto.senderId?.toString() || 'unknown',
        senderName: dto.username,
        senderAvatar: dto.avatar || '',
        text: dto.type === 'text' || dto.type === 'TEXT' ? dto.content : '',
        imageUrl: dto.type === 'image' || dto.type === 'IMAGE' ? dto.content : undefined,
        timestamp: dto.sentAt ? new Date(dto.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ahora',
        isOwn: !!dto.isOwn
      }));
      this._messages.set(messages);
    });
    this.chatService.connectToLobby(groupId);
  }

  destroy() {
    this.chatSub?.unsubscribe();
    this.chatService.disconnect();
  }

  sendMessage(groupId: number, content: string, type: 'text' | 'image') {
    if (!content.trim()) return;
    this.chatService.sendMessage(groupId, content.trim(), type);
  }
}
