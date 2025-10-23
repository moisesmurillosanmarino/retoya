import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useAuthStore } from '../app/store/auth.js';

export default function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const { user } = useAuthStore();

  // Datos mock para el dashboard
  const [dashboardData, setDashboardData] = useState({
    upcomingMatches: 3,
    availableCourts: 12,
    teamMembers: 8,
    tournaments: 2,
    challenges: 5
  });

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      command: () => setActiveMenuItem('dashboard')
    },
    {
      label: 'Partidos Programados',
      icon: 'pi pi-calendar',
      command: () => setActiveMenuItem('matches'),
      badge: dashboardData.upcomingMatches
    },
    {
      label: 'Canchas Disponibles',
      icon: 'pi pi-building',
      command: () => setActiveMenuItem('courts'),
      badge: dashboardData.availableCourts
    },
    {
      label: 'Retos',
      icon: 'pi pi-bolt',
      command: () => setActiveMenuItem('challenges'),
      badge: dashboardData.challenges
    },
    {
      label: 'Programa de Torneos',
      icon: 'pi pi-trophy',
      command: () => setActiveMenuItem('tournaments')
    },
    {
      separator: true
    },
    {
      label: 'Programar Torneo',
      icon: 'pi pi-plus-circle',
      command: () => setActiveMenuItem('schedule-tournament')
    },
    {
      label: 'Crear Torneo',
      icon: 'pi pi-plus',
      command: () => setActiveMenuItem('create-tournament')
    },
    {
      label: 'Ver Equipos',
      icon: 'pi pi-users',
      command: () => setActiveMenuItem('teams')
    },
    {
      label: 'Ofrecer Revanchas',
      icon: 'pi pi-refresh',
      command: () => setActiveMenuItem('rematches')
    },
    {
      label: 'Solicitar Jugadores',
      icon: 'pi pi-user-plus',
      command: () => setActiveMenuItem('request-players')
    },
    {
      label: 'Crear Equipo',
      icon: 'pi pi-user-plus',
      command: () => setActiveMenuItem('create-team')
    }
  ];

  const renderDashboardContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="grid">
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center">
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-calendar text-4xl text-blue-500 mb-3"></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937' }}>Partidos</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.upcomingMatches}
                  </p>
                  <small style={{ color: '#6b7280' }}>Próximos partidos</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center">
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-building text-4xl text-green-500 mb-3"></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937' }}>Canchas</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.availableCourts}
                  </p>
                  <small style={{ color: '#6b7280' }}>Disponibles</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center">
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-users text-4xl text-purple-500 mb-3"></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937' }}>Equipo</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.teamMembers}
                  </p>
                  <small style={{ color: '#6b7280' }}>Miembros</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center">
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-trophy text-4xl text-yellow-500 mb-3"></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937' }}>Torneos</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.tournaments}
                  </p>
                  <small style={{ color: '#6b7280' }}>Activos</small>
                </div>
              </Card>
            </div>

            {/* Actividad Reciente */}
            <div className="col-12 lg:col-8">
              <Card title="Actividad Reciente">
                <div style={{ padding: '20px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <i className="pi pi-calendar text-green-500 mr-3"></i>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600' }}>Partido programado</p>
                      <small style={{ color: '#6b7280' }}>Cancha Central - Mañana 3:00 PM</small>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <i className="pi pi-bolt text-blue-500 mr-3"></i>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600' }}>Nuevo reto recibido</p>
                      <small style={{ color: '#6b7280' }}>Equipo Los Tigres te desafía</small>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <i className="pi pi-trophy text-yellow-500 mr-3"></i>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600' }}>Torneo creado</p>
                      <small style={{ color: '#6b7280' }}>Copa RetoYa 2024 - Inscripciones abiertas</small>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Estadísticas del Equipo */}
            <div className="col-12 lg:col-4">
              <Card title="Estadísticas del Equipo">
                <div style={{ padding: '20px 0' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Partidos Ganados</span>
                      <span style={{ fontWeight: 'bold', color: '#22c55e' }}>12</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '75%', height: '100%', backgroundColor: '#22c55e', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Partidos Perdidos</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>4</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '25%', height: '100%', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>Empates</span>
                      <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>2</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                      <div style={{ width: '12%', height: '100%', backgroundColor: '#f59e0b', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  
                  <Divider />
                  
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h4 style={{ margin: 0, color: '#22c55e' }}>75%</h4>
                    <small style={{ color: '#6b7280' }}>Tasa de Victoria</small>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      
      case 'matches':
        return (
          <Card title="Partidos Programados">
            <div style={{ padding: '20px 0' }}>
              <p>Aquí se mostrarán todos los partidos programados del equipo.</p>
              <Button label="Programar Nuevo Partido" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} />
            </div>
          </Card>
        );
      
      case 'courts':
        return (
          <Card title="Canchas Disponibles">
            <div style={{ padding: '20px 0' }}>
              <p>Aquí se mostrarán todas las canchas disponibles para reservar.</p>
              <Button label="Ver Todas las Canchas" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} />
            </div>
          </Card>
        );
      
      case 'challenges':
        return (
          <Card title="Retos">
            <div style={{ padding: '20px 0' }}>
              <p>Aquí se mostrarán todos los retos recibidos y enviados.</p>
              <Button label="Crear Nuevo Reto" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} />
            </div>
          </Card>
        );
      
      case 'tournaments':
        return (
          <Card title="Programa de Torneos">
            <div style={{ padding: '20px 0' }}>
              <p>Aquí se mostrarán todos los torneos disponibles y en los que participa el equipo.</p>
              <Button label="Ver Todos los Torneos" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} />
            </div>
          </Card>
        );
      
      default:
        return (
          <Card title={menuItems.find(item => item.command && activeMenuItem === 'dashboard')?.label || 'Dashboard'}>
            <div style={{ padding: '20px 0' }}>
              <p>Funcionalidad en desarrollo: {activeMenuItem}</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{ 
        width: sidebarVisible ? '280px' : '0px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
      }}>
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
                image={user?.avatar_url}
                icon="pi pi-users"
                size="normal"
                shape="circle"
                style={{ marginRight: '10px' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>Los Campeones</p>
                <small style={{ opacity: 0.8 }}>Tu Equipo</small>
              </div>
            </div>
          </div>
        </div>

        {/* Menú */}
        <div style={{ padding: '10px 0' }}>
          <Menu 
            model={menuItems.map(item => ({
              ...item,
              template: item.separator ? null : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  backgroundColor: activeMenuItem === item.command?.toString().split('(')[1]?.split(')')[0]?.replace(/'/g, '') ? '#f0fdf4' : 'transparent',
                  borderLeft: activeMenuItem === item.command?.toString().split('(')[1]?.split(')')[0]?.replace(/'/g, '') ? '4px solid #22c55e' : '4px solid transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className={item.icon} style={{ marginRight: '12px', color: '#6b7280' }}></i>
                    <span style={{ color: '#374151', fontWeight: '500' }}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge value={item.badge} severity="info" />
                  )}
                </div>
              )
            }))}
            style={{ border: 'none', backgroundColor: 'transparent' }}
            className="w-full"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header Principal */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px 25px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              icon="pi pi-bars"
              text
              onClick={() => setSidebarVisible(!sidebarVisible)}
              style={{ marginRight: '15px', color: '#6b7280' }}
            />
            <h2 style={{ margin: 0, color: '#1f2937' }}>
              {menuItems.find(item => item.command && activeMenuItem === 'dashboard')?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Button
              icon="pi pi-bell"
              text
              style={{ color: '#6b7280' }}
            />
            <Avatar 
              image={user?.avatar_url}
              icon="pi pi-user"
              size="normal"
              shape="circle"
            />
          </div>
        </div>

        {/* Contenido del Dashboard */}
        <div style={{ padding: '25px', flex: 1 }}>
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
}
