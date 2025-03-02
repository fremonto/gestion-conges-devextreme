import httpClient from './httpClient';
import jwt_decode from 'jwt-decode';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await httpClient.post('/auth/login', { email, password });
    
    // Stocker le token dans le localStorage
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    return response;
  },
  
  logout: async () => {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      // Même en cas d'erreur, supprimer le token du localStorage
      localStorage.removeItem('token');
    }
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Non authentifié');
    }
    
    try {
      // Vérifier si le token est expiré
      const decodedToken: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expiré');
      }
      
      // Vérifier la validité du token auprès du serveur
      const response = await httpClient.get('/auth/me');
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  register: async (userData: any) => {
    return await httpClient.post('/auth/register', userData);
  },
  
  requestPasswordReset: async (email: string) => {
    return await httpClient.post('/auth/request-reset', { email });
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    return await httpClient.post('/auth/reset-password', { token, newPassword });
  },
  
  updateProfile: async (userId: number, profileData: any) => {
    return await httpClient.put(`/users/${userId}`, profileData);
  },
};
