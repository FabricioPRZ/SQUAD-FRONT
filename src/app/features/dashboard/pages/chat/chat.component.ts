import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../../shared/components/sidebar/sidebar.component';

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
export class ChatComponent implements OnChanges {
  @Input() group!: Group;
  @Output() closeChat = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  newMessage = '';

  // Mensajes de prueba
  messages: ChatMessage[] = [
    {
      id: 1,
      senderId: 'u1',
      senderName: 'SOLDIER_FirstClass',
      senderAvatar: '',
      text: '¡Acabo de terminar la parte del Templo de los Ancianos! La historia de Sephiroth me tiene enganchadísimo 🤯',
      timestamp: 'hace 9h',
      isOwn: false
    },
    {
      id: 2,
      senderId: 'u2',
      senderName: 'BusterSword_Main',
      senderAvatar: '',
      text: 'No me digas nada que apenas voy por el segundo disco! 😱 Pero sí, la banda sonora es una joya total.',
      timestamp: 'hace 7h',
      isOwn: false
    },
    {
      id: 3,
      senderId: 'me',
      senderName: 'Tú',
      senderAvatar: '',
      text: '¡Lo de Aerith duele para siempre! 💔 Pero ojo, si vas a farmear, equípate la Materia de Habilidad Enemiga.',
      timestamp: 'hace 5h',
      isOwn: true
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    // Scroll al fondo cuando cambia el grupo o llegan mensajes
    if (changes['group']) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now(),
      senderId: 'me',
      senderName: 'Tú',
      senderAvatar: '',
      text: this.newMessage.trim(),
      timestamp: 'ahora',
      isOwn: true
    };

    this.messages.push(msg);
    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 50);
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
      const msg: ChatMessage = {
        id: Date.now(),
        senderId: 'me',
        senderName: 'Tú',
        senderAvatar: '',
        text: '',
        imageUrl: e.target?.result as string,
        timestamp: 'ahora',
        isOwn: true
      };
      this.messages.push(msg);
      setTimeout(() => this.scrollToBottom(), 50);
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
