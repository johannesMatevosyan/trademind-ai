export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface LoginResponse {
  token: {
    accessToken: string;
    tokenType: 'Bearer';
  };
  user: AuthUser;
}
