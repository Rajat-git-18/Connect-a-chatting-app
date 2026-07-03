export interface RegisterRequest {
    displayName: string;
    username: string;
    email: string;
    password: string;
  }
  
  export interface AuthUser {
    id: string;
    displayName: string;
    username: string;
    email: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
  }