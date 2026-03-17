import httpClient from './httpClient';
import { ENDPOINTS } from './endpoint';

/**
 * Service d'authentification — appels API Sanctum
 */

export const authApi = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {{ nom: string, email: string, password: string, password_confirmation: string }} data
   */
  register: (data) =>
    httpClient.post(ENDPOINTS.auth.register, data),

  /**
   * Connexion utilisateur
   * @param {{ email: string, password: string, remember?: boolean }} data
   */
  login: (data) =>
    httpClient.post(ENDPOINTS.auth.login, data),

  /**
   * Déconnexion — invalide la session Sanctum
   */
  logout: () =>
    httpClient.post(ENDPOINTS.auth.logout),

  /**
   * Récupérer l'utilisateur connecté
   */
  me: () =>
    httpClient.get(ENDPOINTS.auth.me),
};

export default authApi;