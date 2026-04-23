import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '@core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class RegisterViewModelService {

  private _name            = signal('');
  private _lastname        = signal('');
  private _secondname      = signal('');
  private _secondlastname  = signal('');
  private _email           = signal('');
  private _password        = signal('');
  private _confirmPassword = signal('');
  private _loading         = signal(false);
  private _error           = signal<string | null>(null);

  readonly name            = this._name.asReadonly();
  readonly lastname        = this._lastname.asReadonly();
  readonly secondname      = this._secondname.asReadonly();
  readonly secondlastname  = this._secondlastname.asReadonly();
  readonly email           = this._email.asReadonly();
  readonly password        = this._password.asReadonly();
  readonly confirmPassword = this._confirmPassword.asReadonly();
  readonly loading         = this._loading.asReadonly();
  readonly error           = this._error.asReadonly();

  readonly passwordsMatch = computed(() =>
    this._password() === this._confirmPassword()
  );

  readonly isFormValid = computed(() =>
    this._name().trim().length > 0 &&
    this._lastname().trim().length > 0 &&
    this._email().trim().length > 0 &&
    this._password().length >= 6 &&
    this.passwordsMatch()
  );

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setName(value: string):            void { this._name.set(value);            this._error.set(null); }
  setLastname(value: string):        void { this._lastname.set(value);        this._error.set(null); }
  setSecondname(value: string):      void { this._secondname.set(value);      this._error.set(null); }
  setSecondlastname(value: string):  void { this._secondlastname.set(value);  this._error.set(null); }
  setEmail(value: string):           void { this._email.set(value);           this._error.set(null); }
  setPassword(value: string):        void { this._password.set(value);        this._error.set(null); }
  setConfirmPassword(value: string): void { this._confirmPassword.set(value); this._error.set(null); }

  register(): void {
    if (!this.isFormValid() || this._loading()) return;

    const payload: RegisterRequest = {
      name:     this._name().trim(),
      lastname: this._lastname().trim(),
      email:    this._email().trim(),
      password: this._password(),
      ...(this._secondname().trim()     && { secondname:     this._secondname().trim() }),
      ...(this._secondlastname().trim() && { secondlastname: this._secondlastname().trim() }),
    };

    this._loading.set(true);

    this.authService.register(payload).subscribe({
      next: (res) => {
        this._loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set(err?.error?.error ?? 'Error al registrarse');
      }
    });
  }
}