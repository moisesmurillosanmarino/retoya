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
import SidebarMenuAdaptativo from '../../components/Layout/SidebarMenuAdaptativo.jsx';
import { useAuthStore } from '../../app/store/auth.js';

export default function DashboardAdaptativo() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    orientation: 'landscape'
  });
  const { user } = useAuthStore();
  const toast = useRef(null);

  // Detección completa de pantalla
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

      // Ajustar sidebar según el tamaño de pantalla
      if (width >= 1024) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);
    
    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

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
    
    // Redirigir a páginas específicas
    if (itemId === 'courts') {
      window.location.href = '/courts/view';
      return;
    }
    
    // Cerrar sidebar en móviles después de hacer click
    if (screenInfo.isMobile) {
      setSidebarVisible(false);
    }
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

  // Función para obtener clases CSS adaptativas
  const getAdaptiveClasses = () => {
    const { isMobile, isTablet, isLaptop, isDesktop } = screenInfo;
    
    return {
      // Grid classes adaptativas
      metricGrid: isMobile ? 'col-12' : isTablet ? 'col-12 sm:col-6' : isLaptop ? 'col-12 sm:col-6 lg:col-3' : 'col-12 sm:col-6 lg:col-3 xl:col-3',
      contentGrid: isMobile ? 'col-12' : isTablet ? 'col-12' : isLaptop ? 'col-12 lg:col-8' : 'col-12 lg:col-8 xl:col-8',
      sidebarGrid: isMobile ? 'col-12' : isTablet ? 'col-12' : isLaptop ? 'col-12 lg:col-4' : 'col-12 lg:col-4 xl:col-4',
      
      // Padding adaptativo
      cardPadding: isMobile ? 'p-2' : isTablet ? 'p-3' : isLaptop ? 'p-4' : 'p-4',
      containerPadding: isMobile ? 'p-2' : isTablet ? 'p-3' : isLaptop ? 'p-4' : 'p-4',
      
      // Font sizes adaptativos
      titleSize: isMobile ? 'text-lg' : isTablet ? 'text-xl' : isLaptop ? 'text-xl' : 'text-2xl',
      valueSize: isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : isLaptop ? 'text-3xl' : 'text-4xl',
      subtitleSize: isMobile ? 'text-xs' : isTablet ? 'text-sm' : isLaptop ? 'text-sm' : 'text-base',
      
      // Icon sizes adaptativos
      iconSize: isMobile ? 'text-xl' : isTablet ? 'text-2xl' : isLaptop ? 'text-2xl' : 'text-3xl',
      iconContainer: isMobile ? '3rem' : isTablet ? '3.5rem' : isLaptop ? '4rem' : '4.5rem',
      
      // Button sizes adaptativos
      buttonSize: isMobile ? 'small' : isTablet ? 'small' : isLaptop ? 'normal' : 'normal',
      
      // DataTable rows adaptativos
      tableRows: isMobile ? 3 : isTablet ? 5 : isLaptop ? 8 : 10,
      
      // ScrollPanel height adaptativo
      scrollHeight: isMobile ? '250px' : isTablet ? '300px' : isLaptop ? '350px' : '400px'
    };
  };

  const adaptiveClasses = getAdaptiveClasses();

  const MetricCard = ({ title, value, subtitle, icon, color, trend, gradient }) => (
    <Card className={`h-full border-none shadow-2 hover:shadow-4 transition-all transition-duration-300 cursor-pointer ${adaptiveClasses.cardPadding}`}>
      <div className="relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ 
            background: gradient || `linear-gradient(135deg, ${color}20, ${color}40)`
          }}
        ></div>
        <div className="relative">
          <div className="flex align-items-center justify-content-between mb-3">
            <div className="flex-1">
              <span className={`block text-600 font-medium mb-2 ${adaptiveClasses.subtitleSize}`}>{title}</span>
              <div className={`text-900 font-bold mb-1 ${adaptiveClasses.valueSize}`}>{value}</div>
              {subtitle && (
                <div className={`text-500 ${adaptiveClasses.subtitleSize}`}>{subtitle}</div>
              )}
            </div>
            <div 
              className="flex align-items-center justify-content-center border-round shadow-3" 
              style={{ 
                width: adaptiveClasses.iconContainer, 
                height: adaptiveClasses.iconContainer,
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                color: 'white'
              }}
            >
              <i className={`${icon} ${adaptiveClasses.iconSize}`}></i>
            </div>
          </div>
          
          {trend && (
            <div className="flex align-items-center">
              <i className={`pi pi-arrow-${trend > 0 ? 'up' : 'down'} text-${trend > 0 ? 'green' : 'red'}-500 mr-2`}></i>
              <span className={`text-${trend > 0 ? 'green' : 'red'}-500 font-medium ${adaptiveClasses.subtitleSize}`}>
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
            {/* Métricas Principales Completamente Adaptativas */}
            <div className={adaptiveClasses.metricGrid}>
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

            <div className={adaptiveClasses.metricGrid}>
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

            <div className={adaptiveClasses.metricGrid}>
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

            <div className={adaptiveClasses.metricGrid}>
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

            {/* Card de Rendimiento Adaptativa */}
            <div className={adaptiveClasses.contentGrid}>
              <Card className="border-none shadow-2">
                <div className={adaptiveClasses.cardPadding}>
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Rendimiento del Equipo</h3>
                    <Button 
                      label={screenInfo.isMobile ? "" : "Ver Detalles"} 
                      icon="pi pi-chart-line" 
                      size={adaptiveClasses.buttonSize}
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <div className="grid">
                    <div className="col-12 md:col-4">
                      <div className={`text-center border-round ${adaptiveClasses.cardPadding}`} style={{ backgroundColor: '#f0fdf4' }}>
                        <div className={`text-900 font-bold mb-2 ${adaptiveClasses.valueSize}`} style={{ color: '#22c55e' }}>
                          {dashboardData.stats.totalGoals}
                        </div>
                        <div className={`text-600 font-medium mb-1 ${adaptiveClasses.subtitleSize}`}>Goles Totales</div>
                        <div className={`text-500 ${adaptiveClasses.subtitleSize}`}>1.3 por partido</div>
                        <ProgressBar 
                          value={80} 
                          style={{ height: screenInfo.isMobile ? '6px' : '8px', marginTop: '10px' }}
                          color="#22c55e"
                        />
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className={`text-center border-round ${adaptiveClasses.cardPadding}`} style={{ backgroundColor: '#fef3c7' }}>
                        <div className={`text-900 font-bold mb-2 ${adaptiveClasses.valueSize}`} style={{ color: '#f59e0b' }}>
                          {dashboardData.stats.assists}
                        </div>
                        <div className={`text-600 font-medium mb-1 ${adaptiveClasses.subtitleSize}`}>Asistencias</div>
                        <div className={`text-500 ${adaptiveClasses.subtitleSize}`}>1.0 por partido</div>
                        <ProgressBar 
                          value={70} 
                          style={{ height: screenInfo.isMobile ? '6px' : '8px', marginTop: '10px' }}
                          color="#f59e0b"
                        />
                      </div>
                    </div>
                    
                    <div className="col-12 md:col-4">
                      <div className={`text-center border-round ${adaptiveClasses.cardPadding}`} style={{ backgroundColor: '#dbeafe' }}>
                        <div className={`text-900 font-bold mb-2 ${adaptiveClasses.valueSize}`} style={{ color: '#3b82f6' }}>
                          12
                        </div>
                        <div className={`text-600 font-medium mb-1 ${adaptiveClasses.subtitleSize}`}>Partidos Ganados</div>
                        <div className={`text-500 ${adaptiveClasses.subtitleSize}`}>75% de victorias</div>
                        <ProgressBar 
                          value={75} 
                          style={{ height: screenInfo.isMobile ? '6px' : '8px', marginTop: '10px' }}
                          color="#3b82f6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Timeline de Actividades Adaptativa */}
            <div className={adaptiveClasses.sidebarGrid}>
              <Card className="border-none shadow-2 h-full">
                <div className={adaptiveClasses.cardPadding}>
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Actividad Reciente</h3>
                    <Button 
                      icon="pi pi-refresh" 
                      size={adaptiveClasses.buttonSize}
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <ScrollPanel style={{ height: adaptiveClasses.scrollHeight }}>
                    <Timeline 
                      value={dashboardData.activities} 
                      content={(item) => (
                        <div className={`flex align-items-start border-round hover:bg-gray-50 transition-colors transition-duration-200 ${adaptiveClasses.cardPadding}`}>
                          <div 
                            className={`flex align-items-center justify-content-center border-round mr-3 ${
                              item.status === 'success' ? 'bg-green-100' : 
                              item.status === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                            }`}
                            style={{ width: screenInfo.isMobile ? '2rem' : '2.5rem', height: screenInfo.isMobile ? '2rem' : '2.5rem' }}
                          >
                            <i className={`${item.icon} ${screenInfo.isMobile ? 'text-xs' : 'text-sm'} ${
                              item.status === 'success' ? 'text-green-600' : 
                              item.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                            }`}></i>
                          </div>
                          <div className="flex-1">
                            <span className={`text-900 font-medium ${adaptiveClasses.subtitleSize}`}>{item.content}</span>
                            <div className={`text-500 ${screenInfo.isMobile ? 'text-xs' : 'text-xs'} mt-1`}>Hace 2 horas</div>
                          </div>
                        </div>
                      )}
                    />
                  </ScrollPanel>
                </div>
              </Card>
            </div>

            {/* Top Jugadores Adaptativo */}
            <div className="col-12">
              <Card className="border-none shadow-2">
                <div className={adaptiveClasses.cardPadding}>
                  <div className="flex align-items-center justify-content-between mb-4">
                    <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Top Jugadores</h3>
                    <Button 
                      label={screenInfo.isMobile ? "" : "Ver Todos"} 
                      icon="pi pi-users" 
                      size={adaptiveClasses.buttonSize}
                      text 
                      className="p-button-sm"
                    />
                  </div>
                  
                  <div className="grid">
                    {dashboardData.teamMembers.map((member, index) => (
                      <div key={member.id} className={screenInfo.isMobile ? 'col-12' : screenInfo.isTablet ? 'col-12 sm:col-6' : 'col-12 sm:col-6 lg:col-3'}>
                        <Panel 
                          header={
                            <div className="flex align-items-center">
                              <div 
                                className="flex align-items-center justify-content-center border-round mr-3"
                                style={{ 
                                  width: screenInfo.isMobile ? '1.5rem' : '2rem', 
                                  height: screenInfo.isMobile ? '1.5rem' : '2rem',
                                  backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7f32' : '#6b7280',
                                  color: 'white'
                                }}
                              >
                                <span className={`font-bold ${screenInfo.isMobile ? 'text-xs' : 'text-sm'}`}>#{index + 1}</span>
                              </div>
                              <span className={`font-bold text-900 ${adaptiveClasses.subtitleSize}`}>{member.name}</span>
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
                                size={screenInfo.isMobile ? "normal" : "large"}
                                shape="circle"
                                className="mr-3"
                              />
                              <div>
                                <div className={`font-medium text-900 ${adaptiveClasses.subtitleSize}`}>{member.name}</div>
                                <div className={`text-500 ${screenInfo.isMobile ? 'text-xs' : 'text-sm'}`}>{member.position}</div>
                              </div>
                            </div>
                            <Tag value={`⭐ ${member.rating}`} severity="info" />
                          </div>
                          <div className="grid">
                            <div className={`col-6 text-center border-round ${adaptiveClasses.cardPadding}`} style={{ backgroundColor: '#f0fdf4' }}>
                              <div className={`text-900 font-bold ${screenInfo.isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: '#22c55e' }}>{member.goals}</div>
                              <div className={`text-500 ${screenInfo.isMobile ? 'text-xs' : 'text-sm'}`}>Goles</div>
                            </div>
                            <div className={`col-6 text-center border-round ${adaptiveClasses.cardPadding}`} style={{ backgroundColor: '#fef3c7' }}>
                              <div className={`text-900 font-bold ${screenInfo.isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: '#f59e0b' }}>{member.assists}</div>
                              <div className={`text-500 ${screenInfo.isMobile ? 'text-xs' : 'text-sm'}`}>Asistencias</div>
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
            <div className={adaptiveClasses.cardPadding}>
              <div className={`flex ${screenInfo.isMobile ? 'flex-column' : 'align-items-center'} justify-content-between mb-4 gap-2`}>
                <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Partidos Programados</h3>
                <Button 
                  label={screenInfo.isMobile ? "" : "Programar Nuevo Partido"} 
                  icon="pi pi-plus"
                  className="p-button-success"
                  size={adaptiveClasses.buttonSize}
                />
              </div>
              <div className="overflow-x-auto">
                <DataTable 
                  value={dashboardData.recentMatches} 
                  paginator 
                  rows={adaptiveClasses.tableRows}
                  emptyMessage="No hay partidos programados"
                  className="p-datatable-sm"
                  scrollable={screenInfo.isMobile}
                  scrollHeight={screenInfo.isMobile ? "400px" : "auto"}
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
                      <div className={`flex ${screenInfo.isMobile ? 'gap-1' : 'gap-2'}`}>
                        <Button icon="pi pi-eye" size="small" text />
                        <Button icon="pi pi-pencil" size="small" text />
                        <Button icon="pi pi-trash" size="small" text severity="danger" />
                      </div>
                    )}
                  />
                </DataTable>
              </div>
            </div>
          </Card>
        );

      case 'courts':
        return (
          <Card className="border-none shadow-2">
            <div className={adaptiveClasses.cardPadding}>
              <div className={`flex ${screenInfo.isMobile ? 'flex-column' : 'align-items-center'} justify-content-between mb-4 gap-2`}>
                <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Canchas Disponibles</h3>
                <Button 
                  label={screenInfo.isMobile ? "" : "Reservar Cancha"} 
                  icon="pi pi-calendar-plus"
                  className="p-button-success"
                  size={adaptiveClasses.buttonSize}
                />
              </div>
              <div className="overflow-x-auto">
                <DataTable 
                  value={dashboardData.availableCourts} 
                  paginator 
                  rows={adaptiveClasses.tableRows}
                  emptyMessage="No hay canchas disponibles"
                  className="p-datatable-sm"
                  scrollable={screenInfo.isMobile}
                  scrollHeight={screenInfo.isMobile ? "400px" : "auto"}
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
                      <div className={`flex ${screenInfo.isMobile ? 'gap-1' : 'gap-2'}`}>
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
            </div>
          </Card>
        );

      case 'challenges':
        return (
          <Card className="border-none shadow-2">
            <div className={adaptiveClasses.cardPadding}>
              <div className={`flex ${screenInfo.isMobile ? 'flex-column' : 'align-items-center'} justify-content-between mb-4 gap-2`}>
                <h3 className={`text-900 font-bold m-0 ${adaptiveClasses.titleSize}`}>Sistema de Retos</h3>
                <Button 
                  label={screenInfo.isMobile ? "" : "Crear Nuevo Reto"} 
                  icon="pi pi-plus"
                  className="p-button-success"
                  size={adaptiveClasses.buttonSize}
                />
              </div>
              <TabView>
                <TabPanel header="Retos Recibidos">
                  <div className="flex flex-column gap-3">
                    {[1, 2, 3].map(i => (
                      <Panel key={i} header={`Reto #${i} - Equipo Los Tigres`} toggleable>
                        <div className="grid">
                          <div className="col-12 md:col-6">
                            <p className={adaptiveClasses.subtitleSize}><strong>Fecha:</strong> 25 de Enero, 2024</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Hora:</strong> 15:00</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Cancha:</strong> Cancha Central</p>
                          </div>
                          <div className="col-12 md:col-6">
                            <p className={adaptiveClasses.subtitleSize}><strong>Modalidad:</strong> Fútbol 8</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Apuesta:</strong> $50,000</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Estado:</strong> Pendiente</p>
                          </div>
                          <div className={`col-12 flex ${screenInfo.isMobile ? 'flex-column' : 'gap-2'} mt-3`}>
                            <Button label="Aceptar" icon="pi pi-check" className="p-button-success" size={adaptiveClasses.buttonSize} />
                            <Button label="Rechazar" icon="pi pi-times" className="p-button-danger" size={adaptiveClasses.buttonSize} />
                            <Button label="Negociar" icon="pi pi-comments" className="p-button-info" size={adaptiveClasses.buttonSize} />
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
                            <p className={adaptiveClasses.subtitleSize}><strong>Fecha:</strong> 28 de Enero, 2024</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Hora:</strong> 18:00</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Cancha:</strong> Cancha Norte</p>
                          </div>
                          <div className="col-12 md:col-6">
                            <p className={adaptiveClasses.subtitleSize}><strong>Modalidad:</strong> Fútbol 11</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Apuesta:</strong> $100,000</p>
                            <p className={adaptiveClasses.subtitleSize}><strong>Estado:</strong> Esperando respuesta</p>
                          </div>
                          <div className={`col-12 flex ${screenInfo.isMobile ? 'flex-column' : 'gap-2'} mt-3`}>
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" size={adaptiveClasses.buttonSize} />
                            <Button label="Modificar" icon="pi pi-pencil" className="p-button-warning" size={adaptiveClasses.buttonSize} />
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
            <div className="text-center py-6 md:py-8">
              <div 
                className="flex align-items-center justify-content-center border-round mx-auto mb-4"
                style={{ 
                  width: screenInfo.isMobile ? '4rem' : '5rem', 
                  height: screenInfo.isMobile ? '4rem' : '5rem',
                  background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                  color: 'white'
                }}
              >
                <i className={`pi pi-cog ${screenInfo.isMobile ? 'text-2xl' : 'text-3xl'}`}></i>
              </div>
              <h3 className={`text-600 mb-2 ${adaptiveClasses.titleSize}`}>
                {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
              </h3>
              <p className={`text-500 ${adaptiveClasses.subtitleSize}`}>Esta funcionalidad estará disponible próximamente</p>
            </div>
          </Card>
        );
    }
  };

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
        {/* Header Principal Completamente Adaptativo */}
        <div 
          className={`${screenInfo.isMobile ? 'px-2 py-2' : screenInfo.isTablet ? 'px-3 py-2' : 'px-4 py-3'} flex align-items-center justify-content-between border-bottom-1 border-200`}
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
              className={`${screenInfo.isMobile ? 'mr-2' : 'mr-3'} text-600 hover:text-900 transition-colors transition-duration-200`}
              size={adaptiveClasses.buttonSize}
            />
            <h2 className={`text-900 m-0 font-bold ${adaptiveClasses.titleSize}`}>
              {activeMenuItem === 'dashboard' ? 'Dashboard' : 
               activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1).replace('-', ' ')}
            </h2>
          </div>
          
          <div className={`flex align-items-center ${screenInfo.isMobile ? 'gap-2' : 'gap-3'}`}>
            <Button
              icon="pi pi-bell"
              text
              className="text-600 hover:text-900 transition-colors transition-duration-200"
              badge={dashboardData.stats.challenges}
              badgeClassName="p-badge-danger"
              size={adaptiveClasses.buttonSize}
            />
            <Avatar 
              image={user?.avatar_url}
              icon="pi pi-user"
              size={screenInfo.isMobile ? "small" : "normal"}
              shape="circle"
              className="hover:shadow-2 transition-all transition-duration-200"
            />
          </div>
        </div>

        {/* Contenido del Dashboard */}
        <div className={adaptiveClasses.containerPadding}>
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
}
