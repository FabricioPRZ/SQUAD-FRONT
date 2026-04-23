import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';

interface UserSessionItem {
  userId: number;
  username: string;
  email: string;
  avatarUrl?: string;
  fullName?: string; // Optional depending on how it's saved
}

@Injectable({ providedIn: 'root' })
export class SessionViewModelService {
  private _user = signal<UserSessionItem | null>(null);

  readonly user = this._user.asReadonly();
  
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly username = computed(() => this._user()?.username ?? '');
  readonly email = computed(() => this._user()?.email ?? '');
  readonly avatarUrl = computed(() => this._user()?.avatarUrl ?? null);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loadSession();
  }

  loadSession(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this._user.set(user);
      } catch (e) {
        this._user.set(null);
      }
    } else {
      this._user.set(null);
    }
  }

  logout(): void {
    this.authService.logout();
    this._user.set(null);
    this.router.navigate(['/']);
  }
}
