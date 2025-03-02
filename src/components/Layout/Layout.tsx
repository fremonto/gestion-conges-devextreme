import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Menu from 'devextreme-react/menu';
import Button from 'devextreme-react/button';
import Drawer from 'devextreme-react/drawer';
import { RootState } from '@/store';
import { logout } from '@/store/auth/authSlice';
import Sidebar from './Sidebar';
import './Layout.scss';

const Layout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const userMenuItems = [
    {
      text: 'Mon profil',
      icon: 'user',
    },
    {
      text: 'Paramètres',
      icon: 'preferences',
    },
    {
      text: 'Déconnexion',
      icon: 'runner',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="app-layout">
      <Drawer
        opened={isDrawerOpen}
        openedStateMode="shrink"
        position="left"
        revealMode="slide"
        component={Sidebar}
        closeOnOutsideClick={false}
        height="100%"
      >
        <div className="layout-content">
          <header className="app-header">
            <Toolbar>
              <Item
                widget="dxButton"
                location="before"
                options={{
                  icon: 'menu',
                  onClick: toggleDrawer,
                }}
              />
              <Item
                location="before"
                locateInMenu="never"
                cssClass="logo"
              >
                <div className="logo">Gestion des Congés</div>
              </Item>
              <Item
                location="after"
                locateInMenu="never"
              >
                <div className="user-menu">
                  <span className="user-name">{user?.name}</span>
                  <Menu
                    items={userMenuItems}
                    showFirstSubmenuMode="onClick"
                    hideSubmenuOnMouseLeave={false}
                  />
                </div>
              </Item>
            </Toolbar>
          </header>
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </Drawer>
    </div>
  );
};

export default Layout;
