import { memo } from 'react';
import { CongeStatus } from '@/types/demandeConges';

interface StatusBadgeProps {
  status: CongeStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: CongeStatus) => {
    switch (status) {
      case 'En attente':
        return 'pending';
      case 'Approuvé':
        return 'approved';
      case 'Refusé':
        return 'rejected';
      default:
        return '';
    }
  };

  return (
    <div className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </div>
  );
};

export default memo(StatusBadge);
