import api from "./client";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  username: string;
  email: string;
  password: string;
}

export async function login(data: LoginRequest) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function register(data: RegisterRequest) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function logout(token: string) {
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getCurrentUser(token: string) {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}