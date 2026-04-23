import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

const API = `${environment.apiUrl}/api`;

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
  name: string;
  secondname?: string | null;
  lastname: string;
  secondlastname?: string | null;
  email: string;
  profile_picture?: string | null;
  createdAt?: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface UserProfileUpdateRequest {
  name?: string;
  lastname?: string;
  profile_picture?: string;
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

  getMyProfile(): Observable<{ user: ProfileResponse } | ProfileResponse> {
    return this.http.get<{ user: ProfileResponse } | ProfileResponse>(`${API}/auth/profile`, { withCredentials: true });
  }

  getUserProfile(username: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${API}/users/${username}`, { withCredentials: true });
  }

  updateMyProfile(req: UserProfileUpdateRequest): Observable<{ user: ProfileResponse } | ProfileResponse> {
    return this.http.put<{ user: ProfileResponse } | ProfileResponse>(`${API}/auth/profile`, req, { withCredentials: true });
  }

  addGameToMyProfile(req: UserGameRequest): Observable<UserGameDTO> {
    return this.http.post<UserGameDTO>(`${API}/auth/profile/games`, req, { withCredentials: true });
  }

  removeGameFromMyProfile(userGameId: number): Observable<void> {
    return this.http.delete<void>(`${API}/auth/profile/games/${userGameId}`, { withCredentials: true });
  }
}
