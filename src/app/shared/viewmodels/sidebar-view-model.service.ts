import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService } from '@features/lobbys/services/lobby.service';
import { LobbyResponse } from '@features/lobbys/models/lobby-response';
import { Group } from '../components/sidebar/sidebar.component';

@Injectable({ providedIn: 'root' })
export class SidebarViewModelService {
  private _loading   = signal<boolean>(true);
  private _myLobbies = signal<LobbyResponse[]>([]);

  readonly loading = this._loading.asReadonly();

  readonly groups = computed<Group[]>(() => {
    const lobbies = this._myLobbies() ?? [];
    return lobbies.map(lobby => ({
      id:       String(lobby.id),
      name:     lobby.name,
      imageUrl: lobby.image ?? 'https://via.placeholder.com/150'
    }));
  });

  constructor(
    private lobbyService: LobbyService,
    private router: Router
  ) {}

  loadGroups(): void {
    this._loading.set(true);
    this.lobbyService.getMyLobbies().subscribe({
      next: (lobbies) => {
        this._myLobbies.set(lobbies ?? []);
        this._loading.set(false);
      },
      error: () => {
        this._myLobbies.set([]);
        this._loading.set(false);
      }
    });
  }

  navigateToCreateGroup(): void {
    this.router.navigate(['/dashboard/groups/create']);
  }
}