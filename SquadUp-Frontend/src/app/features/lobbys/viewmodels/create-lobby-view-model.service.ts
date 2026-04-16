import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '../services/lobby.service';
import { LobbyRequest, LobbyType, LobbyPrivacy } from '../models/lobby-request';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class CreateLobbyViewModelService {
  private _isEditMode  = signal(false);
  private _editLobbyId = signal<number | null>(null);
  
  private _name        = signal('');
  private _description = signal('');
  private _gameId      = signal<number | null>(null);
  private _lobbyType   = signal<LobbyType>('CASUAL');
  private _privacy     = signal<LobbyPrivacy>('PUBLIC');
  private _maxMembers  = signal<number>(4);
  private _tags        = signal<string[]>([]);
  private _imageUrl    = signal<string | null>(null);
  
  private _loading     = signal(false);
  private _error       = signal<string | null>(null);

  readonly isEditMode  = this._isEditMode.asReadonly();
  readonly editLobbyId = this._editLobbyId.asReadonly();
  
  readonly name        = this._name.asReadonly();
  readonly description = this._description.asReadonly();
  readonly gameId      = this._gameId.asReadonly();
  readonly lobbyType   = this._lobbyType.asReadonly();
  readonly privacy     = this._privacy.asReadonly();
  readonly maxMembers  = this._maxMembers.asReadonly();
  readonly tags        = this._tags.asReadonly();
  readonly imageUrl    = this._imageUrl.asReadonly();
  
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

  setName(v: string):              void { this._name.set(v);        this._error.set(null); }
  setDescription(v: string):       void { this._description.set(v); }
  setGameId(v: number | null):     void { this._gameId.set(v); }
  setLobbyType(v: LobbyType):      void { this._lobbyType.set(v); }
  setPrivacy(v: LobbyPrivacy):     void { this._privacy.set(v); }
  setMaxMembers(v: number):        void { this._maxMembers.set(v); }
  setTags(v: string[]):            void { this._tags.set(v); }
  setImageUrl(v: string | null):   void { this._imageUrl.set(v); }

  toggleTag(tag: string): void {
    const t = tag.trim();
    if (!t) return;
    this._tags.update(tags => {
      if (tags.includes(t)) {
        return tags.filter(existing => existing !== t);
      } else {
        return [...tags, t];
      }
    });
  }

  loadLobbyForEdit(id: number): void {
    this._isEditMode.set(true);
    this._editLobbyId.set(id);
    this._loading.set(true);
    
    this.lobbyService.getMyLobbies().subscribe({
      next: (lobbies) => {
        const lobby = lobbies.find(l => l.id === id);
        if (lobby) {
          this._name.set(lobby.name);
          this._description.set(lobby.description || '');
          this._lobbyType.set((lobby.lobbyType as LobbyType) ?? 'CASUAL');
          this._privacy.set((lobby.privacy as LobbyPrivacy) ?? 'PUBLIC');
          this._maxMembers.set(lobby.maxMembers ?? 4);
          this._tags.set([...(lobby.tags || [])]);
          this._imageUrl.set(lobby.imageUrl || null);
        } else {
          this.toast.error('Error', 'No se pudo cargar el lobby.');
        }
        this._loading.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo cargar el lobby.');
        this._loading.set(false);
      }
    });
  }

  submit(): void {
    if (!this.isFormValid() || this._loading()) return;

    const payload: LobbyRequest = {
      name:        this._name().trim(),
      description: this._description().trim() || undefined,
      gameId:      this._gameId() ?? undefined,
      lobbyType:   this._lobbyType(),
      privacy:     this._privacy(),
      maxMembers:  this._maxMembers(),
      tags:        this._tags().length > 0 ? this._tags() : undefined,
      imageUrl:    this._imageUrl() || undefined
    };

    console.log('📤 Payload a enviar:', payload);

    this._loading.set(true);

    if (this._isEditMode() && this._editLobbyId()) {
      this.lobbyService.update(this._editLobbyId()!, payload).subscribe({
        next: () => {
          this._loading.set(false);
          this.toast.success('Lobby actualizado', `Los cambios en "${payload.name}" se guardaron.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          console.error('❌ Error completo:', err);
          console.error('❌ Error.error:', err.error);
          console.error('❌ Status:', err.status);
          
          this._loading.set(false);
          this._error.set(err?.error?.message ?? 'Error al actualizar el lobby');
          this.toast.error('Error', this._error()!);
        }
      });
    } else {
      this.lobbyService.create(payload).subscribe({
        next: () => {
          this._loading.set(false);
          this.toast.success('Lobby creado', `"${payload.name}" fue creado con éxito.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          console.error('❌ Error completo:', err);
          console.error('❌ Error.error:', err.error);
          console.error('❌ Status:', err.status);
          
          this._loading.set(false);
          this._error.set(err?.error?.message ?? 'Error al crear el lobby');
          this.toast.error('Error', this._error()!);
        }
      });
    }
  }

  reset(): void {
    this._isEditMode.set(false);
    this._editLobbyId.set(null);
    this._name.set('');
    this._description.set('');
    this._gameId.set(null);
    this._lobbyType.set('CASUAL');
    this._privacy.set('PUBLIC');
    this._maxMembers.set(4);
    this._tags.set([]);
    this._imageUrl.set(null);
    this._error.set(null);
  }
}
