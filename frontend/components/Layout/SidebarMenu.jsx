import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';

export default function SidebarMenu({ 
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

  return (
    <>
      {/* Overlay para móviles */}
      {visible && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black-alpha-50 z-4 lg:hidden"
          onClick={() => onToggle()}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative top-0 left-0 h-full z-5 transition-all transition-duration-300 ${
          visible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ 
          width: '280px',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
      {/* Header del Sidebar */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#22c55e',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '50%', 
            border: '3px solid white', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0fdf4',
            marginRight: '15px'
          }}>
            <i className="pi pi-bolt" style={{ fontSize: '24px', color: '#22c55e' }}></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>RetoYa</h3>
            <small style={{ opacity: 0.8 }}>Dashboard</small>
          </div>
        </div>
        
        {/* Información del Equipo */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Avatar 
              image={teamData.avatar}
              icon="pi pi-users"
              size="normal"
              shape="circle"
              style={{ marginRight: '10px' }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>{teamData.name}</p>
              <small style={{ opacity: 0.8 }}>{teamData.members} miembros</small>
            </div>
          </div>
        </div>

        {/* Información del Usuario */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              image={user?.avatar_url}
              icon="pi pi-user"
              size="normal"
              shape="circle"
              style={{ marginRight: '10px' }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>{user?.name || 'Usuario'}</p>
              <small style={{ opacity: 0.8 }}>Capitán</small>
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {menuItems.map((item, index) => (
          <div key={item.id}>
            {index === 5 && <Divider style={{ margin: '10px 20px' }} />}
            
            <div 
              onClick={() => handleMenuItemClick(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 20px',
                cursor: 'pointer',
                backgroundColor: activeMenuItem === item.id ? '#f0fdf4' : 'transparent',
                borderLeft: activeMenuItem === item.id ? '4px solid #22c55e' : '4px solid transparent',
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
                    marginRight: '12px', 
                    color: activeMenuItem === item.id ? '#22c55e' : '#6b7280',
                    fontSize: '16px'
                  }}
                ></i>
                <span style={{ 
                  color: activeMenuItem === item.id ? '#22c55e' : '#374151', 
                  fontWeight: activeMenuItem === item.id ? '600' : '500',
                  fontSize: '14px'
                }}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <Badge 
                  value={item.badge} 
                  severity="info" 
                  size="small"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer del Sidebar */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f8fafc'
      }}>
        <Button
          label="Cerrar Sesión"
          icon="pi pi-sign-out"
          text
          style={{ 
            width: '100%',
            color: '#ef4444',
            justifyContent: 'flex-start'
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
