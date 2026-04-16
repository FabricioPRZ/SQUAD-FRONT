import { Injectable, signal, computed } from '@angular/core';
import { PostsService } from '../../../shared/services/posts.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Post } from '../../../shared/components/card/card.component';

export type FilterType = 'saved' | 'own';

@Injectable({ providedIn: 'root' })
export class SavedPostsViewModelService {
  private _activeFilter = signal<FilterType>('saved');
  private _loading = signal(true);
  
  private _savedPosts = signal<Post[]>([]);
  private _ownPosts = signal<Post[]>([]);

  readonly activeFilter = this._activeFilter.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly filteredPosts = computed<Post[]>(() => {
    return this._activeFilter() === 'own' ? this._ownPosts() : this._savedPosts();
  });

  constructor(
    private postsService: PostsService,
    private toast: ToastService
  ) {}

  init(): void {
    this.loadSaved();
  }

  setFilter(f: FilterType): void {
    this._activeFilter.set(f);
    if (f === 'own') {
      this.loadMine();
    } else {
      this.loadSaved();
    }
  }

  private loadSaved(): void {
    this._loading.set(true);
    this.postsService.getSaved().subscribe({
      next: (posts) => {
        this._savedPosts.set(posts);
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las publicaciones guardadas.');
        this._loading.set(false);
      }
    });
  }

  private loadMine(): void {
    this._loading.set(true);
    this.postsService.getMine().subscribe({
      next: (posts) => {
        this._ownPosts.set(posts);
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar tus publicaciones.');
        this._loading.set(false);
      }
    });
  }

  deletePostFromOwn(post: Post): void {
    this.postsService.deletePost(post.id).subscribe({
      next: () => {
        this._ownPosts.update(list => list.filter(p => p.id !== post.id));
        this.toast.error('Publicación eliminada', 'Tu publicación fue eliminada.');
      },
      error: () => this.toast.error('Error', 'No se pudo eliminar la publicación.')
    });
  }
  
  removePostFromSaved(post: Post): void {
    this.postsService.toggleSave(post.id).subscribe({
      next: () => {
        this._savedPosts.update(list => list.filter(p => p.id !== post.id));
        this.toast.error('Publicación quitada', 'Se eliminó de tus guardados.');
      },
      error: () => this.toast.error('Error', 'No se pudo quitar la publicación.')
    });
  }
}
