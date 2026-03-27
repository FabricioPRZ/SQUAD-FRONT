import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  profileData = {
    name: 'Fernando',
    username: 'fernando_mx',
    email: '233373@ids.upchiapas.edu.mx',
    bio: '',
    avatar: null as string | null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showPassSection = false;
  showCurrentPass = false;
  showNewPass = false;
  showConfirmPass = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.profileData.avatar = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() { this.profileData.avatar = null; }

  toggleCurrentPassword() { this.showCurrentPass = !this.showCurrentPass; }
  toggleNewPassword() { this.showNewPass = !this.showNewPass; }
  toggleConfirmPassword() { this.showConfirmPass = !this.showConfirmPass; }

  cancel() { this.router.navigate(['/home']); }

  async onSubmit() {
    if (!this.profileData.name.trim()) {
      this.toast.error('Nombre requerido', 'El nombre no puede estar vacío.');
      return;
    }
    if (this.showPassSection) {
      if (this.profileData.newPassword !== this.profileData.confirmPassword) {
        this.toast.error('Contraseñas no coinciden', 'La nueva contraseña y la confirmación deben ser iguales.');
        return;
      }
    }

    const ok = await this.confirm.open({
      title: '¿Guardar cambios de perfil?',
      message: 'Se actualizará tu información de usuario.',
      confirmText: 'Guardar',
      cancelText: 'Seguir editando',
      type: 'success'
    });

    if (ok) {
      this.toast.success('Perfil actualizado', 'Tu información fue guardada correctamente.');
      setTimeout(() => this.router.navigate(['/home']), 1000);
    }
  }
}
