import { Injectable, signal } from '@angular/core';
import { LobbyService } from '../services/lobby.service';
import { LobbyResponse } from '../models/lobby-response';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class LobbysViewModelService {

  // --- State ---
  private _myLobbies     = signal<LobbyResponse[]>([]);
  private _joinedLobbies = signal<LobbyResponse[]>([]);
  private _loading       = signal(false);
  private _error         = signal<string | null>(null);

  // --- Readonly ---
  readonly myLobbies     = this._myLobbies.asReadonly();
  readonly joinedLobbies = this._joinedLobbies.asReadonly();
  readonly loading       = this._loading.asReadonly();
  readonly error         = this._error.asReadonly();

  constructor(
    private lobbyService: LobbyService,
    private toast: ToastService
  ) {}

  loadMyLobbies(): void {
    this._loading.set(true);
    this.lobbyService.getMyLobbies().subscribe({
      next: (data) => { this._myLobbies.set(data);  this._loading.set(false); },
      error: ()     => { this._loading.set(false);   this._error.set('Error al cargar tus lobbies'); }
    });
  }

  loadJoinedLobbies(): void {
    this._loading.set(true);
    this.lobbyService.getJoinedLobbies().subscribe({
      next: (data) => { this._joinedLobbies.set(data); this._loading.set(false); },
      error: ()     => { this._loading.set(false);      this._error.set('Error al cargar lobbies unidos'); }
    });
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

  leave(id: number): void {
    this.lobbyService.leave(id).subscribe({
      next: () => {
        this.toast.success('Saliste del lobby', '');
        this.loadJoinedLobbies();
      },
      error: (err) => this.toast.error('Error', err?.error?.message ?? 'No se pudo abandonar el lobby')
    });
  }

  delete(id: number): void {
    this.lobbyService.delete(id).subscribe({
      next: () => {
        this.toast.success('Lobby eliminado', '');
        this.loadMyLobbies();
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