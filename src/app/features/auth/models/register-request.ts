export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  secondname?: string;
  secondlastname?: string;
  profile_picture?: File;
}