import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8080/api/users';

export interface UserGameDTO {
  id: number;
  gameId: number;
  gameName: string;
  gameCoverUrl: string;
  rank: string;
  rankLabel: string;
  hoursPlayed: number;
  isMain: boolean;
}

export interface ProfileResponse {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
  joinedAt: string;
  games: UserGameDTO[];
}

export interface UserProfileUpdateRequest {
  fullName?: string;
  avatarUrl?: string;
}

export interface UserGameRequest {
  gameId: number;
  rank?: string;
  rankLabel?: string;
  hoursPlayed?: number;
  isMain?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getMyProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${API}/me`);
  }

  getUserProfile(username: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${API}/${username}`);
  }

  updateMyProfile(req: UserProfileUpdateRequest): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(`${API}/me`, req);
  }

  addGameToMyProfile(req: UserGameRequest): Observable<UserGameDTO> {
    return this.http.post<UserGameDTO>(`${API}/me/games`, req);
  }

  removeGameFromMyProfile(userGameId: number): Observable<void> {
    return this.http.delete<void>(`${API}/me/games/${userGameId}`);
  }
}
