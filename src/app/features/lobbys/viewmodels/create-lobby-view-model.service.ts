import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '../services/lobby.service';
import { LobbyRequest } from '../models/lobby-request';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class CreateLobbyViewModelService {

  private _isEditMode   = signal(false);
  private _editLobbyId  = signal<number | null>(null);

  private _name         = signal('');
  private _description  = signal('');
  private _imageFile    = signal<File | null>(null);
  private _imagePreview = signal<string | null>(null);

  private _loading      = signal(false);
  private _error        = signal<string | null>(null);

  readonly isEditMode   = this._isEditMode.asReadonly();
  readonly editLobbyId  = this._editLobbyId.asReadonly();
  readonly name         = this._name.asReadonly();
  readonly description  = this._description.asReadonly();
  readonly imageFile    = this._imageFile.asReadonly();
  readonly imagePreview = this._imagePreview.asReadonly();
  readonly loading      = this._loading.asReadonly();
  readonly error        = this._error.asReadonly();

  readonly isFormValid = computed(() => this._name().trim().length > 0);

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private toast: ToastService
  ) {}

  setName(v: string):        void { this._name.set(v);        this._error.set(null); }
  setDescription(v: string): void { this._description.set(v); }

  setImageFile(file: File): void {
    this._imageFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this._imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  clearImage(): void {
    this._imageFile.set(null);
    this._imagePreview.set(null);
  }

  loadLobbyForEdit(id: number): void {
    this._isEditMode.set(true);
    this._editLobbyId.set(id);
    this._loading.set(true);

    this.lobbyService.getById(id).subscribe({
      next: (lobby) => {
        this._name.set(lobby.name);
        this._description.set(lobby.description ?? '');
        if (lobby.image) {
          this._imagePreview.set(lobby.image);
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
      image:       this._imageFile() ?? undefined,
    };

    this._loading.set(true);

    if (this._isEditMode() && this._editLobbyId()) {
      this.lobbyService.update(this._editLobbyId()!, payload).subscribe({
        next: (lobby) => {
          this._loading.set(false);
          this.toast.success('Lobby actualizado', `Los cambios en "${lobby.name}" se guardaron.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          this._loading.set(false);
          this._error.set(err?.error?.error ?? 'Error al actualizar el lobby');
          this.toast.error('Error', this._error()!);
        }
      });
    } else {
      this.lobbyService.create(payload).subscribe({
        next: (lobby) => {
          this._loading.set(false);
          this.toast.success('Lobby creado', `"${lobby.name}" fue creado con éxito.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          this._loading.set(false);
          this._error.set(err?.error?.error ?? 'Error al crear el lobby');
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
    this._imageFile.set(null);
    this._imagePreview.set(null);
    this._error.set(null);
  }
}