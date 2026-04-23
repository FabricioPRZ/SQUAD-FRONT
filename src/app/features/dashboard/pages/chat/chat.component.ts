import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../../shared/components/sidebar/sidebar.component';
import { ChatViewModelService } from '../../viewmodels/chat-view-model.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnChanges, OnDestroy {
  @Input() group!: Group;
  @Output() closeChat = new EventEmitter<void>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  newMessage = '';

  constructor(public vm: ChatViewModelService) {
    effect(() => {
      this.vm.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['group'] && this.group) {
      this.vm.init(Number(this.group.id));
    }
  }

  ngOnDestroy() {
    this.vm.destroy();
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.vm.sendMessage(Number(this.group.id), this.newMessage.trim(), 'text');
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
      this.vm.sendMessage(Number(this.group.id), base64, 'image');
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
