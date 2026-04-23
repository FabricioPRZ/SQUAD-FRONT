import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

const API = `${environment.apiUrl}/api/notifications`;

export interface NotificationResponse {
  id: number;
  user_id: number;
  type: string;
  payload?: Record<string, unknown> | null;
  is_read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<{ notifications: NotificationResponse[] }> {
    return this.http.get<{ notifications: NotificationResponse[] }>(API, { withCredentials: true });
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${API}/unread`, { withCredentials: true });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${API}/${id}/read`, {}, { withCredentials: true });
  }

  markAllRead(): Observable<void> {
    return this.http.patch<void>(`${API}/read-all`, {}, { withCredentials: true });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`, { withCredentials: true });
  }
}
