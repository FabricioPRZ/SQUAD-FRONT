import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyCardComponent, Lobby } from '../../../../shared/components/lobby-card/lobby-card.component';
import { LobbyResponse } from '../../../../features/lobbys/models/lobby-response';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { LobbysViewModelService } from '../../../../features/lobbys/viewmodels/lobbys-view-model.service';

@Component({
  selector: 'app-lobbys',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, LobbyCardComponent],
  templateUrl: './lobbys.component.html',
  styleUrls: ['./lobbys.component.css']
})
export class LobbysComponent implements OnInit {

  constructor(
    public vm: LobbysViewModelService,
    private router: Router,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    this.vm.init();
  }

  toLobbyCard(lr: LobbyResponse): Lobby {
    return {
      id: lr.id,
      name: lr.name,
      description: lr.description || '',
      imageUrl: lr.imageUrl || 'https://via.placeholder.com/150',
      memberCount: lr.memberCount,
      maxMembers: lr.maxMembers,
      ownerUsername: lr.ownerUsername,
      isOwner: lr.isOwner ?? false,
      tags: lr.tags || [],
      lobbyType: lr.lobbyType,
      privacy: lr.privacy
    };
  }

  onEdit(lobby: LobbyResponse) {
    this.router.navigate(['/dashboard/groups', lobby.id, 'edit']);
  }

  async onDelete(lobby: LobbyResponse) {
    const ok = await this.confirm.open({
      title: '¿Eliminar lobby?',
      message: `¿Estás seguro de que quieres eliminar "${lobby.name}"? Esta acción es permanente.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (!ok) return;

    this.vm.delete(lobby.id, lobby.name);
  }

  async onLeave(lobby: LobbyResponse) {
    const ok = await this.confirm.open({
      title: '¿Abandonar lobby?',
      message: `¿Estás seguro de que quieres abandonar "${lobby.name}"?`,
      confirmText: 'Sí, abandonar',
      cancelText: 'Quedarse',
      type: 'warning'
    });
    if (!ok) return;

    this.vm.leave(lobby.id, lobby.name);
  }
}
