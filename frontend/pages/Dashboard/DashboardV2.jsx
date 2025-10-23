import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import SidebarMenu from '../../components/Layout/SidebarMenu.jsx';
import { useAuthStore } from '../../app/store/auth.js';

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
    challenges: 5,
    teamStats: {
      wins: 12,
      losses: 4,
      draws: 2,
      winRate: 75
    },
    recentActivity: [
      {
        type: 'match',
        title: 'Partido programado',
        description: 'Cancha Central - Mañana 3:00 PM',
        icon: 'pi pi-calendar',
        color: '#10b981'
      },
      {
        type: 'challenge',
        title: 'Nuevo reto recibido',
        description: 'Equipo Los Tigres te desafía',
        icon: 'pi pi-bolt',
        color: '#f59e0b'
      },
      {
        type: 'tournament',
        title: 'Torneo creado',
        description: 'Copa RetoYa 2024 - Inscripciones abiertas',
        icon: 'pi pi-trophy',
        color: '#8b5cf6'
      },
      {
        type: 'team',
        title: 'Nuevo miembro',
        description: 'Juan Pérez se unió al equipo',
        icon: 'pi pi-user-plus',
        color: '#06b6d4'
      }
    ]
  });

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const renderDashboardContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="grid">
            {/* Cards de Estadísticas */}
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center" style={{ height: '100%' }}>
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-calendar text-4xl mb-3" style={{ color: '#3b82f6' }}></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937', fontSize: '16px' }}>Partidos</h3>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.upcomingMatches}
                  </p>
                  <small style={{ color: '#6b7280' }}>Próximos partidos</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center" style={{ height: '100%' }}>
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-building text-4xl mb-3" style={{ color: '#10b981' }}></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937', fontSize: '16px' }}>Canchas</h3>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.availableCourts}
                  </p>
                  <small style={{ color: '#6b7280' }}>Disponibles</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center" style={{ height: '100%' }}>
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-users text-4xl mb-3" style={{ color: '#8b5cf6' }}></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937', fontSize: '16px' }}>Equipo</h3>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
                    {dashboardData.teamMembers}
                  </p>
                  <small style={{ color: '#6b7280' }}>Miembros</small>
                </div>
              </Card>
            </div>
            
            <div className="col-12 md:col-6 lg:col-3">
              <Card className="text-center" style={{ height: '100%' }}>
                <div style={{ padding: '20px' }}>
                  <i className="pi pi-trophy text-4xl mb-3" style={{ color: '#f59e0b' }}></i>
                  <h3 style={{ margin: '10px 0', color: '#1f2937', fontSize: '16px' }}>Torneos</h3>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>
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
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '15px', 
                      padding: '15px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: activity.color + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        <i className={activity.icon} style={{ color: activity.color, fontSize: '18px' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>{activity.title}</p>
                        <small style={{ color: '#6b7280' }}>{activity.description}</small>
                      </div>
                      <small style={{ color: '#9ca3af' }}>Hace 2h</small>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Estadísticas del Equipo */}
            <div className="col-12 lg:col-4">
              <Card title="Estadísticas del Equipo">
                <div style={{ padding: '20px 0' }}>
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Partidos Ganados</span>
                      <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{dashboardData.teamStats.wins}</span>
                    </div>
                    <ProgressBar 
                      value={dashboardData.teamStats.winRate} 
                      style={{ height: '8px' }}
                      color="#22c55e"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Partidos Perdidos</span>
                      <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{dashboardData.teamStats.losses}</span>
                    </div>
                    <ProgressBar 
                      value={(dashboardData.teamStats.losses / (dashboardData.teamStats.wins + dashboardData.teamStats.losses + dashboardData.teamStats.draws)) * 100} 
                      style={{ height: '8px' }}
                      color="#ef4444"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#374151' }}>Empates</span>
                      <span style={{ fontWeight: 'bold', color: '#f59e0b' }}>{dashboardData.teamStats.draws}</span>
                    </div>
                    <ProgressBar 
                      value={(dashboardData.teamStats.draws / (dashboardData.teamStats.wins + dashboardData.teamStats.losses + dashboardData.teamStats.draws)) * 100} 
                      style={{ height: '8px' }}
                      color="#f59e0b"
                    />
                  </div>
                  
                  <Divider />
                  
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h4 style={{ margin: 0, color: '#22c55e', fontSize: '32px' }}>{dashboardData.teamStats.winRate}%</h4>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ margin: 0, color: '#6b7280' }}>Gestiona todos los partidos de tu equipo</p>
                <Button 
                  label="Programar Nuevo Partido" 
                  icon="pi pi-plus"
                  style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} 
                />
              </div>
              
              {/* Lista de partidos mock */}
              <div style={{ display: 'grid', gap: '15px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ 
                    padding: '20px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>Partido #{i}</h4>
                        <p style={{ margin: 0, color: '#6b7280' }}>Cancha Central - {new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#22c55e' }}>3:00 PM</p>
                        <small style={{ color: '#6b7280' }}>vs Los Tigres</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      
      case 'courts':
        return (
          <Card title="Canchas Disponibles">
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ margin: 0, color: '#6b7280' }}>Reserva canchas para tus partidos</p>
                <Button 
                  label="Ver Todas las Canchas" 
                  icon="pi pi-building"
                  style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} 
                />
              </div>
              
              {/* Lista de canchas mock */}
              <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ 
                    padding: '20px', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: '#1f2937' }}>Cancha {i}</h4>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                      }}>
                        Disponible
                      </span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Cancha de fútbol de alta calidad</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: '#22c55e' }}>$50,000 / hora</span>
                      <Button label="Reservar" size="small" outlined />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      
      default:
        return (
          <Card title="Funcionalidad en Desarrollo">
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <i className="pi pi-cog text-6xl text-gray-400 mb-4"></i>
              <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>
                {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
              </h3>
              <p style={{ color: '#9ca3af' }}>Esta funcionalidad estará disponible próximamente</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <SidebarMenu
        visible={sidebarVisible}
        onToggle={() => setSidebarVisible(!sidebarVisible)}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        user={user}
        teamData={{
          name: 'Los Campeones',
          members: dashboardData.teamMembers,
          avatar: null
        }}
        notifications={{
          matches: dashboardData.upcomingMatches,
          courts: dashboardData.availableCourts,
          challenges: dashboardData.challenges,
          tournaments: dashboardData.tournaments
        }}
      />

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
              {activeMenuItem === 'dashboard' ? 'Dashboard' : 
               activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
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
