import { Injectable, signal, computed } from '@angular/core';
import { PostsService } from '@shared/services/posts.service';
import { ToastService } from '@shared/services/toast.service';
import { AuthService } from '@features/auth/services/auth.service';
import { Post } from '@shared/components/card/card.component';

export type FilterType = 'saved' | 'own';

@Injectable({ providedIn: 'root' })
export class SavedPostsViewModelService {
  private _activeFilter = signal<FilterType>('saved');
  private _loading      = signal(true);

  private _allPosts  = signal<Post[]>([]);
  private _ownPosts  = signal<Post[]>([]);

  readonly activeFilter = this._activeFilter.asReadonly();
  readonly loading      = this._loading.asReadonly();

  readonly filteredPosts = computed<Post[]>(() =>
    this._activeFilter() === 'own' ? this._ownPosts() : this._allPosts()
  );

  constructor(
    private postsService: PostsService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  init(): void {
    this.loadAll();
  }

  setFilter(f: FilterType): void {
    this._activeFilter.set(f);
    if (f === 'own') {
      this.loadMine();
    } else {
      this.loadAll();
    }
  }

  // GET /api/posts — todas las publicaciones (tab "Guardadas")
  private loadAll(): void {
    this._loading.set(true);
    this.postsService.getAll().subscribe({
      next: (res) => {
        this._allPosts.set(res.posts);
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las publicaciones.');
        this._loading.set(false);
      }
    });
  }

  // GET /api/posts/user/:id — mis publicaciones
  private loadMine(): void {
    const userId = this.auth.currentUser()?.id;

    if (!userId) {
      this.toast.error('Error', 'No se pudo identificar al usuario.');
      this._loading.set(false);
      return;
    }

    this._loading.set(true);
    this.postsService.getMine(userId).subscribe({
      next: (res) => {
        this._ownPosts.set(res.posts);
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar tus publicaciones.');
        this._loading.set(false);
      }
    });
  }

  // DELETE /api/posts/:id
  deletePostFromOwn(post: Post): void {
    this.postsService.deletePost(post.id).subscribe({
      next: () => {
        this._ownPosts.update(list => list.filter(p => p.id !== post.id));
        this.toast.error('Publicación eliminada', 'Tu publicación fue eliminada.');
      },
      error: () =>
        this.toast.error('Error', 'No se pudo eliminar la publicación.')
    });
  }
}