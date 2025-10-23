import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Timeline } from 'primereact/timeline';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Tooltip } from 'primereact/tooltip';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import SidebarMenu from '../../components/Layout/SidebarMenu.jsx';
import { useAuthStore } from '../../app/store/auth.js';

export default function DashboardMejorado() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const { user } = useAuthStore();
  const toast = useRef(null);

  // Datos mock más realistas
  const [dashboardData, setDashboardData] = useState({
    stats: {
      upcomingMatches: 3,
      availableCourts: 12,
      teamMembers: 8,
      tournaments: 2,
      challenges: 5,
      winRate: 75,
      totalGoals: 24,
      assists: 18
    },
    recentMatches: [
      { id: 1, opponent: 'Los Tigres', date: '2024-01-20', time: '15:00', court: 'Cancha Central', status: 'upcoming', score: null },
      { id: 2, opponent: 'Fútbol Club', date: '2024-01-18', time: '18:00', court: 'Cancha Norte', status: 'completed', score: '3-1' },
      { id: 3, opponent: 'Los Campeones', date: '2024-01-15', time: '16:30', court: 'Cancha Sur', status: 'completed', score: '2-2' },
      { id: 4, opponent: 'Equipo Alpha', date: '2024-01-12', time: '17:00', court: 'Cancha Central', status: 'completed', score: '4-0' }
    ],
    availableCourts: [
      { id: 1, name: 'Cancha Central', type: 'Techada', price: 50000, status: 'available', capacity: 10, rating: 4.8 },
      { id: 2, name: 'Cancha Norte', type: 'Descubierta', price: 40000, status: 'available', capacity: 8, rating: 4.5 },
      { id: 3, name: 'Cancha Sur', type: 'Techada', price: 55000, status: 'occupied', capacity: 12, rating: 4.9 },
      { id: 4, name: 'Cancha Este', type: 'Descubierta', price: 35000, status: 'maintenance', capacity: 6, rating: 4.2 }
    ],
    teamMembers: [
      { id: 1, name: 'Carlos Mendoza', position: 'Delantero', goals: 8, assists: 3, rating: 4.8, avatar: null },
      { id: 2, name: 'Luis Rodríguez', position: 'Mediocampista', goals: 3, assists: 7, rating: 4.6, avatar: null },
      { id: 3, name: 'Miguel Torres', position: 'Defensor', goals: 1, assists: 2, rating: 4.4, avatar: null },
      { id: 4, name: 'Andrés López', position: 'Portero', goals: 0, assists: 1, rating: 4.7, avatar: null }
    ],
    activities: [
      { status: 'info', icon: 'pi pi-calendar', content: 'Partido programado contra Los Tigres para mañana 15:00' },
      { status: 'success', icon: 'pi pi-check', content: 'Victoria 3-1 contra Fútbol Club' },
      { status: 'warning', icon: 'pi pi-bolt', content: 'Nuevo reto recibido de Equipo Alpha' },
      { status: 'info', icon: 'pi pi-user-plus', content: 'Nuevo miembro: Juan Pérez se unió al equipo' },
      { status: 'success', icon: 'pi pi-trophy', content: 'Torneo Copa RetoYa 2024 - Inscripción exitosa' }
    ]
  });

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
  };

  const getMatchStatusTag = (status) => {
    switch (status) {
      case 'upcoming':
        return <Tag value="Próximo" severity="info" />;
      case 'completed':
        return <Tag value="Completado" severity="success" />;
      case 'cancelled':
        return <Tag value="Cancelado" severity="danger" />;
      default:
        return <Tag value="Desconocido" severity="secondary" />;
    }
  };

  const getCourtStatusTag = (status) => {
    switch (status) {
      case 'available':
        return <Tag value="Disponible" severity="success" />;
      case 'occupied':
        return <Tag value="Ocupada" severity="danger" />;
      case 'maintenance':
        return <Tag value="Mantenimiento" severity="warning" />;
      default:
        return <Tag value="Desconocido" severity="secondary" />;
    }
  };

  const getCourtTypeTag = (type) => {
    switch (type) {
      case 'Techada':
        return <Tag value="Techada" severity="info" />;
      case 'Descubierta':
        return <Tag value="Descubierta" severity="success" />;
      default:
        return <Tag value={type} severity="secondary" />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const MetricCard = ({ title, value, subtitle, icon, color, trend, gradient }) => (
    <Card className="h-full border-none shadow-2 hover:shadow-4 transition-all transition-duration-300 cursor-pointer">
      <div className="relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ 
            background: gradient || `linear-gradient(135deg, ${color}20, ${color}40)`
          }}
        ></div>
        <div className="relative p-4">
          <div className="flex align-items-center justify-content-between mb-3">
            <div className="flex-1">
              <span className="block text-600 font-medium mb-2 text-sm">{title}</span>
              <div className="text-900 font-bold text-3xl mb-1">{value}</div>
              {subtitle && (
                <div className="text-500 text-sm">{subtitle}</div>
              )}
            </div>
            <div 
              className="flex align-items-center justify-content-center border-round shadow-3" 
              style={{ 
                width: '4rem', 
                height: '4rem',
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                color: 'white'
              }}
            >
              <i className={`${icon} text-2xl`}></i>
            </div>
          </div>
          
          {trend && (
            <div className="flex align-items-center">
              <i className={`pi pi-arrow-${trend > 0 ? 'up' : 'down'} text-${trend > 0 ? 'green' : 'red'}-500 mr-2`}></i>
              <span className={`text-${trend > 0 ? 'green' : 'red'}-500 font-medium text-sm`}>
                {Math.abs(trend)}% este mes
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const renderDashboardContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return (
          <div className="grid">
            {/* Métricas Principales Mejoradas */}
            <div className="col-12 md:col-6 lg:col-3">
              <MetricCard
                title="Partidos Próximos"
                value={dashboardData.stats.upcomingMatches}
                subtitle="+2 esta semana"
                icon="pi pi-calendar"
                color="#3b82f6"
                trend={15}
                gradient="linear-gradient(135deg, #3b82f620, #1d4ed840)"
              />
            </div>

            <div className="col-12 md:col-6 lg:col-3">
              <MetricCard
                title="Canchas Disponibles"
                value={dashboardData.stats.availableCourts}
                subtitle="75% disponibles"
                icon="pi pi-building"
                color="#10b981"
                trend={8}
                gradient="linear-gradient(135deg, #10b98120, #05966940)"
              />
            </div>

            <div className="col-12 md:col-6 lg:col-3">
              <MetricCard
                title="Miembros del Equipo"
                value={dashboardData.stats.teamMembers}
                subtitle="Equipo completo"
                icon="pi pi-users"
                color="#8b5cf6"
                trend={0}
                gradient="linear-gradient(135deg, #8b5cf620, #7c3aed40)"
              />
            </div>

            <div className="col-12 md:col-6 lg:col-3">
              <MetricCard
                title="Tasa de Victoria"
                value={`${dashboardData.stats.winRate}%`}
                subtitle="Excelente rendimiento"
                icon="pi pi-trophy"
                color="#f59e0b"
                trend={5}
                gradient="linear-gradient(135deg, #f59e0b20, #d9770640)"
              />
            </div>

            {/* Card de Rendimiento Mejorada */}
            <div className="col-12 lg:col-8">
              <Card className="border-none shadow-2">
                <div className="p-4">
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className="text-900 font-bold text-xl m-0">Rendimiento del Equipo</h3>
                    <Button 
                      label="Ver Detalles" 
                      icon="pi pi-chart-line" 
                      size="small" 
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <div className="grid">
                    <div className="col-12 md:col-4">
                      <div className="text-center p-4 border-round" style={{ backgroundColor: '#f0fdf4' }}>
                        <div className="text-900 font-bold text-4xl mb-2" style={{ color: '#22c55e' }}>
                          {dashboardData.stats.totalGoals}
                        </div>
                        <div className="text-600 font-medium mb-1">Goles Totales</div>
                        <div className="text-500 text-sm">1.3 por partido</div>
                        <ProgressBar 
                          value={80} 
                          style={{ height: '6px', marginTop: '10px' }}
                          color="#22c55e"
                        />
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className="text-center p-4 border-round" style={{ backgroundColor: '#fef3c7' }}>
                        <div className="text-900 font-bold text-4xl mb-2" style={{ color: '#f59e0b' }}>
                          {dashboardData.stats.assists}
                        </div>
                        <div className="text-600 font-medium mb-1">Asistencias</div>
                        <div className="text-500 text-sm">1.0 por partido</div>
                        <ProgressBar 
                          value={70} 
                          style={{ height: '6px', marginTop: '10px' }}
                          color="#f59e0b"
                        />
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className="text-center p-4 border-round" style={{ backgroundColor: '#dbeafe' }}>
                        <div className="text-900 font-bold text-4xl mb-2" style={{ color: '#3b82f6' }}>
                          12
                        </div>
                        <div className="text-600 font-medium mb-1">Partidos Ganados</div>
                        <div className="text-500 text-sm">75% de victorias</div>
                        <ProgressBar 
                          value={75} 
                          style={{ height: '6px', marginTop: '10px' }}
                          color="#3b82f6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Timeline de Actividades Mejorada */}
            <div className="col-12 lg:col-4">
              <Card className="border-none shadow-2 h-full">
                <div className="p-4">
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className="text-900 font-bold text-xl m-0">Actividad Reciente</h3>
                    <Button 
                      icon="pi pi-refresh" 
                      size="small" 
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <ScrollPanel style={{ height: '300px' }}>
                    <Timeline 
                      value={dashboardData.activities} 
                      content={(item) => (
                        <div className="flex align-items-start p-3 border-round hover:bg-gray-50 transition-colors transition-duration-200">
                          <div 
                            className={`flex align-items-center justify-content-center border-round mr-3 ${
                              item.status === 'success' ? 'bg-green-100' : 
                              item.status === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                            }`}
                            style={{ width: '2.5rem', height: '2.5rem' }}
                          >
                            <i className={`${item.icon} text-sm ${
                              item.status === 'success' ? 'text-green-600' : 
                              item.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                            }`}></i>
                          </div>
                          <div className="flex-1">
                            <span className="text-900 font-medium text-sm">{item.content}</span>
                            <div className="text-500 text-xs mt-1">Hace 2 horas</div>
                          </div>
                        </div>
                      )}
                    />
                  </ScrollPanel>
                </div>
              </Card>
            </div>

            {/* Top Jugadores Mejorado */}
            <div className="col-12">
              <Card className="border-none shadow-2">
                <div className="p-4">
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className="text-900 font-bold text-xl m-0">Top Jugadores</h3>
                    <Button 
                      label="Ver Todos" 
                      icon="pi pi-users" 
                      size="small" 
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <div className="grid">
                    {dashboardData.teamMembers.map((member, index) => (
                      <div key={member.id} className="col-12 md:col-6 lg:col-3">
                        <Panel 
                          header={
                            <div className="flex align-items-center">
                              <div 
                                className="flex align-items-center justify-content-center border-round mr-3"
                                style={{ 
                                  width: '2rem', 
                                  height: '2rem',
                                  backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7f32' : '#6b7280',
                                  color: 'white'
                                }}
                              >
                                <span className="font-bold text-sm">#{index + 1}</span>
                              </div>
                              <span className="font-bold text-900">{member.name}</span>
                            </div>
                          } 
                          toggleable
                          className="h-full"
                        >
                          <div className="flex align-items-center justify-content-between mb-3">
                            <div className="flex align-items-center">
                              <Avatar 
                                image={member.avatar}
                                icon="pi pi-user"
                                size="large"
                                shape="circle"
                                className="mr-3"
                              />
                              <div>
                                <div className="font-medium text-900">{member.name}</div>
                                <div className="text-500 text-sm">{member.position}</div>
                              </div>
                            </div>
                            <Tag value={`⭐ ${member.rating}`} severity="info" />
                          </div>
                          <div className="grid">
                            <div className="col-6 text-center p-3 border-round" style={{ backgroundColor: '#f0fdf4' }}>
                              <div className="text-900 font-bold text-xl" style={{ color: '#22c55e' }}>{member.goals}</div>
                              <div className="text-500 text-sm">Goles</div>
                            </div>
                            <div className="col-6 text-center p-3 border-round" style={{ backgroundColor: '#fef3c7' }}>
                              <div className="text-900 font-bold text-xl" style={{ color: '#f59e0b' }}>{member.assists}</div>
                              <div className="text-500 text-sm">Asistencias</div>
                            </div>
                          </div>
                        </Panel>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'matches':
        return (
          <Card className="border-none shadow-2">
            <div className="p-4">
              <div className="flex align-items-center justify-content-between mb-4">
                <h3 className="text-900 font-bold text-xl m-0">Partidos Programados</h3>
                <Button 
                  label="Programar Nuevo Partido" 
                  icon="pi pi-plus"
                  className="p-button-success"
                />
              </div>
              <DataTable 
                value={dashboardData.recentMatches} 
                paginator 
                rows={5}
                emptyMessage="No hay partidos programados"
                className="p-datatable-sm"
              >
                <Column field="opponent" header="Oponente" sortable />
                <Column field="date" header="Fecha" sortable />
                <Column field="time" header="Hora" />
                <Column field="court" header="Cancha" />
                <Column 
                  field="status" 
                  header="Estado" 
                  body={(rowData) => getMatchStatusTag(rowData.status)}
                />
                <Column 
                  field="score" 
                  header="Resultado" 
                  body={(rowData) => rowData.score || '-'}
                />
                <Column 
                  header="Acciones" 
                  body={() => (
                    <div className="flex gap-2">
                      <Button icon="pi pi-eye" size="small" text />
                      <Button icon="pi pi-pencil" size="small" text />
                      <Button icon="pi pi-trash" size="small" text severity="danger" />
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </Card>
        );

      case 'courts':
        return (
          <Card className="border-none shadow-2">
            <div className="p-4">
              <div className="flex align-items-center justify-content-between mb-4">
                <h3 className="text-900 font-bold text-xl m-0">Canchas Disponibles</h3>
                <Button 
                  label="Reservar Cancha" 
                  icon="pi pi-calendar-plus"
                  className="p-button-success"
                />
              </div>
              <DataTable 
                value={dashboardData.availableCourts} 
                paginator 
                rows={5}
                emptyMessage="No hay canchas disponibles"
                className="p-datatable-sm"
              >
                <Column field="name" header="Nombre" sortable />
                <Column 
                  field="type" 
                  header="Tipo" 
                  body={(rowData) => getCourtTypeTag(rowData.type)}
                />
                <Column 
                  field="price" 
                  header="Precio" 
                  body={(rowData) => formatPrice(rowData.price)}
                  sortable 
                />
                <Column field="capacity" header="Capacidad" />
                <Column 
                  field="rating" 
                  header="Rating" 
                  body={(rowData) => (
                    <div className="flex align-items-center">
                      <span className="mr-2">⭐ {rowData.rating}</span>
                    </div>
                  )}
                  sortable 
                />
                <Column 
                  field="status" 
                  header="Estado" 
                  body={(rowData) => getCourtStatusTag(rowData.status)}
                />
                <Column 
                  header="Acciones" 
                  body={(rowData) => (
                    <div className="flex gap-2">
                      <Button 
                        icon="pi pi-calendar-plus" 
                        size="small" 
                        text 
                        disabled={rowData.status !== 'available'}
                      />
                      <Button icon="pi pi-eye" size="small" text />
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </Card>
        );

      case 'challenges':
        return (
          <Card className="border-none shadow-2">
            <div className="p-4">
              <div className="flex align-items-center justify-content-between mb-4">
                <h3 className="text-900 font-bold text-xl m-0">Sistema de Retos</h3>
                <Button 
                  label="Crear Nuevo Reto" 
                  icon="pi pi-plus"
                  className="p-button-success"
                />
              </div>
              <TabView>
                <TabPanel header="Retos Recibidos">
                  <div className="flex flex-column gap-3">
                    {[1, 2, 3].map(i => (
                      <Panel key={i} header={`Reto #${i} - Equipo Los Tigres`} toggleable>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <p><strong>Fecha:</strong> 25 de Enero, 2024</p>
                            <p><strong>Hora:</strong> 15:00</p>
                            <p><strong>Cancha:</strong> Cancha Central</p>
                          </div>
                          <div className="col-12 md:col-6">
                            <p><strong>Modalidad:</strong> Fútbol 8</p>
                            <p><strong>Apuesta:</strong> $50,000</p>
                            <p><strong>Estado:</strong> Pendiente</p>
                          </div>
                          <div className="col-12 flex gap-2 mt-3">
                            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" />
                            <Button label="Rechazar" icon="pi pi-times" className="p-button-danger" />
                            <Button label="Negociar" icon="pi pi-comments" className="p-button-info" />
                          </div>
                        </div>
                      </Panel>
                    ))}
                  </div>
                </TabPanel>
                <TabPanel header="Retos Enviados">
                  <div className="flex flex-column gap-3">
                    {[1, 2].map(i => (
                      <Panel key={i} header={`Reto #${i} - Equipo Alpha`} toggleable>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <p><strong>Fecha:</strong> 28 de Enero, 2024</p>
                            <p><strong>Hora:</strong> 18:00</p>
                            <p><strong>Cancha:</strong> Cancha Norte</p>
                          </div>
                          <div className="col-12 md:col-6">
                            <p><strong>Modalidad:</strong> Fútbol 11</p>
                            <p><strong>Apuesta:</strong> $100,000</p>
                            <p><strong>Estado:</strong> Esperando respuesta</p>
                          </div>
                          <div className="col-12 flex gap-2 mt-3">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" />
                            <Button label="Modificar" icon="pi pi-pencil" className="p-button-warning" />
                          </div>
                        </div>
                      </Panel>
                    ))}
                  </div>
                </TabPanel>
              </TabView>
            </div>
          </Card>
        );

      default:
        return (
          <Card className="border-none shadow-2">
            <div className="text-center py-8">
              <div 
                className="flex align-items-center justify-content-center border-round mx-auto mb-4"
                style={{ 
                  width: '5rem', 
                  height: '5rem',
                  background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                  color: 'white'
                }}
              >
                <i className="pi pi-cog text-3xl"></i>
              </div>
              <h3 className="text-600 mb-2 text-xl">
                {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
              </h3>
              <p className="text-500">Esta funcionalidad estará disponible próximamente</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Sidebar */}
      <SidebarMenu
        visible={sidebarVisible}
        onToggle={() => setSidebarVisible(!sidebarVisible)}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        user={user}
        teamData={{
          name: 'Los Campeones',
          members: dashboardData.stats.teamMembers,
          avatar: null
        }}
        notifications={{
          matches: dashboardData.stats.upcomingMatches,
          courts: dashboardData.stats.availableCourts,
          challenges: dashboardData.stats.challenges,
          tournaments: dashboardData.stats.tournaments
        }}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-column">
        {/* Header Principal Mejorado */}
        <div 
          className="px-4 py-3 flex align-items-center justify-content-between border-bottom-1 border-200"
          style={{ 
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div className="flex align-items-center">
            <Button
              icon="pi pi-bars"
              text
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="mr-3 text-600 hover:text-900 transition-colors transition-duration-200"
            />
            <h2 className="text-900 m-0 font-bold text-xl">
              {activeMenuItem === 'dashboard' ? 'Dashboard' : 
               activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex align-items-center gap-3">
            <Button
              icon="pi pi-bell"
              text
              className="text-600 hover:text-900 transition-colors transition-duration-200"
              badge={dashboardData.stats.challenges}
              badgeClassName="p-badge-danger"
            />
            <Avatar 
              image={user?.avatar_url}
              icon="pi pi-user"
              size="normal"
              shape="circle"
              className="hover:shadow-2 transition-all transition-duration-200"
            />
          </div>
        </div>

        {/* Contenido del Dashboard */}
        <div className="p-4 flex-1">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
}
