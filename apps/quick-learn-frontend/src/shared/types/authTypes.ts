export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface LoginResponse {
  accessToken: string;
}
