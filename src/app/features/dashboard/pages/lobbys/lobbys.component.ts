import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyCardComponent, Lobby } from '../../../../shared/components/lobby-card/lobby-card.component';
import { LobbyService } from '../../../../shared/services/lobby.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

type FilterType = 'all' | 'owned' | 'joined';

@Component({
  selector: 'app-lobbys',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, LobbyCardComponent],
  templateUrl: './lobbys.component.html',
  styleUrls: ['./lobbys.component.css']
})
export class LobbysComponent {
  activeFilter = signal<FilterType>('all');

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  get allLobbies(): Lobby[] { return this.lobbyService.getAll(); }

  filteredLobbies = computed(() => {
    const f = this.activeFilter();
    if (f === 'owned')  return this.allLobbies.filter(l => l.isOwner);
    if (f === 'joined') return this.allLobbies.filter(l => !l.isOwner);
    return this.allLobbies;
  });

  setFilter(filter: FilterType) { this.activeFilter.set(filter); }

  onEdit(lobby: Lobby) {
    this.router.navigate(['/dashboard/groups', lobby.id, 'edit']);
  }

  async onDelete(lobby: Lobby) {
    const ok = await this.confirm.open({
      title: '¿Eliminar lobby?',
      message: `¿Estás seguro de que quieres eliminar "${lobby.name}"? Esta acción es permanente y no se puede deshacer.`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (ok) {
      this.lobbyService.delete(lobby.id);
      this.toast.error('Lobby eliminado', `"${lobby.name}" fue eliminado permanentemente.`);
    }
  }

  async onLeave(lobby: Lobby) {
    const ok = await this.confirm.open({
      title: '¿Abandonar lobby?',
      message: `¿Estás seguro de que quieres abandonar "${lobby.name}"? Tendrás que ser invitado de nuevo para unirte.`,
      confirmText: 'Sí, abandonar',
      cancelText: 'Quedarse',
      type: 'warning'
    });
    if (ok) {
      this.toast.info('Abandonaste el lobby', `Ya no eres parte de "${lobby.name}".`);
    }
  }
}
