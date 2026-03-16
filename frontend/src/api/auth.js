import api from './httpClient';

/**
 * Authentication API
 * Provides methods for user authentication and management.
 * Each method corresponds to an API endpoint for handling authentication-related actions.
 */
export const authApi = {
  
  // Logs in a user with the provided credentials.
  login: (credentials) => api.post('/api/login', credentials),

  // Registers a new user with the provided data.
  register: (data) => api.post('/api/register', data),

  // Logs out the current user.
  logout: () => api.post('/api/logout'),

  // Retrieves the currently authenticated user's information.
  me: () => api.get('/api/me'),

  // Refreshes the authentication token.
  refresh: () => api.post('/api/refresh'),

  // Initiates the forgot password process for a user.
  forgotPassword: (data) => api.post('/api/forgot-password', data),

  // Resets the user's password with the provided data.
  resetPassword: (data) => api.post('/api/reset-password', data),
};
