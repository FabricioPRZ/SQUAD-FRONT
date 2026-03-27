/** Representa al usuario actualmente autenticado en la sesión */
export interface User {
  userId: number;
  username: string;
  email: string;
  avatarUrl?: string;
}
