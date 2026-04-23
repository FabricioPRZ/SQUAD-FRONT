import { Injectable, signal, computed } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { LobbyResponse } from '../models/lobby-response';
import { ToastService } from '../../../shared/services/toast.service';

type FilterType = 'all' | 'owned';

@Injectable({ providedIn: 'root' })
export class LobbysViewModelService {

  private _allLobbies = signal<LobbyResponse[]>([]);
  private _myLobbies  = signal<LobbyResponse[]>([]);
  private _loading    = signal(false);
  private _error      = signal<string | null>(null);
  private _activeFilter = signal<FilterType>('all');

  readonly allLobbies   = this._allLobbies.asReadonly();
  readonly myLobbies    = this._myLobbies.asReadonly();
  readonly loading      = this._loading.asReadonly();
  readonly error        = this._error.asReadonly();
  readonly activeFilter = this._activeFilter.asReadonly();

  readonly filteredLobbies = computed<LobbyResponse[]>(() => {
    if (this._activeFilter() === 'owned') return this._myLobbies();
    return this._allLobbies();
  });

  constructor(
    private lobbyService: LobbyService,
    private toast: ToastService
  ) {}

  init(): void {
    this.loadAll();
    this.loadMyLobbies();
  }

  loadAll(): void {
    this._loading.set(true);
    this.lobbyService.getAll().subscribe({
      next: ({ lobbys }) => {
        this._allLobbies.set(this.lobbyService.withOwnerFlag(lobbys));
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Error al cargar los lobbies');
        this.toast.error('Error', 'No se pudieron cargar los lobbies.');
      }
    });
  }

  loadMyLobbies(): void {
    this.lobbyService.getMyLobbies().subscribe({
      next: ({ lobbys }) => {
        this._myLobbies.set(this.lobbyService.withOwnerFlag(lobbys));
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar tus lobbies.');
      }
    });
  }

  setFilter(filter: FilterType): void {
    this._activeFilter.set(filter);
  }

  join(id: number): void {
    this.lobbyService.join(id).subscribe({
      next: (res) => {
        this.toast.success('¡Listo!', res.message);
        this.loadAll();
      },
      error: (err) => this.toast.error('Error', err?.error?.error ?? 'No se pudo unir al lobby')
    });
  }

  leave(id: number, lobbyName: string): void {
    this.lobbyService.leave(id).subscribe({
      next: (res) => {
        this.toast.info('Abandonaste el lobby', res.message ?? `Ya no eres parte de "${lobbyName}".`);
        this.loadAll();
      },
      error: (err) => this.toast.error('Error', err?.error?.error ?? 'No se pudo abandonar el lobby')
    });
  }

  delete(id: number, lobbyName: string): void {
    this.lobbyService.delete(id).subscribe({
      next: () => {
        this._allLobbies.update(list => list.filter(l => l.id !== id));
        this._myLobbies.update(list => list.filter(l => l.id !== id));
        this.toast.error('Lobby eliminado', `"${lobbyName}" fue eliminado.`);
      },
      error: (err) => this.toast.error('Error', err?.error?.error ?? 'No se pudo eliminar el lobby')
    });
  }
}