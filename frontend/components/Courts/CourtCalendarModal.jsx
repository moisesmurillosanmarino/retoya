import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export default function CourtCalendarModal({ 
  visible, 
  onHide, 
  court, 
  onDateSelect 
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reservations, setReservations] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  // Datos mock de reservas existentes para simular disponibilidad
  const mockReservations = [
    { date: '2024-10-20', courtId: 'c1-1', time: '18:00', team: 'Los Tigres', status: 'confirmed' },
    { date: '2024-10-20', courtId: 'c1-1', time: '19:00', team: 'Los Tigres', status: 'confirmed' },
    { date: '2024-10-21', courtId: 'c1-2', time: '16:00', team: 'Los Campeones', status: 'confirmed' },
    { date: '2024-10-21', courtId: 'c1-2', time: '17:00', team: 'Los Campeones', status: 'confirmed' },
    { date: '2024-10-22', courtId: 'c1-1', time: '19:00', team: 'Estrellas FC', status: 'confirmed' },
    { date: '2024-10-23', courtId: 'c1-2', time: '18:00', team: 'Galácticos', status: 'confirmed' },
    { date: '2024-10-24', courtId: 'c1-1', time: '20:00', team: 'Los Invencibles', status: 'confirmed' },
    { date: '2024-10-25', courtId: 'c1-2', time: '17:00', team: 'Titanes', status: 'confirmed' },
    { date: '2024-10-26', courtId: 'c1-1', time: '19:00', team: 'Vengadores', status: 'confirmed' },
    { date: '2024-10-27', courtId: 'c1-2', time: '18:00', team: 'Furia Roja', status: 'confirmed' },
    { date: '2024-10-28', courtId: 'c1-1', time: '16:00', team: 'Los Rayos', status: 'confirmed' },
    { date: '2024-10-29', courtId: 'c1-2', time: '20:00', team: 'Los Relámpagos', status: 'confirmed' },
    { date: '2024-10-30', courtId: 'c1-1', time: '17:00', team: 'Los Truenos', status: 'confirmed' },
    { date: '2024-11-01', courtId: 'c1-1', time: '18:00', team: 'Los Toros', status: 'confirmed' },
    { date: '2024-11-02', courtId: 'c1-2', time: '19:00', team: 'Los Leones', status: 'confirmed' },
    { date: '2024-11-03', courtId: 'c1-1', time: '16:00', team: 'Los Águilas', status: 'confirmed' },
    { date: '2024-11-04', courtId: 'c1-2', time: '20:00', team: 'Los Halcones', status: 'confirmed' },
    { date: '2024-11-05', courtId: 'c1-1', time: '17:00', team: 'Los Lobos', status: 'confirmed' },
    { date: '2024-11-06', courtId: 'c1-2', time: '18:00', team: 'Los Zorros', status: 'confirmed' },
    { date: '2024-11-07', courtId: 'c1-1', time: '19:00', team: 'Los Osos', status: 'confirmed' }
  ];

  // Cargar reservas cuando se abre el modal
  useEffect(() => {
    if (visible && court) {
      loadReservations();
    }
  }, [visible, court]);

  const loadReservations = () => {
    setLoading(true);
    
    // Simular carga de datos
    setTimeout(() => {
      const reservationsByDate = {};
      
      // Filtrar reservas para la cancha seleccionada
      const courtReservations = mockReservations.filter(res => 
        res.courtId.startsWith(`c${court.id}-`)
      );
      
      // Agrupar por fecha
      courtReservations.forEach(res => {
        if (!reservationsByDate[res.date]) {
          reservationsByDate[res.date] = [];
        }
        reservationsByDate[res.date].push(res);
      });
      
      setReservations(reservationsByDate);
      setLoading(false);
    }, 500);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateAvailability = (date) => {
    if (!date) return { status: 'full', count: 0, color: '#ef4444' };
    
    const dateStr = date.toISOString().split('T')[0];
    const dayReservations = reservations[dateStr] || [];
    
    // Horarios disponibles (6 AM a 10 PM = 17 horarios)
    const totalSlots = 17;
    const occupiedSlots = dayReservations.length;
    const availableSlots = totalSlots - occupiedSlots;
    
    if (availableSlots === 0) return { status: 'full', count: 0, color: '#ef4444' };
    if (availableSlots <= 3) return { status: 'limited', count: availableSlots, color: '#f59e0b' };
    return { status: 'available', count: availableSlots, color: '#22c55e' };
  };

  const handleDateSelect = () => {
    if (selectedDate) {
      const availability = getDateAvailability(selectedDate);
      
      if (availability.status === 'full') {
        toast.current.show({
          severity: 'warn',
          summary: 'Sin Disponibilidad',
          detail: 'Esta fecha no tiene horarios disponibles',
          life: 3000
        });
        return;
      }
      
      if (onDateSelect) {
        onDateSelect(selectedDate, availability);
      }
      
      toast.current.show({
        severity: 'success',
        summary: 'Fecha Seleccionada',
        detail: `${formatDate(selectedDate)} - ${availability.count} horarios disponibles`,
        life: 3000
      });
    }
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    
    const availability = getDateAvailability(selectedDate);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayReservations = reservations[dateStr] || [];
    
    return {
      date: selectedDate,
      availability,
      reservations: dayReservations
    };
  };

  const selectedDateInfo = getSelectedDateInfo();

  // Generar días del mes actual para mostrar disponibilidad
  const generateMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  const monthDays = generateMonthDays();

  if (!court) return null;

  return (
    <>
      <Toast ref={toast} />
      
      <Dialog
        header={
          <div className="flex align-items-center gap-3">
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0fdf4'
            }}>
              <i className="pi pi-calendar" style={{ fontSize: '20px', color: '#22c55e' }}></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-0">Calendario de Reservas</h3>
              <p className="text-sm text-gray-600 mb-0">{court.name}</p>
            </div>
          </div>
        }
        visible={visible}
        onHide={onHide}
        style={{ width: '95vw', maxWidth: '1200px' }}
        maximizable
        className="p-dialog-lg"
      >
        <div className="grid">
          {/* Información de la Cancha */}
          <div className="col-12">
            <Card className="mb-4">
              <div className="grid">
                <div className="col-12 md:col-4">
                  <img 
                    src={court.image} 
                    alt={court.name}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="col-12 md:col-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{court.name}</h3>
                  <p className="text-lg text-gray-600 mb-2">{court.business}</p>
                  <p className="text-gray-600 mb-3">
                    <i className="pi pi-map-marker text-green-500 mr-2"></i>
                    {court.address}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {court.facilities.map((facility, index) => (
                      <Tag key={index} value={facility} severity="info" />
                    ))}
                  </div>
                  <div className="flex align-items-center gap-4">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(court.price)}
                    </div>
                    <div className="flex align-items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i 
                          key={i} 
                          className={`pi ${i < Math.floor(court.rating) ? 'pi-star-fill' : 'pi-star'}`} 
                          style={{ color: '#f59e0b' }}
                        ></i>
                      ))}
                      <span className="text-sm text-gray-600">({court.rating})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Calendario Principal */}
          <div className="col-12 lg:col-8">
            <Card>
              <div className="flex justify-content-between align-items-center mb-3">
                <h4 className="text-xl font-bold text-gray-800 m-0">Selecciona una Fecha</h4>
                <div className="flex align-items-center gap-2">
                  <Button
                    icon="pi pi-chevron-left"
                    className="p-button-text p-button-sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  />
                  <span className="text-lg font-semibold text-gray-700">
                    {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button
                    icon="pi pi-chevron-right"
                    className="p-button-text p-button-sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  />
                </div>
              </div>

              {/* Leyenda */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                  <span className="text-sm text-gray-600">Disponible</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                  <span className="text-sm text-gray-600">Limitado</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                  <span className="text-sm text-gray-600">Sin disponibilidad</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9ca3af' }}></div>
                  <span className="text-sm text-gray-600">Fecha pasada</span>
                </div>
              </div>

              {/* Calendario Personalizado */}
              <div className="custom-calendar">
                {/* Días de la semana */}
                <div className="calendar-header">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="calendar-day-header">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Días del mes */}
                <div className="calendar-body">
                  {monthDays.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="calendar-day empty"></div>;
                    }
                    
                    const availability = getDateAvailability(date);
                    const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isPast = date < new Date().setHours(0, 0, 0, 0);
                    
                    return (
                      <div
                        key={index}
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                        onClick={() => !isPast && setSelectedDate(date)}
                        style={{
                          cursor: isPast ? 'not-allowed' : 'pointer',
                          backgroundColor: isPast ? '#f3f4f6' : 
                                          availability.status === 'available' ? '#f0fdf4' :
                                          availability.status === 'limited' ? '#fef3c7' : '#fee2e2',
                          border: isSelected ? '2px solid #22c55e' : 
                                  isToday ? '2px solid #22c55e' : '1px solid #e5e7eb',
                          color: isPast ? '#9ca3af' :
                                 availability.status === 'full' ? '#dc2626' : '#374151'
                        }}
                      >
                        <div className="day-number">{date.getDate()}</div>
                        {!isPast && availability.count > 0 && (
                          <div 
                            className="availability-dot"
                            style={{ backgroundColor: availability.color }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Panel de Información */}
          <div className="col-12 lg:col-4">
            <Card>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Información de Fecha</h4>
              
              {selectedDateInfo ? (
                <div>
                  <div className="mb-3">
                    <h5 className="text-xl font-bold text-gray-800 mb-1">
                      {selectedDateInfo.date.getDate()} de {selectedDateInfo.date.toLocaleDateString('es-CO', { month: 'long' })}
                    </h5>
                    <p className="text-gray-600 mb-2">
                      {selectedDateInfo.date.toLocaleDateString('es-CO', { weekday: 'long' })}
                    </p>
                    
                    <div className="flex align-items-center gap-2 mb-2">
                      <Tag 
                        value={
                          selectedDateInfo.availability.status === 'available' ? 
                          `${selectedDateInfo.availability.count} horarios disponibles` :
                          selectedDateInfo.availability.status === 'limited' ? 
                          `Solo ${selectedDateInfo.availability.count} horarios` : 
                          'Sin disponibilidad'
                        }
                        severity={
                          selectedDateInfo.availability.status === 'available' ? 'success' :
                          selectedDateInfo.availability.status === 'limited' ? 'warning' : 'danger'
                        }
                      />
                    </div>
                  </div>

                  <Divider />

                  {/* Reservas del Día */}
                  {selectedDateInfo.reservations.length > 0 && (
                    <div className="mt-3">
                      <h6 className="font-semibold text-gray-700 mb-2">Reservas del Día</h6>
                      <div className="space-y-2">
                        {selectedDateInfo.reservations.map((reservation, index) => (
                          <div key={index} className="p-2 bg-gray-50 border-round">
                            <div className="font-medium text-sm text-gray-800">
                              {reservation.time} - {reservation.team}
                            </div>
                            <div className="text-xs text-gray-600">
                              Cancha {reservation.courtId.split('-')[1]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botón de Continuar */}
                  {selectedDateInfo.availability.status !== 'full' && (
                    <div className="mt-4">
                      <Button
                        label="Continuar con esta Fecha"
                        icon="pi pi-arrow-right"
                        className="p-button-success w-full"
                        onClick={handleDateSelect}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <i className="pi pi-calendar text-4xl mb-3"></i>
                  <p>Selecciona una fecha para ver la disponibilidad</p>
                </div>
              )}
            </Card>

            {/* Estadísticas del Mes */}
            <Card className="mt-3">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Estadísticas del Mes</h4>
              <div className="grid">
                <div className="col-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(reservations).reduce((sum, day) => sum + (day.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Reservas</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.keys(reservations).length}
                    </div>
                    <div className="text-sm text-gray-600">Días Ocupados</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Dialog>
    </>
  );
}