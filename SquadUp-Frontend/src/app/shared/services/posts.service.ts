import { Injectable, signal } from '@angular/core';
import { Post } from '../components/card/card.component';

/** Extiende Post con indicador de propiedad — usado en la vista Guardados */
export interface SavedPost extends Post {
  isOwn: boolean;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  /**
   * Lista reactiva de posts.
   * TODO: Reemplazar con llamadas al backend cuando el endpoint de posts esté listo.
   * Los campos ya usan los nombres del PostResponse del backend.
   */
  private posts = signal<SavedPost[]>([
    {
      id: 1, isOwn: true, savedByCurrentUser: true, saved: true,
      imageUrl: '',
      authorAvatarUrl: '',
      authorUsername: 'Fernando',
      groupName: 'Doomeros',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
    },
    {
      id: 2, isOwn: true, savedByCurrentUser: true, saved: true,
      imageUrl: '',
      authorAvatarUrl: '',
      authorUsername: 'Fernando',
      groupName: 'FF7 Fans',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Final_Fantasy_VII_Box_Art.jpg',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3, isOwn: false, savedByCurrentUser: true, saved: true,
      imageUrl: '',
      authorAvatarUrl: '',
      authorUsername: 'AlphaWolf_99',
      groupName: 'Doomeros',
      groupImage: 'https://upload.wikimedia.org/wikipedia/en/5/57/Doom_cover_art.jpg',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
  ]);

  getAll()   { return this.posts; }
  getSaved() { return this.posts().filter(p => !p.isOwn && p.savedByCurrentUser); }
  getOwn()   { return this.posts().filter(p => p.isOwn); }

  deletePost(id: number) {
    this.posts.update(list => list.filter(p => p.id !== id));
  }
}
