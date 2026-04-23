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

  async deletePost(post: Post) {
    const ok = await this.confirm.open({
      title: '¿Eliminar publicación?',
      message: 'Esta publicación será eliminada permanentemente.',
      confirmText: 'Sí, eliminar',
      cancelText: 'cancelar',
      type: 'danger'
    });

    if (!ok) return;
    this.vm.deletePostFromOwn(post);
  }
}