import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserData;
  access_token: string;
}

interface UserData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  type: UserType;
}

interface UserType {
  id: number;
  name: string;
}

/**
 * Realiza el login de un usuario.
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};
