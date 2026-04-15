import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CardComponent, Post } from '../../../../shared/components/card/card.component';
import { PostsService } from '../../../../shared/services/posts.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

type FilterType = 'saved' | 'own';

@Component({
  selector: 'app-saved-posts',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CardComponent],
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent implements OnInit {

  activeFilter = signal<FilterType>('saved');
  loading = signal(true);

  private savedPosts = signal<Post[]>([]);
  private ownPosts = signal<Post[]>([]);

  filteredPosts = computed<Post[]>(() => {
    return this.activeFilter() === 'own' ? this.ownPosts() : this.savedPosts();
  });

  constructor(
    private postsService: PostsService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    this.loadSaved();
  }

  setFilter(f: FilterType) {
    this.activeFilter.set(f);
    if (f === 'own') {
      this.loadMine();
    } else {
      this.loadSaved();
    }
  }

  private loadSaved() {
    this.loading.set(true);
    this.postsService.getSaved().subscribe({
      next: (posts) => {
        this.savedPosts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las publicaciones guardadas.');
        this.loading.set(false);
      }
    });
  }

  private loadMine() {
    this.loading.set(true);
    this.postsService.getMine().subscribe({
      next: (posts) => {
        this.ownPosts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar tus publicaciones.');
        this.loading.set(false);
      }
    });
  }

  async deletePost(post: Post, isOwn: boolean) {
    const ok = await this.confirm.open({
      title: isOwn ? '¿Eliminar publicación?' : '¿Quitar publicación guardada?',
      message: isOwn
        ? 'Esta publicación será eliminada permanentemente.'
        : 'Se quitará de tus publicaciones guardadas.',
      confirmText: isOwn ? 'Sí, eliminar' : 'Sí, quitar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!ok) return;

    if (isOwn) {
      // Eliminar publicación propia (soft-delete en backend)
      this.postsService.deletePost(post.id).subscribe({
        next: () => {
          this.ownPosts.update(list => list.filter(p => p.id !== post.id));
          this.toast.error('Publicación eliminada', 'Tu publicación fue eliminada.');
        },
        error: () => this.toast.error('Error', 'No se pudo eliminar la publicación.')
      });
    } else {
      // Quitar de guardados (toggle)
      this.postsService.toggleSave(post.id).subscribe({
        next: () => {
          this.savedPosts.update(list => list.filter(p => p.id !== post.id));
          this.toast.error('Publicación quitada', 'Se eliminó de tus guardados.');
        },
        error: () => this.toast.error('Error', 'No se pudo quitar la publicación.')
      });
    }
  }
}
