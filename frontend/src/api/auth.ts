import httpClient from './httpClient';
import { ENDPOINTS } from './endpoint';

// ─── Types ────────────────────────────────────────────────────────

export interface RegisterPayload {
  nom: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

// ─── Service auth ─────────────────────────────────────────────────

export const authApi = {
  /** Inscription d'un nouvel utilisateur */
  register: (data: RegisterPayload) =>
    httpClient.post(ENDPOINTS.auth.register, data),

  /** Connexion utilisateur */
  login: (data: LoginPayload) =>
    httpClient.post(ENDPOINTS.auth.login, data),

  /** Déconnexion — invalide la session Sanctum */
  logout: () =>
    httpClient.post(ENDPOINTS.auth.logout),

  /** Récupérer l'utilisateur connecté */
  me: () =>
    httpClient.get(ENDPOINTS.auth.me),
};

export default authApi;