import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Divider } from 'primereact/divider';

export default function AdvancedReservationCalendar({ 
  court, 
  selectedDate, 
  onDateSelect, 
  selectedCourt, 
  onCourtSelect,
  existingReservations = []
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthReservations, setMonthReservations] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);

  // Generar datos de reservas para el mes actual
  useEffect(() => {
    const reservations = {};
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Simular reservas para el mes actual
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) {
        const dateStr = date.toISOString().split('T')[0];
        const dayReservations = existingReservations.filter(res => res.date === dateStr);
        
        if (dayReservations.length > 0) {
          reservations[day] = {
            total: dayReservations.length,
            courts: dayReservations.reduce((acc, res) => {
              if (!acc[res.courtId]) acc[res.courtId] = [];
              acc[res.courtId].push(res);
              return acc;
            }, {}),
            times: dayReservations.map(res => res.time)
          };
        }
      }
    }
    
    setMonthReservations(reservations);
  }, [currentMonth, existingReservations]);

  const formatCurrency = (value) => {
    return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
  };

  const getDateAvailability = (date) => {
    const day = date.getDate();
    const reservations = monthReservations[day];
    
    if (!reservations) return { status: 'available', count: 0 };
    
    const totalSlots = 17; // 6 AM to 10 PM
    const occupiedSlots = reservations.total;
    const availableSlots = totalSlots - occupiedSlots;
    
    if (availableSlots === 0) return { status: 'full', count: 0 };
    if (availableSlots <= 3) return { status: 'limited', count: availableSlots };
    return { status: 'available', count: availableSlots };
  };

  const getDateStatusColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'limited': return '#f59e0b';
      case 'full': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDateStatusText = (status, count) => {
    switch (status) {
      case 'available': return `${count} horarios disponibles`;
      case 'limited': return `Solo ${count} horarios`;
      case 'full': return 'Sin disponibilidad';
      default: return 'Sin información';
    }
  };

  const customDateTemplate = (date) => {
    const day = date.getDate();
    const availability = getDateAvailability(date);
    const isSelected = selectedDate && selectedDate.getDate() === day && 
                      selectedDate.getMonth() === date.getMonth() && 
                      selectedDate.getFullYear() === date.getFullYear();
    const isToday = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date().setHours(0, 0, 0, 0);
    
    return (
      <div 
        className={`date-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: isPast ? 'not-allowed' : 'pointer',
          backgroundColor: isSelected ? '#22c55e' : 
                          isToday ? '#f0fdf4' : 
                          availability.status === 'available' ? '#f0fdf4' :
                          availability.status === 'limited' ? '#fef3c7' : '#fee2e2',
          color: isSelected ? 'white' : 
                 isPast ? '#9ca3af' :
                 availability.status === 'full' ? '#dc2626' : '#374151',
          border: isSelected ? '2px solid #22c55e' : 
                  isToday ? '2px solid #22c55e' : '1px solid transparent',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={() => !isPast && setHoveredDate(date)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <span className="date-number" style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {day}
        </span>
        
        {availability.count > 0 && !isPast && (
          <div 
            className="availability-indicator"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: getDateStatusColor(availability.status),
              marginTop: '2px'
            }}
          />
        )}
        
        {isPast && (
          <div 
            className="past-indicator"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#9ca3af',
              marginTop: '2px'
            }}
          />
        )}
      </div>
    );
  };

  const handleMonthChange = (event) => {
    setCurrentMonth(event.value);
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('es-CO', { weekday: 'long' });
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    
    const availability = getDateAvailability(selectedDate);
    const reservations = monthReservations[selectedDate.getDate()];
    
    return {
      date: selectedDate,
      dayName: getDayName(selectedDate),
      availability,
      reservations: reservations || { total: 0, courts: {}, times: [] }
    };
  };

  const selectedDateInfo = getSelectedDateInfo();

  return (
    <div className="advanced-calendar-container">
      {/* Header del Calendario */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center mb-3">
          <h3 className="text-2xl font-bold text-gray-800 m-0">
            Calendario de Disponibilidad
          </h3>
          <div className="flex align-items-center gap-2">
            <Button
              icon="pi pi-chevron-left"
              className="p-button-text p-button-sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            />
            <span className="text-lg font-semibold text-gray-700">
              {getMonthName(currentMonth)}
            </span>
            <Button
              icon="pi pi-chevron-right"
              className="p-button-text p-button-sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            />
          </div>
        </div>

        {/* Leyenda de Estados */}
        <div className="flex flex-wrap gap-3 mb-3">
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
      </Card>

      <div className="grid">
        {/* Calendario Principal */}
        <div className="col-12 lg:col-8">
          <Card>
            <Calendar
              value={selectedDate}
              onChange={(e) => onDateSelect(e.value)}
              onMonthChange={handleMonthChange}
              inline
              showWeek
              minDate={new Date()}
              maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)} // 60 días
              dateTemplate={customDateTemplate}
              className="advanced-calendar"
              style={{ width: '100%' }}
            />
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
                    {selectedDateInfo.date.getDate()} de {getMonthName(selectedDateInfo.date)}
                  </h5>
                  <p className="text-gray-600 mb-2">{selectedDateInfo.dayName}</p>
                  
                  <div className="flex align-items-center gap-2 mb-2">
                    <Tag 
                      value={getDateStatusText(selectedDateInfo.availability.status, selectedDateInfo.availability.count)}
                      severity={
                        selectedDateInfo.availability.status === 'available' ? 'success' :
                        selectedDateInfo.availability.status === 'limited' ? 'warning' : 'danger'
                      }
                    />
                  </div>
                </div>

                <Divider />

                {/* Información de Reservas del Día */}
                {selectedDateInfo.reservations.total > 0 && (
                  <div className="mt-3">
                    <h6 className="font-semibold text-gray-700 mb-2">Reservas del Día</h6>
                    <div className="space-y-2">
                      {Object.entries(selectedDateInfo.reservations.courts).map(([courtId, reservations]) => {
                        const courtInfo = court?.courts?.find(c => c.id === courtId);
                        return (
                          <div key={courtId} className="p-2 bg-gray-50 border-round">
                            <div className="font-medium text-sm text-gray-800">
                              {courtInfo?.name || `Cancha ${courtId}`}
                            </div>
                            <div className="text-xs text-gray-600">
                              {reservations.map(res => res.time).join(', ')}
                            </div>
                          </div>
                        );
                      })}
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
                      onClick={() => {
                        // Lógica para continuar con la selección de cancha
                        console.log('Continuar con fecha:', selectedDateInfo.date);
                      }}
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
                    {Object.values(monthReservations).reduce((sum, day) => sum + (day.total || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Reservas</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(monthReservations).length}
                  </div>
                  <div className="text-sm text-gray-600">Días Ocupados</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tooltip para fechas */}
      <Tooltip target=".date-cell" content="Click para seleccionar esta fecha" />
    </div>
  );
}
