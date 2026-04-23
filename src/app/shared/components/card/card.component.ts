import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.dev';

/** Alineado con PostResponse del backend */
export interface Post {
  id:          number;
  user_id:     number;
  lobby_id:    number | null;
  description: string | null;
  createdAt:   string;
  images?:     { id: number; post_id: number; image_url: string }[];
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

  get firstImageUrl(): string | null {
    const img = this.post.images?.[0];
    return img ? `${environment.apiUrl}/${img.image_url}` : null;
  }
}