import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CardComponent, Post } from '../../../../shared/components/card/card.component';
import { PostsService, SavedPost } from '../../../../shared/services/posts.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

type FilterType = 'saved' | 'own';

@Component({
  selector: 'app-saved-posts',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CardComponent],
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent {
  activeFilter = signal<FilterType>('saved');

  constructor(
    private postsService: PostsService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  filteredPosts = computed(() => {
    const f = this.activeFilter();
    if (f === 'own') return this.postsService.getOwn();
    return this.postsService.getSaved();
  });

  setFilter(f: FilterType) { this.activeFilter.set(f); }

  async deletePost(post: SavedPost) {
    const isOwn = post.isOwn;
    const ok = await this.confirm.open({
      title: isOwn ? '¿Eliminar publicación?' : '¿Quitar publicación guardada?',
      message: isOwn
        ? 'Esta publicación será eliminada permanentemente de tu historial.'
        : 'Se quitará de tus publicaciones guardadas.',
      confirmText: isOwn ? 'Sí, eliminar' : 'Sí, quitar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (ok) {
      this.postsService.deletePost(post.id);
      this.toast.error(
        isOwn ? 'Publicación eliminada' : 'Publicación quitada',
        isOwn ? 'La publicación fue eliminada de tu historial.' : 'Fue removida de tus guardados.'
      );
    }
  }
}
