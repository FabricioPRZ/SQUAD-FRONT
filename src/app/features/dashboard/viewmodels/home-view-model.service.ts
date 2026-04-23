import { Injectable, signal } from '@angular/core';
import { Group } from '../../../shared/components/sidebar/sidebar.component';
import { Post } from '../../../shared/components/card/card.component';
import { ToastService } from '../../../shared/services/toast.service';
import { PostsService } from '../../../shared/services/posts.service';

@Injectable({ providedIn: 'root' })
export class HomeViewModelService {
  private _selectedGroup = signal<Group | null>(null);
  private _posts = signal<Post[]>([]);
  private _loading = signal(false);

  readonly selectedGroup = this._selectedGroup.asReadonly();
  readonly posts = this._posts.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor(
    private postsService: PostsService,
    private toast: ToastService
  ) {}

  init(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this._loading.set(true);
    this.postsService.getAll().subscribe({
      next: (res) => {
        this._posts.set(res.posts);
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las publicaciones.');
        this._loading.set(false);
      }
    });
  }

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
}