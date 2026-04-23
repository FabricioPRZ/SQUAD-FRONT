import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

const API = `${environment.apiUrl}/api/games`;

export interface GameResponse {
  id: number;
  name: string;
  genre: string;
  coverUrl: string;
  description: string;
}

export interface GameRequest {
  name: string;
  genre: string;
  coverUrl?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<GameResponse[]> {
    return this.http.get<GameResponse[]>(API);
  }

  getById(id: number): Observable<GameResponse> {
    return this.http.get<GameResponse>(`${API}/${id}`);
  }

  create(req: GameRequest): Observable<GameResponse> {
    return this.http.post<GameResponse>(API, req);
  }

  update(id: number, req: GameRequest): Observable<GameResponse> {
    return this.http.put<GameResponse>(`${API}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
