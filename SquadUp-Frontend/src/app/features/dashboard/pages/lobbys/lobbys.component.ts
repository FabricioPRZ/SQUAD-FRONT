import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyCardComponent, Lobby } from '../../../../shared/components/lobby-card/lobby-card.component';
import { LobbyService, LobbyResponse } from '../../../../shared/services/lobby.service';
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
export class LobbysComponent implements OnInit {

  activeFilter = signal<FilterType>('all');
  loading = signal(true);

  private owned  = signal<LobbyResponse[]>([]);
  private joined = signal<LobbyResponse[]>([]);

  allLobbies = computed<LobbyResponse[]>(() => {
    const o = this.owned();
    const j = this.joined();
    // Evitar duplicados si un lobby propio también está en joined
    const joinedFiltered = j.filter(j => !o.some(o => o.id === j.id));
    return [...o, ...joinedFiltered];
  });

  filteredLobbies = computed<LobbyResponse[]>(() => {
    const f = this.activeFilter();
    if (f === 'owned')  return this.owned();
    if (f === 'joined') return this.joined();
    return this.allLobbies();
  });

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    this.loadLobbies();
  }

  private loadLobbies() {
    this.loading.set(true);

    this.lobbyService.getMyLobbies().subscribe({
      next: (data) => {
        this.owned.set(this.lobbyService.withOwnerFlag(data));
        this.loadJoined();
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar tus lobbies.');
        this.loading.set(false);
      }
    });
  }

  private loadJoined() {
    this.lobbyService.getJoinedLobbies().subscribe({
      next: (data) => {
        this.joined.set(this.lobbyService.withOwnerFlag(data));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  /** Convierte LobbyResponse → Lobby para el componente de tarjeta */
  toLobbyCard(lr: LobbyResponse): Lobby {
    return {
      id: lr.id,
      name: lr.name,
      description: lr.description,
      imageUrl: lr.imageUrl,
      memberCount: lr.memberCount,
      maxMembers: lr.maxMembers,
      ownerUsername: lr.ownerUsername,
      isOwner: lr.isOwner ?? false,
      tags: lr.tags,
      lobbyType: lr.lobbyType,
      privacy: lr.privacy
    };
  }

  setFilter(filter: FilterType) { this.activeFilter.set(filter); }

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

    this.lobbyService.delete(lobby.id).subscribe({
      next: () => {
        this.owned.update(list => list.filter(l => l.id !== lobby.id));
        this.toast.error('Lobby eliminado', `"${lobby.name}" fue eliminado.`);
      },
      error: () => this.toast.error('Error', 'No se pudo eliminar el lobby.')
    });
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

    this.lobbyService.leave(lobby.id).subscribe({
      next: () => {
        this.joined.update(list => list.filter(l => l.id !== lobby.id));
        this.toast.info('Abandonaste el lobby', `Ya no eres parte de "${lobby.name}".`);
      },
      error: () => this.toast.error('Error', 'No se pudo abandonar el lobby.')
    });
  }
}
