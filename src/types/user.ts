export type UserRole = 'USER' | 'MANAGER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  manager?: boolean;
  soldeConges?: number;
  soldeRtt?: number;
  dateCreation: Date | string;
  actif: boolean;
}
