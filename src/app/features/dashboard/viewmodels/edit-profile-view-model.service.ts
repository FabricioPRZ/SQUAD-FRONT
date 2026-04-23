import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmService } from '../../../shared/services/confirm.service';
import { ProfileService, UserProfileUpdateRequest, ProfileResponse } from '../../profile/services/profile.service';

@Injectable({ providedIn: 'root' })
export class EditProfileViewModelService {
  private _name = signal('');
  private _username = signal(''); // fetched, readonly for now
  private _email = signal(''); // fetched, readonly for now
  private _bio = signal('');
  private _avatarUrl = signal<string | null>(null);

  private _loading = signal(true);
  private _updating = signal(false);

  readonly name = this._name.asReadonly();
  readonly username = this._username.asReadonly();
  readonly email = this._email.asReadonly();
  readonly bio = this._bio.asReadonly();
  readonly avatarUrl = this._avatarUrl.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly updating = this._updating.asReadonly();

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  init(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this._loading.set(true);
    this.profileService.getMyProfile().subscribe({
      next: (response: any) => {
        console.log('Profile raw response:', response);
        
        // Handle both { user: {...} } and direct {...} formats
        const profile = response.user || response;
        console.log('Profile data:', profile);
        
        // Combinar name + lastname para fullName
        const fullName = [profile.name, profile.lastname].filter(Boolean).join(' ');
        this._name.set(fullName || 'Usuario');
        this._username.set(''); // No hay username en backend
        this._email.set(profile.email || 'Sin email');
        this._avatarUrl.set(profile.profile_picture || profile.avatarUrl || null);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Profile load error:', err);
        this.toast.error('Error', 'No se pudo cargar el perfil.');
        this._loading.set(false);
      }
    });
  }

  setName(value: string): void { this._name.set(value); }
  setBio(value: string): void { this._bio.set(value); }
  
  onAvatarSelected(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => { this._avatarUrl.set(e.target.result); };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void { this._avatarUrl.set(null); }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  async saveChanges(): Promise<void> {
    if (!this._name().trim()) {
      this.toast.error('Nombre requerido', 'El nombre no puede estar vacío.');
      return;
    }

    const ok = await this.confirm.open({
      title: '¿Guardar cambios de perfil?',
      message: 'Se actualizará tu información de usuario.',
      confirmText: 'Guardar',
      cancelText: 'Seguir editando',
      type: 'success'
    });

    if (ok) {
      this._updating.set(true);
      
      // Separar nombre y apellido
      const parts = this._name().trim().split(' ');
      const name = parts[0];
      const lastname = parts.slice(1).join(' ') || '';
      
      const req: UserProfileUpdateRequest = {
        name: name,
        lastname: lastname,
        profile_picture: this._avatarUrl() || undefined
      };

      this.profileService.updateMyProfile(req).subscribe({
        next: () => {
          this._updating.set(false);
          this.toast.success('Perfil actualizado', 'Tu información fue guardada correctamente.');
          setTimeout(() => this.router.navigate(['/home']), 1000);
        },
        error: () => {
          this._updating.set(false);
          this.toast.error('Error', 'No se pudo actualizar el perfil.');
        }
      });
    }
  }
}
