import { memo } from 'react';
import { UserRole } from '@/types/user';
import './RoleRenderer.scss';

interface RoleRendererProps {
  role: UserRole;
}

const RoleRenderer = ({ role }: RoleRendererProps) => {
  const getRoleClass = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'role-admin';
      case 'MANAGER':
        return 'role-manager';
      case 'USER':
        return 'role-user';
      default:
        return '';
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Manager';
      case 'USER':
        return 'Utilisateur';
      default:
        return role;
    }
  };

  return (
    <div className={`role-badge ${getRoleClass(role)}`}>
      {getRoleText(role)}
    </div>
  );
};

export default memo(RoleRenderer);
