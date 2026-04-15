import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LobbyRequest } from '../models/lobby-request';
import { LobbyResponse } from '../models/lobby-response';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LobbyService {

  private readonly api = `${environment.apiUrl}/api/lobbies`;

  constructor(private http: HttpClient) {}

  create(payload: LobbyRequest): Observable<LobbyResponse> {
    return this.http.post<LobbyResponse>(this.api, payload);
  }

  getMyLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<LobbyResponse[]>(`${this.api}/my`);
  }

  getJoinedLobbies(): Observable<LobbyResponse[]> {
    return this.http.get<LobbyResponse[]>(`${this.api}/joined`);
  }

  getByTag(tag: string): Observable<LobbyResponse[]> {
    const params = new HttpParams().set('tag', tag);
    return this.http.get<LobbyResponse[]>(`${this.api}/by-tag`, { params });
  }

  update(id: number, payload: LobbyRequest): Observable<LobbyResponse> {
    return this.http.put<LobbyResponse>(`${this.api}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  join(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/${id}/join`, {});
  }

  leave(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/leave`, {});
  }

  reviewRequest(requestId: number, accept: boolean): Observable<void> {
    const params = new HttpParams().set('accept', accept);
    return this.http.patch<void>(`${this.api}/requests/${requestId}`, {}, { params });
  }

  /**
   * Marca con isOwner=true los lobbies cuyo ownerUsername
   * coincide con el usuario guardado en localStorage.
   */
  withOwnerFlag(lobbies: LobbyResponse[]): LobbyResponse[] {
    const raw = localStorage.getItem('user');
    const username = raw ? JSON.parse(raw).username : null;
    if (!username) return lobbies;
    return lobbies.map(l => ({ ...l, isOwner: l.ownerUsername === username }));
  }
}