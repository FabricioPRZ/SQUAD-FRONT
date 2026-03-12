import { Injectable, signal } from '@angular/core';
import { Post } from '../components/card/card.component';

export interface SavedPost extends Post {
  isOwn: boolean; // true = publicación propia, false = guardada de otro
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts = signal<SavedPost[]>([
    {
      id: 1, isOwn: true, saved: true,
      imageUrl: '',
      userAvatar: '', username: 'Fernando', groupName: 'Doomeros',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
      timestamp: 'Hace 2 horas'
    },
    {
      id: 2, isOwn: true, saved: true,
      imageUrl: '',
      userAvatar: '', username: 'Fernando', groupName: 'FF7 Fans',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      timestamp: 'Hace 1 día'
    },
    {
      id: 3, isOwn: false, saved: true,
      imageUrl: '',
      userAvatar: '', username: 'AlphaWolf_99', groupName: 'Doomeros',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
      timestamp: 'Hace 3 días'
    },
    {
      id: 4, isOwn: false, saved: true,
      imageUrl: '',
      userAvatar: '', username: '42Phoenix', groupName: 'ARK Survivors',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/32/ARK-_Survival_Evolved_cover.jpg/250px-ARK-_Survival_Evolved_cover.jpg',
      timestamp: 'Hace 5 días'
    },
    {
      id: 5, isOwn: true, saved: true,
      imageUrl: '',
      userAvatar: '', username: 'Fernando', groupName: 'Cyber Punketos',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
      timestamp: 'Hace 1 semana'
    },
    {
      id: 6, isOwn: false, saved: true,
      imageUrl: '',
      userAvatar: '', username: 'CyberGhost_X', groupName: 'Halo Legends',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/9/92/Halo_4_box_art.png',
      timestamp: 'Hace 2 semanas'
    }
  ]);

  getAll() { return this.posts; }

  getSaved()   { return this.posts().filter(p => !p.isOwn && p.saved); }
  getOwn()     { return this.posts().filter(p => p.isOwn); }

  deletePost(id: number) {
    this.posts.update(list => list.filter(p => p.id !== id));
  }
}
