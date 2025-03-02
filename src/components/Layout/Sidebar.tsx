import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import List from 'devextreme-react/list';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import './Sidebar.scss';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER' || isAdmin;
  
  const navigationItems = [
    {
      id: 'demandes',
      text: 'Demandes de congés',
      icon: 'event',
      path: '/demandes',
    },
    {
      id: 'mes-demandes',
      text: 'Mes demandes',
      icon: 'card',
      path: '/mes-demandes',
    },
    ...(isManager ? [
      {
        id: 'validation',
        text: 'Validation des demandes',
        icon: 'check',
        path: '/validation',
      },
    ] : []),
    {
      id: 'calendrier',
      text: 'Calendrier',
      icon: 'event',
      path: '/calendrier',
    },
    ...(isAdmin ? [
      {
        id: 'admin',
        text: 'Administration',
        icon: 'toolbox',
        path: '/admin',
      },
    ] : []),
  ];

  const isPathActive = useCallback(
    (path: string) => location.pathname === path,
    [location]
  );

  const handleItemClick = (e: any) => {
    const item = e.itemData;
    navigate(item.path);
  };

  const renderItem = (item: any) => {
    const isActive = isPathActive(item.path);
    
    return (
      <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
        <div className="sidebar-item-icon">
          <i className={`dx-icon dx-icon-${item.icon}`}></i>
        </div>
        <span className="sidebar-item-text">{item.text}</span>
      </div>
    );
  };

  return (
    <div className="app-sidebar">
      <div className="sidebar-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
      <List
        items={navigationItems}
        keyExpr="id"
        itemRender={renderItem}
        onItemClick={handleItemClick}
        focusStateEnabled={false}
        activeStateEnabled={false}
      />
    </div>
  );
};

export default Sidebar;
