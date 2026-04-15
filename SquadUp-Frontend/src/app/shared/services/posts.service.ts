import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../components/card/card.component';

const API = 'http://localhost:8080/api/posts';

/** Extiende Post con indicador de propiedad — usado en la vista Guardados */
export interface SavedPost extends Post {
  isOwn: boolean;
}

@Injectable({ providedIn: 'root' })
export class PostsService {

  constructor(private http: HttpClient) {}

  /**
   * GET /api/posts/saved
   * Publicaciones guardadas por el usuario actual.
   */
  getSaved(): Observable<Post[]> {
    return this.http.get<Post[]>(`${API}/saved`);
  }

  /**
   * GET /api/posts/mine
   * Publicaciones propias del usuario actual.
   */
  getMine(): Observable<Post[]> {
    return this.http.get<Post[]>(`${API}/mine`);
  }

  /**
   * POST /api/posts/{id}/save
   * Guardar o quitar de guardados (toggle).
   * Devuelve { saved: boolean }.
   */
  toggleSave(postId: number): Observable<{ saved: boolean }> {
    return this.http.post<{ saved: boolean }>(`${API}/${postId}/save`, {});
  }

  /**
   * DELETE /api/posts/{id}
   * Eliminar publicación propia (soft-delete en backend).
   */
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${API}/${postId}`);
  }
}
