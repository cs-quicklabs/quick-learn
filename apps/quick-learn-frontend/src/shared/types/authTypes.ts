export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface ForgotPasswordPayload {
  email: string;
}
export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
