import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Post {
  id: number;
  imageUrl: string;
  userAvatar: string;
  username: string;
  groupImage: string;
  groupName: string;
  timestamp: string;
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
      this.post.saved = !this.post.saved;
    }
  }
}
