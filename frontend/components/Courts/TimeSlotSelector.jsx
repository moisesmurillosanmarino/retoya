import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';

export default function TimeSlotSelector({ 
  selectedDate, 
  selectedCourt, 
  selectedTimeSlot, 
  onTimeSlotSelect,
  existingReservations = [],
  onReservationComplete
}) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [duration, setDuration] = useState(1); // horas
  const [totalPrice, setTotalPrice] = useState(0);

  // Horarios disponibles (6 AM a 10 PM)
  const allTimeSlots = [
    { label: '06:00 AM', value: '06:00', hour: 6, period: 'morning' },
    { label: '07:00 AM', value: '07:00', hour: 7, period: 'morning' },
    { label: '08:00 AM', value: '08:00', hour: 8, period: 'morning' },
    { label: '09:00 AM', value: '09:00', hour: 9, period: 'morning' },
    { label: '10:00 AM', value: '10:00', hour: 10, period: 'morning' },
    { label: '11:00 AM', value: '11:00', hour: 11, period: 'morning' },
    { label: '12:00 PM', value: '12:00', hour: 12, period: 'afternoon' },
    { label: '01:00 PM', value: '13:00', hour: 13, period: 'afternoon' },
    { label: '02:00 PM', value: '14:00', hour: 14, period: 'afternoon' },
    { label: '03:00 PM', value: '15:00', hour: 15, period: 'afternoon' },
    { label: '04:00 PM', value: '16:00', hour: 16, period: 'afternoon' },
    { label: '05:00 PM', value: '17:00', hour: 17, period: 'evening' },
    { label: '06:00 PM', value: '18:00', hour: 18, period: 'evening' },
    { label: '07:00 PM', value: '19:00', hour: 19, period: 'evening' },
    { label: '08:00 PM', value: '20:00', hour: 20, period: 'evening' },
    { label: '09:00 PM', value: '21:00', hour: 21, period: 'evening' },
    { label: '10:00 PM', value: '22:00', hour: 22, period: 'evening' }
  ];

  // Actualizar slots disponibles cuando cambia la fecha o cancha
  useEffect(() => {
    if (selectedDate && selectedCourt) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const reservedTimes = existingReservations
        .filter(res => res.courtId === selectedCourt.id && res.date === dateStr)
        .map(res => res.time);
      
      const availableSlots = allTimeSlots.map(slot => ({
        ...slot,
        disabled: reservedTimes.includes(slot.value),
        reserved: reservedTimes.includes(slot.value)
      }));
      
      setTimeSlots(availableSlots);
    }
  }, [selectedDate, selectedCourt, existingReservations]);

  // Calcular precio total
  useEffect(() => {
    if (selectedCourt && selectedSlots.length > 0) {
      const price = selectedCourt.price * selectedSlots.length;
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedCourt, selectedSlots]);

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

  const getPeriodColor = (period) => {
    switch (period) {
      case 'morning': return '#f59e0b';
      case 'afternoon': return '#3b82f6';
      case 'evening': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case 'morning': return 'Mañana';
      case 'afternoon': return 'Tarde';
      case 'evening': return 'Noche';
      default: return 'Otro';
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.disabled) return;

    if (selectedSlots.some(s => s.value === slot.value)) {
      // Deseleccionar slot
      setSelectedSlots(selectedSlots.filter(s => s.value !== slot.value));
    } else {
      // Seleccionar slot
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    // Limpiar selección si cambia la duración
    setSelectedSlots([]);
  };

  const handleReserve = () => {
    if (selectedSlots.length === 0) {
      return;
    }

    const reservationData = {
      court: selectedCourt,
      date: selectedDate,
      timeSlots: selectedSlots,
      duration: selectedSlots.length,
      totalPrice
    };

    if (onReservationComplete) {
      onReservationComplete(reservationData);
    }
  };

  const groupSlotsByPeriod = () => {
    const grouped = {
      morning: [],
      afternoon: [],
      evening: []
    };

    timeSlots.forEach(slot => {
      grouped[slot.period].push(slot);
    });

    return grouped;
  };

  const groupedSlots = groupSlotsByPeriod();

  if (!selectedDate || !selectedCourt) {
    return (
      <Card>
        <div className="text-center text-gray-500 p-4">
          <i className="pi pi-clock text-4xl mb-3"></i>
          <p>Selecciona una fecha y cancha para ver los horarios disponibles</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="time-slot-selector">
      {/* Header */}
      <Card className="mb-4">
        <div className="flex justify-content-between align-items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Seleccionar Horario</h3>
            <p className="text-gray-600 mb-0">
              {selectedCourt.name} - {formatDate(selectedDate)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-green-600">
              {formatCurrency(selectedCourt.price)}/hora
            </div>
            <small className="text-gray-500">Precio por hora</small>
          </div>
        </div>
      </Card>

      {/* Selector de Duración */}
      <Card className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Duración de la Reserva</h4>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(hours => (
            <Button
              key={hours}
              label={`${hours} hora${hours > 1 ? 's' : ''}`}
              className={`p-button-outlined ${duration === hours ? 'p-button-success' : ''}`}
              onClick={() => handleDurationChange(hours)}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Selecciona cuántas horas quieres reservar consecutivas
        </p>
      </Card>

      {/* Horarios por Período */}
      <div className="grid">
        {Object.entries(groupedSlots).map(([period, slots]) => (
          <div key={period} className="col-12 md:col-4">
            <Panel 
              header={
                <div className="flex align-items-center gap-2">
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: getPeriodColor(period) 
                    }}
                  ></div>
                  <span className="font-semibold">{getPeriodLabel(period)}</span>
                  <Badge value={slots.filter(s => !s.disabled).length} severity="info" />
                </div>
              }
              className="mb-3"
            >
              <div className="grid">
                {slots.map((slot, index) => {
                  const isSelected = selectedSlots.some(s => s.value === slot.value);
                  const isDisabled = slot.disabled;
                  
                  return (
                    <div key={index} className="col-12 sm:col-6">
                      <Button
                        label={slot.label}
                        className={`w-full mb-2 ${
                          isDisabled ? 'p-button-secondary' : 
                          isSelected ? 'p-button-success' : 'p-button-outlined'
                        }`}
                        disabled={isDisabled}
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          opacity: isDisabled ? 0.5 : 1,
                          cursor: isDisabled ? 'not-allowed' : 'pointer'
                        }}
                      />
                      {isDisabled && (
                        <div className="text-xs text-red-500 text-center">
                          Ocupado
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        ))}
      </div>

      {/* Resumen de Selección */}
      {selectedSlots.length > 0 && (
        <Card className="mt-4 bg-green-50 border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-3">Resumen de Selección</h4>
          
          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="mb-2">
                <strong>Cancha:</strong> {selectedCourt.name}
              </div>
              <div className="mb-2">
                <strong>Fecha:</strong> {formatDate(selectedDate)}
              </div>
              <div className="mb-2">
                <strong>Horarios:</strong> 
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSlots.map(slot => (
                    <Tag key={slot.value} value={slot.label} severity="success" />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="mb-2">
                <strong>Duración:</strong> {selectedSlots.length} hora{selectedSlots.length > 1 ? 's' : ''}
              </div>
              <div className="mb-2">
                <strong>Precio por hora:</strong> {formatCurrency(selectedCourt.price)}
              </div>
              <div className="mb-2">
                <strong>Total:</strong> 
                <span className="text-xl font-bold text-green-600 ml-2">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex justify-content-between align-items-center">
            <div className="text-sm text-gray-600">
              {selectedSlots.length} de {duration} hora{selectedSlots.length > 1 ? 's' : ''} seleccionada{selectedSlots.length > 1 ? 's' : ''}
            </div>
            <Button
              label="Confirmar Reserva"
              icon="pi pi-check"
              className="p-button-success p-button-lg"
              onClick={handleReserve}
              disabled={selectedSlots.length !== duration}
            />
          </div>
        </Card>
      )}

      {/* Información Adicional */}
      <Card className="mt-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Información Importante</h4>
        <div className="grid">
          <div className="col-12 md:col-6">
            <div className="flex align-items-start gap-2 mb-2">
              <i className="pi pi-info-circle text-blue-500 mt-1"></i>
              <div>
                <strong>Política de Cancelación:</strong>
                <p className="text-sm text-gray-600 mb-0">
                  Puedes cancelar hasta 24 horas antes sin costo
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <div className="flex align-items-start gap-2 mb-2">
              <i className="pi pi-clock text-orange-500 mt-1"></i>
              <div>
                <strong>Horarios:</strong>
                <p className="text-sm text-gray-600 mb-0">
                  Llegada 15 minutos antes del horario reservado
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
