import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '@features/auth/services/auth.service';
import { environment } from '@env';
import { LobbyResponse } from '../models/lobby-response';

export interface LobbyRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface Member {
  id:        string;
  nickname:  string;
  avatarUrl?: string;
  role:      'owner' | 'member';
  joinedAt:  Date;
}

@Injectable({ providedIn: 'root' })
export class LobbyService {

  private readonly api = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private normalizeImageUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${environment.apiUrl}${path}`;
  }

  private normalizeLobby(lobby: LobbyResponse): LobbyResponse {
    return {
      ...lobby,
      image: this.normalizeImageUrl(lobby.image)
    };
  }

  getAll(): Observable<LobbyResponse[]> {
    return this.http.get<{ lobbys: LobbyResponse[] } | LobbyResponse[]>(`${this.api}/lobbys`).pipe(
      map(res => {
        const lobbys = Array.isArray(res) ? res : (res?.lobbys ?? []);
        return lobbys.map(l => this.normalizeLobby(l));
      })
    );
  }

  getById(id: number): Observable<LobbyResponse> {
    return this.http.get<LobbyResponse>(`${this.api}/lobbys/${id}`).pipe(
      map(lobby => this.normalizeLobby(lobby))
    );
  }

  getMyLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<{ lobbys: LobbyResponse[] } | LobbyResponse[]>(`${this.api}/lobbys/my`).pipe(
      map(res => {
        const lobbys = Array.isArray(res) ? res : (res?.lobbys ?? []);
        return lobbys.map(l => this.normalizeLobby(l));
      })
    );
  }

  getJoinedLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<{ lobbys: LobbyResponse[] } | LobbyResponse[]>(`${this.api}/lobbys/joined`).pipe(
      map(res => {
        const lobbys = Array.isArray(res) ? res : (res?.lobbys ?? []);
        return lobbys.map(l => this.normalizeLobby(l));
      })
    );
  }

  create(req: LobbyRequest): Observable<LobbyResponse> {
    const formData = new FormData();
    formData.append('name', req.name);
    if (req.description) formData.append('description', req.description);
    if (req.image) formData.append('image', req.image);

    return this.http.post<LobbyResponse>(`${this.api}/lobbys`, formData).pipe(
      map(lobby => this.normalizeLobby(lobby))
    );
  }

  update(id: number, req: LobbyRequest): Observable<LobbyResponse> {
    const formData = new FormData();
    formData.append('name', req.name);
    if (req.description) formData.append('description', req.description);
    if (req.image) formData.append('image', req.image);

    return this.http.put<LobbyResponse>(`${this.api}/lobbys/${id}`, formData).pipe(
      map(lobby => this.normalizeLobby(lobby))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/lobbys/${id}`);
  }

  join(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/lobbys/${id}/join`, {});
  }

  leave(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/lobbys/${id}/leave`, {});
  }

  reviewRequest(requestId: number, accept: boolean): Observable<void> {
    return this.http.patch<void>(`${this.api}/lobbys/requests/${requestId}`, {}, {
      params: { accept: String(accept) }
    });
  }

  getByTag(tag: string): Observable<LobbyResponse[]> {
    return this.http.get<LobbyResponse[]>(`${this.api}/lobbys/by-tag`, {
      params: { tag }
    });
  }

  withOwnerFlag(lobbies: LobbyResponse[]): LobbyResponse[] {
    if (!Array.isArray(lobbies)) return [];
    const currentUser = this.auth.currentUser();
    const currentName = currentUser?.name ?? '';
    return lobbies.map(l => ({ 
      ...l, 
      isOwner: l.ownerUsername === currentName || l.owner_id === currentUser?.id 
    }));
  }
}
