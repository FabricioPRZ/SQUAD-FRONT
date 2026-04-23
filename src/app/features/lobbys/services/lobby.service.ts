import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LobbyRequest } from '../models/lobby-request';
import { LobbyResponse, LobbyMemberResponse } from '../models/lobby-response';
import { environment } from '../../../../../environments/environment.dev';

@Injectable({ providedIn: 'root' })
export class LobbyService {

  private readonly api = `${environment.apiUrl}/api/lobbys`;

  constructor(private http: HttpClient) {}

  create(payload: LobbyRequest): Observable<{ message: string; lobby: LobbyResponse }> {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.image)       formData.append('image', payload.image);

    return this.http.post<{ message: string; lobby: LobbyResponse }>(
      this.api,
      formData,
      { withCredentials: true }
    );
  }

  getAll(): Observable<{ lobbys: LobbyResponse[] }> {
    return this.http.get<{ lobbys: LobbyResponse[] }>(
      this.api,
      { withCredentials: true }
    );
  }

  getMyLobbies(): Observable<{ lobbys: LobbyResponse[] }> {
    return this.http.get<{ lobbys: LobbyResponse[] }>(
      `${this.api}/my`,
      { withCredentials: true }
    );
  }

  getById(id: number): Observable<{ lobby: LobbyResponse }> {
    return this.http.get<{ lobby: LobbyResponse }>(
      `${this.api}/${id}`,
      { withCredentials: true }
    );
  }

  update(id: number, payload: LobbyRequest): Observable<{ message: string; lobby: LobbyResponse }> {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.description) formData.append('description', payload.description);
    if (payload.image)       formData.append('image', payload.image);

    return this.http.put<{ message: string; lobby: LobbyResponse }>(
      `${this.api}/${id}`,
      formData,
      { withCredentials: true }
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.api}/${id}`,
      { withCredentials: true }
    );
  }

  join(id: number): Observable<{ message: string; member: LobbyMemberResponse }> {
    return this.http.post<{ message: string; member: LobbyMemberResponse }>(
      `${this.api}/${id}/join`,
      {},
      { withCredentials: true }
    );
  }

  leave(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.api}/${id}/leave`,
      {},
      { withCredentials: true }
    );
  }

  getMembers(id: number): Observable<{ members: LobbyMemberResponse[] }> {
    return this.http.get<{ members: LobbyMemberResponse[] }>(
      `${this.api}/${id}/members`,
      { withCredentials: true }
    );
  }

  withOwnerFlag(lobbies: LobbyResponse[]): LobbyResponse[] {
    const raw    = localStorage.getItem('user');
    const userId = raw ? JSON.parse(raw).id : null;
    if (!userId) return lobbies;
    return lobbies.map(l => ({ ...l, isOwner: l.owner_id === userId }));
  }
}