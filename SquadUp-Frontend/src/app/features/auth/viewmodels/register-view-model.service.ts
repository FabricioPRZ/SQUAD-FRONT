import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register-request';

@Injectable({ providedIn: 'root' })
export class RegisterViewModelService {
  private _fullName        = signal('');
  private _username        = signal('');
  private _email           = signal('');
  private _password        = signal('');
  private _confirmPassword = signal('');
  private _loading         = signal(false);
  private _error           = signal<string | null>(null);
  readonly fullName        = this._fullName.asReadonly();
  readonly username        = this._username.asReadonly();
  readonly email           = this._email.asReadonly();
  readonly password        = this._password.asReadonly();
  readonly confirmPassword = this._confirmPassword.asReadonly();
  readonly loading         = this._loading.asReadonly();
  readonly error           = this._error.asReadonly();

  readonly passwordsMatch = computed(() =>
    this._password() === this._confirmPassword()
  );

  readonly isFormValid = computed(() =>
    this._fullName().trim().length > 0 &&
    this._username().trim().length > 0 &&
    this._email().trim().length > 0 &&
    this._password().length >= 6 &&
    this.passwordsMatch()
  );

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setFullName(value: string):        void { this._fullName.set(value);        this._error.set(null); }
  setUsername(value: string):        void { this._username.set(value);        this._error.set(null); }
  setEmail(value: string):           void { this._email.set(value);           this._error.set(null); }
  setPassword(value: string):        void { this._password.set(value);        this._error.set(null); }
  setConfirmPassword(value: string): void { this._confirmPassword.set(value); this._error.set(null); }

  register(): void {
    if (!this.isFormValid() || this._loading()) return;

    const payload: RegisterRequest = {
      fullName:        this._fullName().trim(),
      username:        this._username().trim(),
      email:           this._email().trim(),
      password:        this._password(),
      confirmPassword: this._confirmPassword()
    };

    this._loading.set(true);

    this.authService.register(payload).subscribe({
      next: () => {
        this._loading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'Error al registrarse');
      }
    });
  }
}