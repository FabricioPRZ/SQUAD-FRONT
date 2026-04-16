import { Injectable, signal, computed } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { LobbyService } from '../services/lobby.service';
import { LobbyResponse } from '../models/lobby-response';
import { ToastService } from '../../../shared/services/toast.service';

type FilterType = 'all' | 'owned' | 'joined';

@Injectable({ providedIn: 'root' })
export class LobbysViewModelService {

  // --- State ---
  private _myLobbies     = signal<LobbyResponse[]>([]);
  private _joinedLobbies = signal<LobbyResponse[]>([]);
  private _loading       = signal(false);
  private _error         = signal<string | null>(null);

  private _activeFilter  = signal<FilterType>('all');
  private _searchTag     = signal('');
  private _tagResults    = signal<LobbyResponse[] | null>(null);
  private _searchingTag  = signal(false);

  private tagSearch$ = new Subject<string>();

  // --- Readonly ---
  readonly myLobbies     = this._myLobbies.asReadonly();
  readonly joinedLobbies = this._joinedLobbies.asReadonly();
  readonly loading       = this._loading.asReadonly();
  readonly error         = this._error.asReadonly();

  readonly activeFilter  = this._activeFilter.asReadonly();
  readonly searchTag     = this._searchTag.asReadonly();
  readonly tagResults    = this._tagResults.asReadonly();
  readonly searchingTag  = this._searchingTag.asReadonly();

  readonly allLobbies = computed<LobbyResponse[]>(() => {
    const o = this._myLobbies();
    const j = this._joinedLobbies();
    const joinedFiltered = j.filter(jItem => !o.some(oItem => oItem.id === jItem.id));
    return [...o, ...joinedFiltered];
  });

  readonly filteredLobbies = computed<LobbyResponse[]>(() => {
    const tagRes = this._tagResults();
    if (tagRes !== null) return tagRes;

    const f = this._activeFilter();
    if (f === 'owned')  return this._myLobbies();
    if (f === 'joined') return this._joinedLobbies();
    return this.allLobbies();
  });

  constructor(
    private lobbyService: LobbyService,
    private toast: ToastService
  ) {
    this.setupTagSearch();
  }

  private setupTagSearch(): void {
    this.tagSearch$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(tag => {
        if (!tag.trim()) {
          this._tagResults.set(null);
          this._searchingTag.set(false);
          return of(null);
        }
        this._searchingTag.set(true);
        return this.lobbyService.getByTag(tag.trim());
      })
    ).subscribe({
      next: (results) => {
        if (results !== null) {
          this._tagResults.set(this.lobbyService.withOwnerFlag(results));
        }
        this._searchingTag.set(false);
      },
      error: () => {
        this._searchingTag.set(false);
        this.toast.error('Error', 'No se pudo buscar por tag.');
      }
    });
  }

  init(): void {
    this.loadMyLobbies();
  }

  loadMyLobbies(): void {
    this._loading.set(true);
    this.lobbyService.getMyLobbies().subscribe({
      next: (data) => {
        this._myLobbies.set(this.lobbyService.withOwnerFlag(data));
        this.loadJoinedLobbies();
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Error al cargar tus lobbies');
        this.toast.error('Error', 'No se pudieron cargar tus lobbies.');
      }
    });
  }

  loadJoinedLobbies(): void {
    this.lobbyService.getJoinedLobbies().subscribe({
      next: (data) => {
        this._joinedLobbies.set(this.lobbyService.withOwnerFlag(data));
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Error al cargar lobbies unidos');
      }
    });
  }

  setFilter(filter: FilterType): void {
    this._activeFilter.set(filter);
    this.clearTagSearch();
  }

  onSearchTagChange(tag: string): void {
    this._searchTag.set(tag);
    this.tagSearch$.next(tag);
    if (!tag.trim()) {
      this._tagResults.set(null);
    }
  }

  clearTagSearch(): void {
    this._searchTag.set('');
    this._tagResults.set(null);
    this.tagSearch$.next('');
  }

  join(id: number): void {
    this.lobbyService.join(id).subscribe({
      next: (res) => {
        this.toast.success('¡Listo!', res.message);
        this.loadJoinedLobbies();
      },
      error: (err) => this.toast.error('Error', err?.error?.message ?? 'No se pudo unir al lobby')
    });
  }

  leave(id: number, lobbyName: string): void {
    this.lobbyService.leave(id).subscribe({
      next: () => {
        this._joinedLobbies.update(list => list.filter(l => l.id !== id));
        this.toast.info('Abandonaste el lobby', `Ya no eres parte de "${lobbyName}".`);
      },
      error: (err) => this.toast.error('Error', err?.error?.message ?? 'No se pudo abandonar el lobby')
    });
  }

  delete(id: number, lobbyName: string): void {
    this.lobbyService.delete(id).subscribe({
      next: () => {
        this._myLobbies.update(list => list.filter(l => l.id !== id));
        this.toast.error('Lobby eliminado', `"${lobbyName}" fue eliminado.`);
      },
      error: (err) => this.toast.error('Error', err?.error?.message ?? 'No se pudo eliminar el lobby')
    });
  }

  reviewRequest(requestId: number, accept: boolean): void {
    this.lobbyService.reviewRequest(requestId, accept).subscribe({
      next: () => {
        this.toast.success(accept ? 'Solicitud aceptada' : 'Solicitud rechazada', '');
      },
      error: (err) => this.toast.error('Error', err?.error?.message ?? 'No se pudo procesar la solicitud')
    });
  }
}