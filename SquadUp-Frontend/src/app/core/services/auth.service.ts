import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';

const API = 'http://localhost:8080/api/auth';
const TOKEN_KEY = 'squadup_token';
const USER_KEY  = 'squadup_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  /** Usuario actualmente autenticado */
  private _currentUser = signal<User | null>(this.loadUser());

  /** Observable del usuario actual (readonly) */
  readonly currentUser = this._currentUser.asReadonly();

  /** true si hay sesión activa */
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  // ──────────────────────── Auth ────────────────────────

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/login`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/register`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ──────────────────────── Token ────────────────────────

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // ──────────────────────── Private ────────────────────────

  private saveSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    const user: User = {
      userId:    res.userId,
      username:  res.username,
      email:     res.email,
      avatarUrl: res.avatarUrl
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  }
}
