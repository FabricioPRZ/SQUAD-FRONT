import { Component, OnDestroy, ElementRef, ViewChild, effect, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ChatViewModelService } from '../../viewmodels/chat-view-model.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  @Input() lobbyId: number | null = null;
  @Output() closeChat = new EventEmitter<void>();

  newMessage = '';

  constructor(
    public vm: ChatViewModelService,
    private route: ActivatedRoute
  ) {
    effect(() => {
      this.vm.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnInit() {
    if (this.lobbyId) {
      this.vm.init(this.lobbyId);
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.lobbyId = Number(id);
          this.vm.init(this.lobbyId);
        }
      });
    }
  }

  ngOnDestroy() {
    this.vm.destroy();
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.lobbyId) return;
    this.vm.sendMessage(this.lobbyId, this.newMessage.trim(), 'text');
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
      if (this.lobbyId) {
        this.vm.sendMessage(this.lobbyId, base64, 'image');
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  onClose() {
    this.closeChat.emit();
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
