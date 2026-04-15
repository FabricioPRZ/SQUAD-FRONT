import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../models/login-request';

@Injectable({ providedIn: 'root' })
export class LoginViewModelService {

  private _email    = signal('');
  private _password = signal('');
  private _loading  = signal(false);
  private _error    = signal<string | null>(null);

  readonly email    = this._email.asReadonly();
  readonly password = this._password.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();

  readonly isFormValid = computed(() =>
    this._email().trim().length > 0 &&
    this._password().trim().length > 0
  );

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setEmail(value: string):    void { this._email.set(value);    this._error.set(null); }
  setPassword(value: string): void { this._password.set(value); this._error.set(null); }

  login(): void {
    if (!this.isFormValid() || this._loading()) return;

    const payload: LoginRequest = {
      email:    this._email().trim(),
      password: this._password()
    };

    this._loading.set(true);

    this.authService.login(payload).subscribe({
      next: () => {
        this._loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set(err?.error?.message ?? 'Credenciales inválidas');
      }
    });
  }
}