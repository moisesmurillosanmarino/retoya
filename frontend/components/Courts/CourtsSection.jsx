import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { apiService } from '../../services/api.js';

export default function CourtsSection() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCourts();
      setCourts(data);
    } catch (err) {
      setError('Error al cargar las canchas');
      console.error('Error loading courts:', err);
    } finally {
      setLoading(false);
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
        return <Tag value="Desconocido" severity="info" />;
    }
  };

  const getCourtTypeTag = (type) => {
    switch (type) {
      case 'indoor':
        return <Tag value="Techada" severity="info" />;
      case 'outdoor':
        return <Tag value="Descubierta" severity="success" />;
      default:
        return <Tag value={type} severity="secondary" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton height="200px" className="mb-4" />
            <Skeleton height="1.5rem" className="mb-2" />
            <Skeleton height="1rem" className="mb-2" />
            <Skeleton height="1rem" width="60%" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Message severity="error" text={error} />
        <Button 
          label="Reintentar" 
          onClick={loadCourts}
          className="mt-4"
          severity="secondary"
        />
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="pi pi-building text-6xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No hay canchas disponibles
        </h3>
        <p className="text-gray-500">
          Pronto tendremos más canchas disponibles para ti.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Nuestras Canchas
        </h2>
        <p className="text-gray-600">
          Descubre las mejores canchas de fútbol disponibles para ti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <Card 
            key={court.id} 
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            header={
              <div className="relative">
                <img 
                  src={court.image_url || '/api/placeholder/400/200'} 
                  alt={court.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Cancha+' + encodeURIComponent(court.name);
                  }}
                />
                <div className="absolute top-2 right-2">
                  {getCourtStatusTag(court.status)}
                </div>
              </div>
            }
            title={court.name}
            subTitle={court.location}
          >
            <div className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-2">
                {court.description || 'Cancha de fútbol de alta calidad para disfrutar del deporte.'}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {getCourtTypeTag(court.type)}
                <Tag 
                  value={`${court.capacity} jugadores`} 
                  severity="secondary" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-primary">
                  ${court.price_per_hour?.toLocaleString() || 'N/A'} / hora
                </div>
                <Button 
                  label="Ver Detalles" 
                  size="small"
                  severity="info"
                  outlined
                  onClick={() => {
                    // Navigate to court details
                    window.location.href = `/courts/${court.id}`;
                  }}
                />
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <i className="pi pi-map-marker mr-1"></i>
                <span>{court.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button 
          label="Ver Todas las Canchas" 
          severity="info"
          size="large"
          onClick={() => {
            window.location.href = '/courts';
          }}
        />
      </div>
    </div>
  );
}
