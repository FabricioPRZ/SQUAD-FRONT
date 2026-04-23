import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyCardComponent, Lobby } from '../../../../shared/components/lobby-card/lobby-card.component';
import { LobbyResponse } from '../../../../features/lobbys/models/lobby-response';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { LobbysViewModelService } from '../../../../features/lobbys/viewmodels/lobbys-view-model.service';

@Component({
  selector: 'app-lobbys',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, LobbyCardComponent],
  templateUrl: './lobbys.component.html',
  styleUrls: ['./lobbys.component.css']
})
export class LobbysComponent implements OnInit {

  constructor(
    public vm: LobbysViewModelService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() { this.vm.init(); }

  toLobbyCard(lr: LobbyResponse): Lobby {
    return {
      id:            lr.id,
      name:          lr.name,
      description:   lr.description ?? '',
      image:         lr.image ?? null,
      ownerUsername: lr.ownerUsername ?? '',
      createdAt:     lr.createdAt,
      isOwner:       lr.isOwner ?? false,
    };
  }

  async onDelete(lobby: LobbyResponse) {
    const ok = await this.confirm.open({
      title: '¿Eliminar lobby?',
      message: `¿Estás seguro de que quieres eliminar "${lobby.name}"? Esta acción es permanente.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (ok) this.vm.delete(lobby.id, lobby.name);
  }

  async onLeave(lobby: LobbyResponse) {
    const ok = await this.confirm.open({
      title: '¿Abandonar lobby?',
      message: `¿Estás seguro de que quieres abandonar "${lobby.name}"?`,
      confirmText: 'Sí, abandonar',
      cancelText: 'Quedarse',
      type: 'warning'
    });
    if (ok) this.vm.leave(lobby.id, lobby.name);
  }
}