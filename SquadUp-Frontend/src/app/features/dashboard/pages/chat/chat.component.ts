import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../../shared/components/sidebar/sidebar.component';
import { ChatService, ChatMessageDto } from '../../../../shared/services/chat.service';
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

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnChanges, OnInit, OnDestroy {
  @Input() group!: Group;
  @Output() closeChat = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  newMessage = '';
  messages: ChatMessage[] = [];
  private chatSub?: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatSub = this.chatService.messages$.subscribe(dtos => {
      this.messages = dtos.map(dto => ({
        id: dto.id || Date.now(),
        senderId: dto.senderId?.toString() || 'unknown',
        senderName: dto.username,
        senderAvatar: dto.avatar || '',
        text: dto.type === 'text' || dto.type === 'TEXT' ? dto.content : '',
        imageUrl: dto.type === 'image' || dto.type === 'IMAGE' ? dto.content : undefined,
        timestamp: dto.sentAt ? new Date(dto.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ahora',
        isOwn: !!dto.isOwn
      }));
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['group'] && this.group) {
      this.chatService.connectToLobby(Number(this.group.id));
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  ngOnDestroy() {
    this.chatSub?.unsubscribe();
    this.chatService.disconnect();
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(Number(this.group.id), this.newMessage.trim(), 'text');
    this.newMessage = '';
  }

  onEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.chatService.sendMessage(Number(this.group.id), base64, 'image');
    };
    reader.readAsDataURL(file);
    input.value = ''; // reset para poder subir el mismo archivo de nuevo
  }

  close() {
    this.closeChat.emit();
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
