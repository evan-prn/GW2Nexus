// Centralisation des endpoints API GW2Nexus
const API_VERSION = '/api/v1';  // Version de l'API, facilement modifiable

/**
 * ENDPOINTS — objet centralisant tous les endpoints de l'API
 * Permet de les référencer de manière cohérente dans toute l'application
 * et de faciliter les modifications futures (ex: changement de version)
 */
export const ENDPOINTS = {
  check: {
    health:    `${API_VERSION}/health`,           // Point de santé pour le healthcheck Docker  
  },
  auth: {
    register:  `${API_VERSION}/auth/register`,    // Inscription
    login:     `${API_VERSION}/auth/login`,       // Connexion
    logout:    `${API_VERSION}/auth/logout`,      // Déconnexion
    me:        `${API_VERSION}/auth/me`,          // Récupérer les infos de l'utilisateur connecté
  },
  profile: {
    update:    `${API_VERSION}/profile`,          // Mise à jour du profil utilisateur
    apiKey:    `${API_VERSION}/profile/api-key`,  // Gestion de la clé API GW2
    gw2Data:   `${API_VERSION}/profile/gw2-data`, // Récupérer les données GW2 liées à l'utilisateur
  },
  contact: {
    submit:    `${API_VERSION}/contact`,          // Soumettre un message de contact
  }
};

export default ENDPOINTS;