import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { useAuthStore } from '../app/store/auth.js';
import SidebarMenuAdaptativo from './Layout/SidebarMenuAdaptativo.jsx';

export default function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [screenInfo, setScreenInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth <= 767,
    isTablet: window.innerWidth >= 768 && window.innerWidth <= 1023,
    isLaptop: window.innerWidth >= 1024 && window.innerWidth <= 1439,
    isDesktop: window.innerWidth >= 1440,
    orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  });

  const toast = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuthStore();

  // Detectar cambios de pantalla
  useEffect(() => {
    const handleResize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 767,
        isTablet: window.innerWidth >= 768 && window.innerWidth <= 1023,
        isLaptop: window.innerWidth >= 1024 && window.innerWidth <= 1439,
        isDesktop: window.innerWidth >= 1440,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mostrar sidebar automáticamente en pantallas grandes
  useEffect(() => {
    if (screenInfo.isDesktop || screenInfo.isLaptop) {
      setSidebarVisible(true);
    } else {
      setSidebarVisible(false);
    }
  }, [screenInfo]);

  // Menú de usuario
  const userMenuItems = [
    { label: 'Perfil', icon: 'pi pi-user' },
    { label: 'Configuración', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => handleLogout() }
  ];

  const handleLogout = () => {
    confirmDialog({
      message: '¿Estás seguro de que quieres cerrar sesión?',
      header: 'Confirmar Cierre de Sesión',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        logout();
        window.location.href = '/';
      },
      reject: () => {
        toast.current.show({ severity: 'info', summary: 'Cancelado', detail: 'Cierre de sesión cancelado', life: 3000 });
      }
    });
  };

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    
    // Redirigir a páginas específicas
    switch (itemId) {
      case 'dashboard':
        window.location.href = '/dashboard';
        break;
      case 'courts':
        window.location.href = '/courts/view';
        break;
      case 'matches':
        window.location.href = '/matches';
        break;
      case 'teams':
        window.location.href = '/teams';
        break;
      case 'challenges':
        window.location.href = '/dashboard';
        break;
      case 'tournaments':
        window.location.href = '/dashboard';
        break;
      case 'schedule-tournament':
        window.location.href = '/dashboard';
        break;
      case 'create-tournament':
        window.location.href = '/dashboard';
        break;
      case 'rematches':
        window.location.href = '/dashboard';
        break;
      case 'request-players':
        window.location.href = '/dashboard';
        break;
      case 'create-team':
        window.location.href = '/dashboard';
        break;
      default:
        break;
    }
    
    // Cerrar sidebar en móviles después de hacer click
    if (screenInfo.isMobile) {
      setSidebarVisible(false);
    }
  };

  // Datos mock para el sidebar
  const teamData = {
    name: 'Los Campeones',
    members: 8,
    avatar: null
  };

  const notifications = {
    matches: 3,
    courts: 12,
    challenges: 2,
    tournaments: 1
  };

  // Si no hay usuario autenticado, mostrar solo el contenido sin sidebar
  if (!user) {
    return (
      <div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Sidebar Adaptativo */}
      <SidebarMenuAdaptativo
        visible={sidebarVisible}
        onToggle={() => setSidebarVisible(!sidebarVisible)}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        user={user}
        teamData={teamData}
        notifications={notifications}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-column">
        {/* Header Principal */}
        <div 
          className="flex justify-content-between align-items-center p-3 shadow-2" 
          style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}
        >
          <div className="flex align-items-center">
            {(!sidebarVisible || screenInfo.isMobile || screenInfo.isTablet) && (
              <Button
                icon="pi pi-bars"
                className="p-button-text p-button-secondary mr-2"
                onClick={() => setSidebarVisible(true)}
              />
            )}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #22c55e',
              marginRight: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0fdf4'
            }}>
              <i className="pi pi-bolt" style={{ fontSize: '20px', color: '#22c55e' }}></i>
            </div>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>RetoYa</span>
          </div>
          
          <div className="flex align-items-center gap-2">
            <Button 
              icon="pi pi-bell" 
              className="p-button-text p-button-secondary p-overlay-badge" 
              onClick={() => toast.current.show({ severity: 'info', summary: 'Notificaciones', detail: 'No tienes nuevas notificaciones', life: 3000 })}
            >
              <Badge value="5" severity="danger"></Badge>
            </Button>
            <span className="font-semibold text-lg hidden md:inline">Mi Equipo</span>
            <Avatar
              image={user?.avatar_url || "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"}
              shape="circle"
              size="large"
              onClick={(event) => userMenuRef.current.toggle(event)}
              aria-controls="user_menu"
              aria-haspopup
              style={{ cursor: 'pointer' }}
              label={!user?.avatar_url ? user?.name?.charAt(0).toUpperCase() : ''}
              className="bg-blue-500 text-white"
            />
            <Menu model={userMenuItems} popup ref={userMenuRef} id="user_menu" />
          </div>
        </div>

        {/* Contenido de la página */}
        <div className="flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
}