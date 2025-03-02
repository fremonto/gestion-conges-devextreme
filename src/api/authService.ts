import httpClient from './httpClient';
import jwt_decode from 'jwt-decode';

// Données de test pour le mode développement
const mockUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    role: 'ADMIN',
    department: 'Informatique',
  },
  {
    id: 2,
    name: 'Manager',
    email: 'manager@example.com',
    role: 'MANAGER',
    department: 'Ressources Humaines',
  }
];

export const authService = {
  login: async (email: string, password: string) => {
    // En mode développement, utiliser des données mock
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = mockUsers.find(u => u.email === email);
          if (user && password === 'password') {
            const token = 'mock-jwt-token';
            localStorage.setItem('token', token);
            resolve({ data: { token, user } });
          } else {
            throw new Error('Identifiants invalides');
          }
        }, 500);
      });
    }
    
    const response = await httpClient.post('/auth/login', { email, password });
    
    // Stocker le token dans le localStorage
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    return response;
  },
  
  logout: async () => {
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('token');
          resolve(true);
        }, 300);
      });
    }
    
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
    
    // En mode développement, simuler la vérification
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { user: mockUsers[0] } });
        }, 300);
      });
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
    // En mode développement, simuler l'enregistrement
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: mockUsers.length + 1,
            ...userData,
            role: 'USER',
          };
          mockUsers.push(newUser);
          resolve({ data: { success: true, user: newUser } });
        }, 1000);
      });
    }
    
    return await httpClient.post('/auth/register', userData);
  },
  
  requestPasswordReset: async (email: string) => {
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 500);
      });
    }
    
    return await httpClient.post('/auth/request-reset', { email });
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 500);
      });
    }
    
    return await httpClient.post('/auth/reset-password', { token, newPassword });
  },
  
  updateProfile: async (userId: number, profileData: any) => {
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData };
            resolve({ data: mockUsers[userIndex] });
          }
        }, 500);
      });
    }
    
    return await httpClient.put(`/users/${userId}`, profileData);
  },
};
