/** Payload para POST /api/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Payload para POST /api/auth/register */
export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** Respuesta de ambos endpoints de autenticación */
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  avatarUrl?: string;
}
