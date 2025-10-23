import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

export default function SidebarMenuAdaptativo({ 
  visible, 
  onToggle, 
  activeMenuItem, 
  onMenuItemClick,
  user,
  teamData = {
    name: 'Los Campeones',
    members: 8,
    avatar: null
  },
  notifications = {
    matches: 3,
    courts: 12,
    challenges: 5,
    tournaments: 2
  }
}) {
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    orientation: 'landscape'
  });

  // Detección completa de pantalla para el sidebar
  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setScreenInfo({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLaptop: width >= 1024 && width < 1440,
        isDesktop: width >= 1440,
        orientation
      });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);
    
    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'pi pi-home',
      color: '#22c55e'
    },
    {
      id: 'matches',
      label: 'Partidos Programados',
      icon: 'pi pi-calendar',
      color: '#3b82f6',
      badge: notifications.matches
    },
    {
      id: 'courts',
      label: 'Canchas Disponibles',
      icon: 'pi pi-building',
      color: '#10b981',
      badge: notifications.courts
    },
    {
      id: 'challenges',
      label: 'Retos',
      icon: 'pi pi-bolt',
      color: '#f59e0b',
      badge: notifications.challenges
    },
    {
      id: 'tournaments',
      label: 'Programa de Torneos',
      icon: 'pi pi-trophy',
      color: '#8b5cf6',
      badge: notifications.tournaments
    },
    {
      id: 'schedule-tournament',
      label: 'Programar Torneo',
      icon: 'pi pi-plus-circle',
      color: '#06b6d4'
    },
    {
      id: 'create-tournament',
      label: 'Crear Torneo',
      icon: 'pi pi-plus',
      color: '#06b6d4'
    },
    {
      id: 'teams',
      label: 'Ver Equipos',
      icon: 'pi pi-users',
      color: '#6366f1'
    },
    {
      id: 'rematches',
      label: 'Ofrecer Revanchas',
      icon: 'pi pi-refresh',
      color: '#f97316'
    },
    {
      id: 'request-players',
      label: 'Solicitar Jugadores',
      icon: 'pi pi-user-plus',
      color: '#ec4899'
    },
    {
      id: 'create-team',
      label: 'Crear Equipo',
      icon: 'pi pi-user-plus',
      color: '#ec4899'
    }
  ];

  const handleMenuItemClick = (itemId) => {
    onMenuItemClick(itemId);
  };

  // Función para obtener clases CSS adaptativas del sidebar
  const getSidebarClasses = () => {
    const { isMobile, isTablet, isLaptop, isDesktop } = screenInfo;
    
    return {
      // Ancho del sidebar adaptativo
      sidebarWidth: isMobile ? '280px' : isTablet ? '300px' : isLaptop ? '320px' : '340px',
      
      // Padding adaptativo
      headerPadding: isMobile ? '15px' : isTablet ? '18px' : isLaptop ? '20px' : '25px',
      menuPadding: isMobile ? '8px 0' : isTablet ? '10px 0' : isLaptop ? '10px 0' : '10px 0',
      footerPadding: isMobile ? '15px' : isTablet ? '18px' : isLaptop ? '20px' : '25px',
      
      // Font sizes adaptativos
      logoSize: isMobile ? '16px' : isTablet ? '18px' : isLaptop ? '18px' : '20px',
      subtitleSize: isMobile ? '10px' : isTablet ? '11px' : isLaptop ? '12px' : '12px',
      menuItemSize: isMobile ? '13px' : isTablet ? '14px' : isLaptop ? '14px' : '15px',
      
      // Icon sizes adaptativos
      logoIconSize: isMobile ? '18px' : isTablet ? '20px' : isLaptop ? '22px' : '24px',
      menuIconSize: isMobile ? '14px' : isTablet ? '15px' : isLaptop ? '16px' : '16px',
      
      // Avatar sizes adaptativos
      teamAvatarSize: isMobile ? 'normal' : isTablet ? 'normal' : isLaptop ? 'large' : 'large',
      userAvatarSize: isMobile ? 'normal' : isTablet ? 'normal' : isLaptop ? 'large' : 'large',
      
      // Spacing adaptativo
      menuItemPadding: isMobile ? '10px 15px' : isTablet ? '12px 18px' : isLaptop ? '12px 20px' : '15px 25px',
      menuItemMargin: isMobile ? '5px 0' : isTablet ? '6px 0' : isLaptop ? '6px 0' : '8px 0',
      
      // Badge sizes adaptativos
      badgeSize: isMobile ? 'small' : isTablet ? 'small' : isLaptop ? 'normal' : 'normal',
      
      // Button sizes adaptativos
      logoutButtonSize: isMobile ? 'small' : isTablet ? 'small' : isLaptop ? 'normal' : 'normal'
    };
  };

  const sidebarClasses = getSidebarClasses();

  return (
    <>
      {/* Overlay para móviles */}
      {visible && screenInfo.isMobile && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black-alpha-50 z-4"
          onClick={() => onToggle()}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        ></div>
      )}
      
      {/* Sidebar Adaptativo */}
      <div 
        className={`${screenInfo.isMobile ? 'fixed' : 'relative'} top-0 left-0 h-full z-5 transition-all transition-duration-300 ${
          visible ? 'translate-x-0' : screenInfo.isMobile ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ 
          width: sidebarClasses.sidebarWidth,
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          boxShadow: screenInfo.isMobile ? '2px 0 8px rgba(0,0,0,0.15)' : '2px 0 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: screenInfo.isMobile ? 1001 : 'auto'
        }}
      >
        {/* Header del Sidebar Adaptativo */}
        <div style={{ 
          padding: sidebarClasses.headerPadding, 
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#22c55e',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: screenInfo.isMobile ? '12px' : '15px' }}>
            <div style={{ 
              width: screenInfo.isMobile ? '35px' : screenInfo.isTablet ? '40px' : screenInfo.isLaptop ? '45px' : '50px', 
              height: screenInfo.isMobile ? '35px' : screenInfo.isTablet ? '40px' : screenInfo.isLaptop ? '45px' : '50px', 
              borderRadius: '50%', 
              border: '3px solid white', 
              marginRight: screenInfo.isMobile ? '12px' : '15px', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0fdf4'
            }}>
              <i className="pi pi-bolt" style={{ fontSize: sidebarClasses.logoIconSize, color: '#22c55e' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: sidebarClasses.logoSize, fontWeight: 'bold' }}>RetoYa</h3>
              <small style={{ opacity: 0.8, fontSize: sidebarClasses.subtitleSize }}>Dashboard</small>
            </div>
          </div>
          
          {/* Información del Equipo Adaptativa */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: screenInfo.isMobile ? '12px' : '15px', 
            borderRadius: '8px',
            marginBottom: screenInfo.isMobile ? '12px' : '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: screenInfo.isMobile ? '8px' : '10px' }}>
              <Avatar 
                image={teamData.avatar}
                icon="pi pi-users"
                size={sidebarClasses.teamAvatarSize}
                shape="circle"
                style={{ marginRight: screenInfo.isMobile ? '8px' : '10px' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: sidebarClasses.menuItemSize }}>{teamData.name}</p>
                <small style={{ opacity: 0.8, fontSize: sidebarClasses.subtitleSize }}>{teamData.members} miembros</small>
              </div>
            </div>
          </div>

          {/* Información del Usuario Adaptativa */}
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: screenInfo.isMobile ? '12px' : '15px', 
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                image={user?.avatar_url}
                icon="pi pi-user"
                size={sidebarClasses.userAvatarSize}
                shape="circle"
                style={{ marginRight: screenInfo.isMobile ? '8px' : '10px' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: sidebarClasses.menuItemSize }}>{user?.name || 'Usuario'}</p>
                <small style={{ opacity: 0.8, fontSize: sidebarClasses.subtitleSize }}>Capitán</small>
              </div>
            </div>
          </div>
        </div>

        {/* Menú Adaptativo */}
        <div style={{ flex: 1, padding: sidebarClasses.menuPadding, overflowY: 'auto' }}>
          {menuItems.map((item, index) => (
            <div key={item.id}>
              {index === 5 && <Divider style={{ margin: screenInfo.isMobile ? '8px 15px' : '10px 20px' }} />}
              
              <div 
                onClick={() => handleMenuItemClick(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: sidebarClasses.menuItemPadding,
                  margin: sidebarClasses.menuItemMargin,
                  cursor: 'pointer',
                  backgroundColor: activeMenuItem === item.id ? '#f0fdf4' : 'transparent',
                  borderLeft: activeMenuItem === item.id ? '4px solid #22c55e' : '4px solid transparent',
                  borderRadius: screenInfo.isMobile ? '6px' : '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeMenuItem !== item.id) {
                    e.target.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenuItem !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i 
                    className={item.icon} 
                    style={{ 
                      marginRight: screenInfo.isMobile ? '10px' : '12px', 
                      color: activeMenuItem === item.id ? '#22c55e' : '#6b7280',
                      fontSize: sidebarClasses.menuIconSize
                    }}
                  ></i>
                  <span style={{ 
                    color: activeMenuItem === item.id ? '#22c55e' : '#374151', 
                    fontWeight: activeMenuItem === item.id ? '600' : '500',
                    fontSize: sidebarClasses.menuItemSize
                  }}>
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <Badge 
                    value={item.badge} 
                    severity="info" 
                    size={sidebarClasses.badgeSize}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer del Sidebar Adaptativo */}
        <div style={{ 
          padding: sidebarClasses.footerPadding, 
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc'
        }}>
          <Button
            label={screenInfo.isMobile ? "" : "Cerrar Sesión"}
            icon="pi pi-sign-out"
            text
            size={sidebarClasses.logoutButtonSize}
            style={{ 
              width: '100%',
              color: '#ef4444',
              justifyContent: 'flex-start',
              fontSize: sidebarClasses.menuItemSize
            }}
            onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/';
            }}
          />
        </div>
      </div>
    </>
  );
}
