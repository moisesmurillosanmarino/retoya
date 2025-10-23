import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import AdvancedReservationCalendar from './AdvancedReservationCalendar.jsx';
import TimeSlotSelector from './TimeSlotSelector.jsx';

export default function CourtReservationModal({ 
  visible, 
  onHide, 
  court, 
  onReservationSuccess 
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const toast = useRef(null);

  // Datos mock de reservas existentes (para simular disponibilidad)
  const existingReservations = [
    { courtId: 'c1-1', date: '2024-10-20', time: '18:00', team: 'Los Tigres' },
    { courtId: 'c1-1', date: '2024-10-20', time: '19:00', team: 'Los Tigres' },
    { courtId: 'c1-2', date: '2024-10-20', time: '20:00', team: 'Furia Roja' },
    { courtId: 'c2-1', date: '2024-10-21', time: '16:00', team: 'Los Campeones' },
    { courtId: 'c2-1', date: '2024-10-21', time: '17:00', team: 'Los Campeones' },
    { courtId: 'c3-1', date: '2024-10-22', time: '19:00', team: 'Estrellas FC' },
    { courtId: 'c4-1', date: '2024-10-23', time: '18:00', team: 'Galácticos' },
    { courtId: 'c5-1', date: '2024-10-24', time: '20:00', team: 'Los Invencibles' },
    { courtId: 'c6-1', date: '2024-10-25', time: '17:00', team: 'Titanes' },
    { courtId: 'c7-1', date: '2024-10-26', time: '19:00', team: 'Vengadores' }
  ];

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (visible && court) {
      setSelectedDate(null);
      setSelectedCourt(null);
      setSelectedTimeSlots([]);
      setTeamName('');
      setContactPhone('');
      setNotes('');
      setCurrentStep(1);
    }
  }, [visible, court]);

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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    setCurrentStep(3);
  };

  const handleTimeSlotsComplete = (reservationData) => {
    setSelectedTimeSlots(reservationData.timeSlots);
    setCurrentStep(4);
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedCourt || !selectedTimeSlots.length || !teamName || !contactPhone) {
      toast.current.show({
        severity: 'warn',
        summary: 'Campos Requeridos',
        detail: 'Por favor completa todos los campos obligatorios',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      // Simular reserva exitosa
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reservationData = {
        court: selectedCourt,
        date: selectedDate,
        timeSlots: selectedTimeSlots,
        teamName,
        contactPhone,
        notes,
        totalPrice: selectedCourt.price * selectedTimeSlots.length
      };

      toast.current.show({
        severity: 'success',
        summary: 'Reserva Exitosa',
        detail: `Reserva confirmada para ${selectedCourt.name} el ${formatDate(selectedDate)}`,
        life: 5000
      });

      if (onReservationSuccess) {
        onReservationSuccess(reservationData);
      }

    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo procesar la reserva. Intenta nuevamente.',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const courtTemplate = (rowData) => {
    const isSelected = selectedCourt && selectedCourt.id === rowData.id;
    
    return (
      <Card 
        className={`cursor-pointer transition-all transition-duration-200 ${
          isSelected ? 'border-green-500 bg-green-50' : 'hover:shadow-2'
        }`}
        onClick={() => handleCourtSelect(rowData)}
      >
        <div className="flex justify-content-between align-items-center">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-1">{rowData.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{rowData.type}</p>
            <div className="flex align-items-center gap-2">
              <span className="font-bold text-green-600">{formatCurrency(rowData.price)}</span>
              <span className="text-sm text-gray-500">por hora</span>
            </div>
          </div>
          <div className="text-right">
            {isSelected && (
              <i className="pi pi-check-circle text-green-500 text-xl"></i>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Seleccionar Fecha';
      case 2: return 'Seleccionar Cancha';
      case 3: return 'Seleccionar Horario';
      case 4: return 'Información del Equipo';
      default: return 'Reserva de Cancha';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Elige la fecha que mejor te convenga para tu partido';
      case 2: return 'Selecciona la cancha específica dentro del complejo';
      case 3: return 'Elige los horarios disponibles para tu reserva';
      case 4: return 'Completa la información de tu equipo';
      default: return '';
    }
  };

  if (!court) return null;

  return (
    <>
      <Toast ref={toast} />
      
      <Dialog
        header={`Reservar Cancha - ${court.name}`}
        visible={visible}
        onHide={onHide}
        style={{ width: '95vw', maxWidth: '1400px' }}
        maximizable
        className="p-dialog-lg"
      >
        {/* Información de la Cancha */}
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

        {/* Indicador de Progreso */}
        <Card className="mb-4">
          <div className="flex justify-content-between align-items-center">
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-1">{getStepTitle()}</h4>
              <p className="text-gray-600 mb-0">{getStepDescription()}</p>
            </div>
            <div className="flex align-items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`w-2rem h-2rem border-round flex align-items-center justify-content-center font-bold ${
                    step <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Contenido del Paso Actual */}
        {currentStep === 1 && (
          <AdvancedReservationCalendar
            court={court}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            selectedCourt={selectedCourt}
            onCourtSelect={handleCourtSelect}
            existingReservations={existingReservations}
          />
        )}

        {currentStep === 2 && (
          <Panel header="Seleccionar Cancha Específica" className="mb-4">
            <DataTable
              value={court.courts}
              dataKey="id"
              className="p-datatable-sm"
              emptyMessage="No hay canchas disponibles"
            >
              <Column body={courtTemplate}></Column>
            </DataTable>
            <div className="flex justify-content-end mt-3">
              <Button
                label="Continuar"
                icon="pi pi-arrow-right"
                className="p-button-success"
                onClick={() => setCurrentStep(3)}
                disabled={!selectedCourt}
              />
            </div>
          </Panel>
        )}

        {currentStep === 3 && (
          <TimeSlotSelector
            selectedDate={selectedDate}
            selectedCourt={selectedCourt}
            selectedTimeSlot={selectedTimeSlots}
            onTimeSlotSelect={setSelectedTimeSlots}
            existingReservations={existingReservations}
            onReservationComplete={handleTimeSlotsComplete}
          />
        )}

        {currentStep === 4 && (
          <div>
            <Panel header="Información del Equipo" className="mb-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Equipo *
                  </label>
                  <InputText
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Ej: Los Campeones"
                    className="w-full"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <InputText
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ej: 300 123 4567"
                    className="w-full"
                  />
                </div>
                <div className="col-12">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <InputText
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Información adicional sobre la reserva..."
                    className="w-full"
                  />
                </div>
              </div>
            </Panel>

            {/* Resumen Final */}
            <Card className="bg-green-50 border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-3">Resumen de Reserva</h4>
              <div className="grid">
                <div className="col-12 md:col-6">
                  <div className="mb-2">
                    <strong>Cancha:</strong> {selectedCourt?.name}
                  </div>
                  <div className="mb-2">
                    <strong>Fecha:</strong> {formatDate(selectedDate)}
                  </div>
                  <div className="mb-2">
                    <strong>Horarios:</strong> 
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTimeSlots.map(slot => (
                        <Tag key={slot.value} value={slot.label} severity="success" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <div className="mb-2">
                    <strong>Equipo:</strong> {teamName}
                  </div>
                  <div className="mb-2">
                    <strong>Contacto:</strong> {contactPhone}
                  </div>
                  <div className="mb-2">
                    <strong>Total:</strong> 
                    <span className="text-xl font-bold text-green-600 ml-2">
                      {formatCurrency(selectedCourt?.price * selectedTimeSlots.length || 0)}
                    </span>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="flex justify-content-between align-items-center">
                <Button
                  label="Atrás"
                  icon="pi pi-arrow-left"
                  className="p-button-outlined"
                  onClick={() => setCurrentStep(3)}
                />
                <Button
                  label="Confirmar Reserva"
                  icon="pi pi-check"
                  className="p-button-success p-button-lg"
                  onClick={handleReservation}
                  loading={loading}
                />
              </div>
            </Card>
          </div>
        )}
      </Dialog>
    </>
  );
}