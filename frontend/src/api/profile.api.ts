import httpClient from './httpClient';
import type { UpdateProfilePayload, UpdateApiKeyPayload } from '../types/profile.types';

// ─── Service profil — endpoints /api/v1/profile ───────────────────

const profileApi = {
  /** GET /api/v1/profile — profil complet (user + profil_gw2) */
  get: () =>
    httpClient.get('/api/v1/profile'),

  /** PUT /api/v1/profile — mise à jour nom, pseudo_gw2, avatar */
  update: (payload: UpdateProfilePayload) =>
    httpClient.put('/api/v1/profile', payload),

  /** POST /api/v1/profile/api-key — valider + enregistrer clé API GW2 */
  updateApiKey: (payload: UpdateApiKeyPayload) =>
    httpClient.post('/api/v1/profile/api-key', payload),

  /** DELETE /api/v1/profile/api-key — supprimer la clé API GW2 */
  deleteApiKey: () =>
    httpClient.delete('/api/v1/profile/api-key'),

  /** GET /api/v1/profile/gw2-data — données GW2 fraîches */
  gw2Data: () =>
    httpClient.get('/api/v1/profile/gw2-data'),
};

export default profileApi;