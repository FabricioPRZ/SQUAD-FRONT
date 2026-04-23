import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { LoginResponse, UserResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { environment } from '../../../../../environments/environment.dev';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly api = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.api}/auth/login`,
      payload,
      { withCredentials: true }
    ).pipe(
      tap(res => this.saveSession(res.user))
    );
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('lastname', payload.lastname);
    formData.append('email', payload.email);
    formData.append('password', payload.password);

    if (payload.secondname)      formData.append('secondname', payload.secondname);
    if (payload.secondlastname)  formData.append('secondlastname', payload.secondlastname);
    if (payload.profile_picture) formData.append('profile_picture', payload.profile_picture);

    return this.http.post<LoginResponse>(
      `${this.api}/auth/register`,
      formData,
      { withCredentials: true }
    ).pipe(
      tap(res => this.saveSession(res.user))
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.api}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.clearSession())
    );
  }

  getUser(): UserResponse | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  private saveSession(user: UserResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearSession(): void {
    localStorage.removeItem('user');
  }
}