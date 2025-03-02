export type CongeStatus = 'En attente' | 'Approuvé' | 'Refusé';
export type CongeType = 'Congés payés' | 'RTT' | 'Maladie' | 'Sans solde' | 'Autre';

export interface DemandeConges {
  id: number;
  userId: number;
  userName: string;
  userDepartment: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  duree: number;
  typeConge: CongeType;
  motif: string;
  status: CongeStatus;
  dateCreation: Date | string;
  dateModification: Date | string;
  commentaire?: string;
  validateurId?: number;
  validateurNom?: string;
  documentJustificatif?: string;
}
