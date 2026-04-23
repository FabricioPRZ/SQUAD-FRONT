import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, UserResponse } from '@core/models/auth.model';
import { environment } from '@env';

const USER_KEY = 'squadup_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _currentUser = signal<UserResponse | null>(this.loadUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  private normalizeImageUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}${path}`;
  }

  login(payload: LoginRequest): Observable<{ user: UserResponse }> {
    return this.http.post<{ user: UserResponse }>(
      `${environment.apiUrl}/api/auth/login`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap({
        next: (res) => {
          this.saveSession(res.user);
        },
        error: (err) => {
          console.error('Login error:', err);
        }
      })
    );
  }

  register(payload: RegisterRequest): Observable<{ user: UserResponse }> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('lastname', payload.lastname);
    formData.append('email', payload.email);
    formData.append('password', payload.password);

    if (payload.secondname)      formData.append('secondname', payload.secondname);
    if (payload.secondlastname)  formData.append('secondlastname', payload.secondlastname);
    if (payload.profile_picture) formData.append('profile_picture', payload.profile_picture);

    return this.http.post<{ user: UserResponse }>(
      `${environment.apiUrl}/api/auth/register`,
      formData,
      { withCredentials: true }
    ).pipe(
      tap({
        next: (res) => {
          this.saveSession(res.user);
        },
        error: (err) => {
          console.error('Register error:', err);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/api/auth/logout`, {}, { withCredentials: true }).subscribe();
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  private saveSession(user: UserResponse): void {
    const normalizedUser = {
      ...user,
      profile_picture: this.normalizeImageUrl(user.profile_picture)
    };
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    this._currentUser.set(normalizedUser);
  }

  private loadUser(): UserResponse | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}