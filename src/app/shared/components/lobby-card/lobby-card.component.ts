import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Lobby {
  id:          number;
  name:        string;
  description: string;
  image:       string | null;
  owner_id:    number;
  createdAt:   string;
  isOwner?:    boolean;
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