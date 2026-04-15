import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.userData.password !== this.userData.confirmPassword) {
      this.toast.error('Contraseñas no coinciden', 'Por favor verifica tu contraseña.');
      return;
    }

    this.loading = true;
    this.auth.register(this.userData).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('¡Cuenta creada!', `Bienvenido, ${this.userData.username}.`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Error al crear la cuenta. Intenta de nuevo.';
        this.toast.error('Error de registro', msg);
      }
    });
  }
}