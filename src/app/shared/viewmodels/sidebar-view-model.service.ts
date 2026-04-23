import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LobbyService, LobbyResponse } from '../services/lobby.service';
import { Group } from '../components/sidebar/sidebar.component';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarViewModelService {
  private _loading = signal<boolean>(true);
  private _myLobbies = signal<LobbyResponse[]>([]);
  private _joinedLobbies = signal<LobbyResponse[]>([]);

  readonly loading = this._loading.asReadonly();
  
  // Combina ambos tipos de lobbies para la lista y los convierte al formato Group de la UI
  readonly groups = computed<Group[]>(() => {
    const all = [...this._myLobbies(), ...this._joinedLobbies()];
    // Evitar duplicados por si el API devuelve el mismo
    const uniqueIds = Array.from(new Set(all.map(l => l.id)));
    const unique = uniqueIds.map(id => all.find(l => l.id === id)!);

    return unique.map(lobby => ({
      id: String(lobby.id),
      name: lobby.name,
      imageUrl: lobby.imageUrl || 'https://via.placeholder.com/150'
    }));
  });

  constructor(
    private lobbyService: LobbyService,
    private router: Router
  ) {}

  loadGroups(): void {
    this._loading.set(true);
    // Request both owned and joined lobbies
    forkJoin({
      my: this.lobbyService.getMyLobbies(),
      joined: this.lobbyService.getJoinedLobbies()
    }).subscribe({
      next: (res) => {
        this._myLobbies.set(res.my || []);
        this._joinedLobbies.set(res.joined || []);
        this._loading.set(false);
      },
      error: () => {
        this._myLobbies.set([]);
        this._joinedLobbies.set([]);
        this._loading.set(false);
      }
    });
  }

  navigateToCreateGroup(): void {
    this.router.navigate(['/dashboard/groups/create']);
  }
}
