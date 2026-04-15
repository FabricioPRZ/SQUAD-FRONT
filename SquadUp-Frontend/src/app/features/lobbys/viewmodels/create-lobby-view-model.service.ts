import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '../services/lobby.service';
import { LobbyRequest, LobbyType, LobbyPrivacy } from '../models/lobby-request';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class CreateLobbyViewModelService {

  // --- State ---
  private _name        = signal('');
  private _description = signal('');
  private _gameId      = signal<number | null>(null);
  private _lobbyType   = signal<LobbyType>('CASUAL');
  private _privacy     = signal<LobbyPrivacy>('PUBLIC');
  private _maxMembers  = signal<number>(10);
  private _tags        = signal<string[]>([]);
  private _loading     = signal(false);
  private _error       = signal<string | null>(null);

  // --- Readonly ---
  readonly name        = this._name.asReadonly();
  readonly description = this._description.asReadonly();
  readonly gameId      = this._gameId.asReadonly();
  readonly lobbyType   = this._lobbyType.asReadonly();
  readonly privacy     = this._privacy.asReadonly();
  readonly maxMembers  = this._maxMembers.asReadonly();
  readonly tags        = this._tags.asReadonly();
  readonly loading     = this._loading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly isFormValid = computed(() =>
    this._name().trim().length > 0 &&
    this._maxMembers() >= 2 &&
    this._maxMembers() <= 500
  );

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private toast: ToastService
  ) {}

  // --- Setters ---
  setName(v: string):              void { this._name.set(v);        this._error.set(null); }
  setDescription(v: string):       void { this._description.set(v); }
  setGameId(v: number | null):     void { this._gameId.set(v); }
  setLobbyType(v: LobbyType):      void { this._lobbyType.set(v); }
  setPrivacy(v: LobbyPrivacy):     void { this._privacy.set(v); }
  setMaxMembers(v: number):        void { this._maxMembers.set(v); }
  setTags(v: string[]):            void { this._tags.set(v); }

  addTag(tag: string): void {
    const t = tag.trim();
    if (t && !this._tags().includes(t)) {
      this._tags.update(tags => [...tags, t]);
    }
  }

  removeTag(tag: string): void {
    this._tags.update(tags => tags.filter(t => t !== tag));
  }

  // --- Actions ---
  create(): void {
    if (!this.isFormValid() || this._loading()) return;

    const payload: LobbyRequest = {
      name:        this._name().trim(),
      description: this._description().trim() || undefined,
      gameId:      this._gameId() ?? undefined,
      lobbyType:   this._lobbyType(),
      privacy:     this._privacy(),
      maxMembers:  this._maxMembers(),
      tags:        this._tags().length > 0 ? this._tags() : undefined
    };

    this._loading.set(true);

    this.lobbyService.create(payload).subscribe({
      next: () => {
        this._loading.set(false);
        this.toast.success('¡Lobby creado!', `"${payload.name}" está listo.`);
        this.router.navigate(['/lobbys']);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'Error al crear el lobby');
      }
    });
  }

  reset(): void {
    this._name.set('');
    this._description.set('');
    this._gameId.set(null);
    this._lobbyType.set('CASUAL');
    this._privacy.set('PUBLIC');
    this._maxMembers.set(10);
    this._tags.set([]);
    this._error.set(null);
  }
}