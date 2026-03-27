import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Alineado con PostResponse del backend */
export interface Post {
  id: number;
  /** URL de la primera imagen del post (media[0].url en PostResponse) */
  imageUrl?: string;
  /** authorAvatarUrl en PostResponse */
  authorAvatarUrl?: string;
  /** authorUsername en PostResponse */
  authorUsername: string;
  /** Nombre del lobby/grupo — enriquecido en el frontend */
  groupName?: string;
  groupImage?: string;
  /** Fecha ISO del backend, formateada en el template */
  createdAt?: string;
  /** savedByCurrentUser en PostResponse */
  savedByCurrentUser?: boolean;
  /** Alias local para retrocompatibilidad con templates que usen 'saved' */
  saved?: boolean;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() post!: Post;

  toggleSave() {
    if (this.post) {
      this.post.savedByCurrentUser = !this.post.savedByCurrentUser;
      this.post.saved = this.post.savedByCurrentUser;
    }
  }
}
