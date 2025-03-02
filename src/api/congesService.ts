import httpClient from './httpClient';
import { DemandeConges } from '@/types/demandeConges';

export const congesService = {
  getDemandes: async (params: { skip?: number; take?: number; filter?: any; sort?: any }) => {
    return await httpClient.get('/demandes-conges', { params });
  },
  
  getDemandeById: async (id: number) => {
    return await httpClient.get(`/demandes-conges/${id}`);
  },
  
  createDemande: async (demande: Partial<DemandeConges>) => {
    return await httpClient.post('/demandes-conges', demande);
  },
  
  updateDemande: async (id: number, demande: Partial<DemandeConges>) => {
    return await httpClient.put(`/demandes-conges/${id}`, demande);
  },
  
  deleteDemande: async (id: number) => {
    return await httpClient.delete(`/demandes-conges/${id}`);
  },
  
  approverDemande: async (id: number, commentaire?: string) => {
    return await httpClient.post(`/demandes-conges/${id}/approver`, { commentaire });
  },
  
  refuserDemande: async (id: number, commentaire: string) => {
    return await httpClient.post(`/demandes-conges/${id}/refuser`, { commentaire });
  },
  
  uploadJustificatif: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return await httpClient.post(`/demandes-conges/${id}/justificatif`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getStatistiquesUtilisateur: async (userId: number, annee: number) => {
    return await httpClient.get(`/users/${userId}/statistiques-conges`, {
      params: { annee },
    });
  },
  
  getStatistiquesDepartement: async (departmentId: number, annee: number) => {
    return await httpClient.get(`/departements/${departmentId}/statistiques-conges`, {
      params: { annee },
    });
  },
};
