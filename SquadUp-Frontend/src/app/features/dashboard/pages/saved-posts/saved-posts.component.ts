import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CardComponent, Post } from '../../../../shared/components/card/card.component';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { SavedPostsViewModelService } from '../../viewmodels/saved-posts-view-model.service';

@Component({
  selector: 'app-saved-posts',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CardComponent],
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent implements OnInit {

  constructor(
    public vm: SavedPostsViewModelService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    this.vm.init();
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
      this.vm.deletePostFromOwn(post);
    } else {
      this.vm.removePostFromSaved(post);
    }
  }
}
