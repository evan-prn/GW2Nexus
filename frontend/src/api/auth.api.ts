// src/api/auth.api.ts

import httpClient from './httpClient';
import { ENDPOINTS } from './endpoint';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  nom:                   string;
  email:                 string;
  password:              string;
  password_confirmation: string;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface ResetPasswordPayload {
  token:                 string;
  email:                 string;
  password:              string;
  password_confirmation: string;
}

// ─── Service auth — endpoints /api/v1/auth/* ─────────────────────────────────
//
// Toutes les méthodes retournent la Promise Axios brute.
// La persistance du token (localStorage) est gérée dans authStore via setAuth,
// pas ici — séparation des responsabilités.
//
// Routes publiques (register, login, forgotPassword, resetPassword) :
//   Aucun token requis — l'intercepteur httpClient n'injecte rien si
//   localStorage est vide.
//
// Routes protégées (logout, logoutAll, me) :
//   Le token Bearer est injecté automatiquement par l'intercepteur request.

const authApi = {

  /**
   * POST /api/v1/auth/register
   * Crée un nouveau compte et retourne { user, token }.
   * Le token doit être persisté par l'appelant via authStore.setAuth().
   */
  register: (data: RegisterPayload) =>
    httpClient.post(ENDPOINTS.auth.register, data),

  /**
   * POST /api/v1/auth/login
   * Authentifie l'utilisateur et retourne { user, token }.
   * Le token doit être persisté par l'appelant via authStore.setAuth().
   */
  login: (data: LoginPayload) =>
    httpClient.post(ENDPOINTS.auth.login, data),

  /**
   * POST /api/v1/auth/logout
   * Révoque le token Bearer courant en base (déconnexion de l'appareil actuel).
   * Le token doit être supprimé du localStorage par authStore.logout().
   */
  logout: () =>
    httpClient.post(ENDPOINTS.auth.logout),

  /**
   * POST /api/v1/auth/logout-all
   * Révoque tous les tokens Bearer actifs de l'utilisateur.
   * Utile pour "déconnecter tous mes appareils".
   */
  logoutAll: () =>
    httpClient.post(ENDPOINTS.auth.logoutAll),

  /**
   * GET /api/v1/auth/me
   * Retourne les données de l'utilisateur authentifié.
   * Appelé au démarrage de l'app si un token est présent dans le localStorage.
   * Retourne 401 si le token est absent, expiré ou révoqué.
   */
  me: () =>
    httpClient.get(ENDPOINTS.auth.me),

  /**
   * POST /api/v1/auth/forgot-password
   * Envoie un lien de réinitialisation à l'adresse email fournie.
   * Le backend retourne toujours 200 (protection anti-énumération d'emails).
   */
  forgotPassword: (email: string) =>
    httpClient.post(ENDPOINTS.auth.forgotPassword, { email }),

  /**
   * POST /api/v1/auth/reset-password
   * Réinitialise le mot de passe via le token reçu par email.
   * Révoque tous les tokens Bearer actifs côté backend après le reset.
   */
  resetPassword: (data: ResetPasswordPayload) =>
    httpClient.post(ENDPOINTS.auth.resetPassword, data),

};

export default authApi;