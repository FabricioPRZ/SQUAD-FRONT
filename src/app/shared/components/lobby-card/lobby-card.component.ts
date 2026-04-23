import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Lobby {
  id:            number;
  name:          string;
  description:   string;
  image:         string | null;
  ownerUsername: string;
  createdAt:     string;
  isOwner?:      boolean;
}

@Component({
  selector: 'app-lobby-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lobby-card.component.html',
  styleUrls: ['./lobby-card.component.css']
})
export class LobbyCardComponent {
  @Input() lobby!: Lobby;
}