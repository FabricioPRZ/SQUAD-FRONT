import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Alineado con LobbyResponse del backend */
export interface Lobby {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  memberCount: number;
  maxMembers: number;
  ownerUsername: string;
  /** Calculado en el frontend: ownerUsername === currentUser.username */
  isOwner: boolean;
  tags: string[];
  lobbyType?: string;
  privacy?: string;
  gameName?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-lobby-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby-card.component.html',
  styleUrls: ['./lobby-card.component.css']
})
export class LobbyCardComponent {
  @Input() lobby!: Lobby;
  @Output() edit   = new EventEmitter<Lobby>();
  @Output() delete = new EventEmitter<Lobby>();
  @Output() leave  = new EventEmitter<Lobby>();

  onEdit()   { this.edit.emit(this.lobby); }
  onDelete() { this.delete.emit(this.lobby); }
  onLeave()  { this.leave.emit(this.lobby); }
}
