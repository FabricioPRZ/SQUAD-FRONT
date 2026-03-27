import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const API = 'http://localhost:8080/api/notifications';

/** Alineado con NotificationResponse del backend */
export interface NotificationResponse {
  id: number;
  type: string;
  actorUsername: string;
  actorAvatar?: string;
  payload?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: HttpClient) {}

  /** GET /api/notifications — Últimas 30 notificaciones */
  getAll(): Observable<NotificationResponse[]> {
    return this.http.get<NotificationResponse[]>(API);
  }

  /** GET /api/notifications/unread-count */
  getUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${API}/unread-count`)
      .pipe(map(res => res.count));
  }

  /** PATCH /api/notifications/read-all */
  markAllRead(): Observable<void> {
    return this.http.patch<void>(`${API}/read-all`, {});
  }
}
