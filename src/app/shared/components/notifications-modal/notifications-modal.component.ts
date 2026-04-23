import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationResponse } from '../../services/notification.service';

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
export class NotificationsModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();

  notifications: Notification[] = [];
  loading = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue && !changes['isOpen']?.previousValue) {
      this.loadNotifications();
    }
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getAll().subscribe({
      next: (response) => {
        const data = response.notifications || [];
        this.notifications = data.map((n) => this.mapNotification(n));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to load notifications');
      }
    });
  }

  private mapNotification(n: NotificationResponse): Notification {
    const timeAgo = this.getTimeAgo(n.createdAt);
    
    let type: Notification['type'] = 'info';
    let message = n.type;
    let userName = 'Usuario';
    let userAvatar = '';
    
    // Get user info from payload
    if (n.payload) {
      userName = (n.payload['actor_name'] as string) || (n.payload['user_name'] as string) || userName;
      userAvatar = (n.payload['actor_avatar'] as string) || (n.payload['user_avatar'] as string) || '';
    }
    
    switch (n.type) {
      case 'LobbyJoinRequest':
      case 'JOIN_REQUEST':
        type = 'request';
        message = 'solicitó unirse al grupo';
        break;
      case 'LobbyLeave':
      case 'LEAVE':
        type = 'alert';
        message = 'salió del grupo';
        break;
      case 'Mention':
      case 'MENTION':
        type = 'mention';
        message = 'te mencionó en un comentario';
        break;
      case 'Message':
      case 'NEW_MESSAGE':
        type = 'info';
        message = 'envió un mensaje';
        break;
      case 'GameInvite':
        type = 'request';
        message = 'te invitó a jugar';
        break;
      default:
        message = n.type;
    }

    return {
      id: n.id,
      userAvatar,
      userName,
      message,
      time: timeAgo,
      type,
      read: n.is_read
    };
  }

  private getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'ahora';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays < 7) return `hace ${diffDays} d`;
    return date.toLocaleDateString();
  }

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
    this.notificationService.markAllRead().subscribe();
  }

  markRead(notification: Notification): void {
    notification.read = true;
  }
}
