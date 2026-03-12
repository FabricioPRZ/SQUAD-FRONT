import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Notification {
  id: number;
  userAvatar: string;
  userName: string;
  message: string;
  time: string;
  type: 'info' | 'request' | 'mention' | 'alert';
  read: boolean;
}

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.css']
})
export class NotificationsModalComponent {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  notifications: Notification[] = [
    {
      id: 1,
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      userName: 'Nombre_D_Usuario01',
      message: 'salió del grupo',
      time: 'hace 2 min',
      type: 'alert',
      read: false
    },
    {
      id: 2,
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      userName: 'Nombre_D_Usuario08',
      message: 'envió una imagen',
      time: 'hace 15 min',
      type: 'info',
      read: false
    },
    {
      id: 3,
      userAvatar: 'https://i.pravatar.cc/150?img=11',
      userName: 'Nombre_D_Usuario03',
      message: 'solicitó unirse al grupo',
      time: 'hace 30 min',
      type: 'request',
      read: false
    },
    {
      id: 4,
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      userName: 'Nombre_D_Usuario02',
      message: 'te mencionó en un comentario',
      time: 'hace 1 h',
      type: 'mention',
      read: true
    }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  close(): void {
    this.closed.emit();
  }

  acceptRequest(notification: Notification, event: Event): void {
    event.stopPropagation();
    notification.read = true;
    notification.type = 'info';
    notification.message = 'solicitud aceptada ✓';
  }

  rejectRequest(notification: Notification, event: Event): void {
    event.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  markRead(notification: Notification): void {
    notification.read = true;
  }
}
