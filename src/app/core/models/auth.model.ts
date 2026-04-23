export interface UserResponse {
  id: number;
  name: string;
  secondname: string | null;
  lastname: string;
  secondlastname: string | null;
  email: string;
  profile_picture: string | null;
  createdAt: string;
}

export interface LoginResponse {
  message: string;
  user: UserResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  secondname?: string;
  secondlastname?: string;
  profile_picture?: File;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
}