import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

const API = 'http://localhost:8080/api/lobbies';

/** Alineado con LobbyResponse del backend */
export interface LobbyResponse {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  lobbyType: string;
  privacy: string;
  maxMembers: number;
  memberCount: number;
  tags: string[];
  gameName: string;
  ownerUsername: string;
  createdAt: string;
  /** Calculado en el frontend */
  isOwner?: boolean;
}

/** Alineado con LobbyRequest del backend */
export interface LobbyRequest {
  name: string;
  description?: string;
  lobbyType?: string;
  privacy?: string;
  maxMembers?: number;
  tags?: string[];
  gameId?: number;
}

/** Representa un miembro del lobby (para uso interno del UI de edición) */
export interface Member {
  id: string;
  nickname: string;
  avatarUrl?: string;
  role: 'owner' | 'member';
  joinedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class LobbyService {

  constructor(private http: HttpClient, private auth: AuthService) {}

  // ──────────────────────── Queries ────────────────────────

  /** GET /api/lobbies/my — Lobbies donde soy dueño */
  getMyLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<LobbyResponse[]>(`${API}/my`);
  }

  /** GET /api/lobbies/joined — Lobbies a los que me uní */
  getJoinedLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<LobbyResponse[]>(`${API}/joined`);
  }

  // ──────────────────────── Commands ────────────────────────

  /** POST /api/lobbies — Crear lobby */
  create(req: LobbyRequest): Observable<LobbyResponse> {
    return this.http.post<LobbyResponse>(API, req);
  }

  /** PUT /api/lobbies/{id} — Editar lobby */
  update(id: number, req: LobbyRequest): Observable<LobbyResponse> {
    return this.http.put<LobbyResponse>(`${API}/${id}`, req);
  }

  /** DELETE /api/lobbies/{id} — Eliminar lobby */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }

  /** POST /api/lobbies/{id}/join — Solicitar unirse */
  join(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${API}/${id}/join`, {});
  }

  /** POST /api/lobbies/{id}/leave — Abandonar lobby */
  leave(id: number): Observable<void> {
    return this.http.post<void>(`${API}/${id}/leave`, {});
  }

  /** PATCH /api/lobbies/requests/{requestId}?accept= — Aceptar/rechazar solicitud */
  reviewRequest(requestId: number, accept: boolean): Observable<void> {
    return this.http.patch<void>(`${API}/requests/${requestId}`, {}, {
      params: { accept: String(accept) }
    });
  }

  // ──────────────────────── Helpers ────────────────────────

  /** Enriquece la lista calculando isOwner según el usuario en sesión */
  withOwnerFlag(lobbies: LobbyResponse[]): LobbyResponse[] {
    const currentUsername = this.auth.currentUser()?.username ?? '';
    return lobbies.map(l => ({ ...l, isOwner: l.ownerUsername === currentUsername }));
  }
}
