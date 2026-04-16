import { Injectable, signal } from '@angular/core';
import { Group } from '../../../shared/components/sidebar/sidebar.component';
import { Post } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { PostsService } from '../../../shared/services/posts.service';

@Injectable({ providedIn: 'root' })
export class HomeViewModelService {
  private _selectedGroup = signal<Group | null>(null);
  
  // TODO: Cargar desde API cuando FeedContoller esté implementado
  private _posts = signal<Post[]>([
    { id: 1, imageUrl: '', authorAvatarUrl: '', authorUsername: 'Chocobo_Drift',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=DoomGroup',
      groupName: 'DOOM Fans', createdAt: new Date(Date.now() - 9*3600000).toISOString(), savedByCurrentUser: false, saved: false },
    { id: 2, imageUrl: '', authorAvatarUrl: '', authorUsername: 'NightWolf_99',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberpunkCrew',
      groupName: 'Cyberpunk Crew', createdAt: new Date(Date.now() - 2*3600000).toISOString(), savedByCurrentUser: true, saved: true },
    { id: 3, imageUrl: '', authorAvatarUrl: '', authorUsername: 'StarLord_GG',
      groupImage: 'https://api.dicebear.com/7.x/identicon/svg?seed=ProGamers',
      groupName: 'Pro Gamers', createdAt: new Date(Date.now() - 5*3600000).toISOString(), savedByCurrentUser: false, saved: false }
  ]);

  readonly selectedGroup = this._selectedGroup.asReadonly();
  readonly posts = this._posts.asReadonly();

  constructor(
    private postsService: PostsService,
    private toast: ToastService
  ) {}

  selectGroup(group: Group): void {
    if (!group.id) {
      this._selectedGroup.set(null);
    } else {
      this._selectedGroup.set(group);
    }
  }

  closeChat(): void {
    this._selectedGroup.set(null);
  }

  toggleSavePost(postId: number): void {
    // Si la API de posts soporta esto con mock data, podríamos llamarla.
    // Por ahora, solo lo actualizaremos localmente
    this._posts.update(posts => 
      posts.map(p => p.id === postId ? { ...p, saved: !p.saved, savedByCurrentUser: !p.savedByCurrentUser } : p)
    );
    
    // Aquí iría la llamada al backend real que sí existe:
    // this.postsService.toggleSave(postId).subscribe(...)
  }
}
