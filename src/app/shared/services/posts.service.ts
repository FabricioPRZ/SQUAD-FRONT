import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../components/card/card.component';
import { environment } from '../../../../environments/environment.dev';

const API = `${environment.apiUrl}/api/posts`;

@Injectable({ providedIn: 'root' })
export class PostsService {

  constructor(private http: HttpClient) {}

  // GET /api/posts — todas las publicaciones
  getAll(): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(API, { withCredentials: true });
  }

  // GET /api/posts/user/:id — publicaciones del usuario autenticado
  getMine(userId: number): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${API}/user/${userId}`, {
      withCredentials: true
    });
  }

  // GET /api/posts/:id — post individual
  getById(postId: number): Observable<{ post: Post }> {
    return this.http.get<{ post: Post }>(`${API}/${postId}`, {
      withCredentials: true
    });
  }

  // GET /api/posts/lobby/:id — posts de un lobby
  getByLobby(lobbyId: number): Observable<{ posts: Post[] }> {
    return this.http.get<{ posts: Post[] }>(`${API}/lobby/${lobbyId}`, {
      withCredentials: true
    });
  }

  // POST /api/posts — crear post
  createPost(body: { description?: string; lobby_id?: number }): Observable<{ message: string; post: Post }> {
    return this.http.post<{ message: string; post: Post }>(API, body, {
      withCredentials: true
    });
  }

  // PUT /api/posts/:id — actualizar descripción
  updatePost(postId: number, description: string): Observable<{ message: string; post: Post }> {
    return this.http.put<{ message: string; post: Post }>(
      `${API}/${postId}`,
      { description },
      { withCredentials: true }
    );
  }

  // DELETE /api/posts/:id — eliminar post
  deletePost(postId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API}/${postId}`, {
      withCredentials: true
    });
  }

  // POST /api/posts/:id/images — subir imágenes
  addImages(postId: number, files: File[]): Observable<{ message: string; images: any[] }> {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    return this.http.post<{ message: string; images: any[] }>(
      `${API}/${postId}/images`,
      formData,
      { withCredentials: true }
    );
  }

  // GET /api/posts/:id/images — obtener imágenes del post
  getImages(postId: number): Observable<{ images: any[] }> {
    return this.http.get<{ images: any[] }>(
      `${API}/${postId}/images`,
      { withCredentials: true }
    );
  }

  // DELETE /api/posts/:id/images/:imageId — eliminar imagen
  deleteImage(postId: number, imageId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${API}/${postId}/images/${imageId}`,
      { withCredentials: true }
    );
  }
}