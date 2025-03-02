import httpClient from './httpClient';
import { User } from '@/types/user';

export const userService = {
  // Récupérer tous les utilisateurs
  getUsers: async (params?: any) => {
    return await httpClient.get('/users', { params });
  },
  
  // Récupérer un utilisateur par son ID
  getUserById: async (id: number) => {
    return await httpClient.get(`/users/${id}`);
  },
  
  // Créer un nouvel utilisateur
  createUser: async (userData: Partial<User>) => {
    return await httpClient.post('/users', userData);
  },
  
  // Mettre à jour un utilisateur
  updateUser: async (id: number, userData: Partial<User>) => {
    return await httpClient.put(`/users/${id}`, userData);
  },
  
  // Supprimer un utilisateur
  deleteUser: async (id: number) => {
    return await httpClient.delete(`/users/${id}`);
  },
  
  // Changer le rôle d'un utilisateur
  changeUserRole: async (id: number, role: string) => {
    return await httpClient.patch(`/users/${id}/role`, { role });
  },
  
  // Activer/désactiver un utilisateur
  toggleUserStatus: async (id: number, actif: boolean) => {
    return await httpClient.patch(`/users/${id}/status`, { actif });
  },
  
  // Réinitialiser le mot de passe d'un utilisateur
  resetUserPassword: async (id: number) => {
    return await httpClient.post(`/users/${id}/reset-password`);
  },
  
  // Mettre à jour le solde de congés d'un utilisateur
  updateUserSolde: async (id: number, soldeConges: number, soldeRtt: number) => {
    return await httpClient.patch(`/users/${id}/solde`, { soldeConges, soldeRtt });
  }
};
