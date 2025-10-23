import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { useRef } from 'react';
import CourtCalendarModal from '../../components/Courts/CourtCalendarModal.jsx';

export default function CourtsView() {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('distance');
  const [sortOrder, setSortOrder] = useState(1);
  const toast = useRef(null);

  // Datos de departamentos y ciudades del Valle del Cauca
  const departments = [
    { label: 'Valle del Cauca', value: 'valle-del-cauca', code: 'VAL' }
  ];

  const cities = [
    { label: 'Cali', value: 'cali', department: 'valle-del-cauca' },
    { label: 'Palmira', value: 'palmira', department: 'valle-del-cauca' }
  ];

  // Datos mock de canchas (12 canchas distribuidas entre Cali y Palmira)
  const courtsData = [
    // Cali - 7 canchas
    {
      id: 1,
      name: 'Cancha El Campín',
      business: 'Complejo Deportivo El Campín',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Carrera 5 # 28-00, Cali',
      coordinates: { lat: 3.4516, lng: -76.5320 },
      price: 80000,
      type: 'Fútbol 7',
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200/22c55e/ffffff?text=El+Campín',
      facilities: ['Vestidores', 'Estacionamiento', 'Iluminación'],
      courts: [
        { id: 'c1-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 80000 },
        { id: 'c1-2', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 60000 }
      ],
      distance: 2.5
    },
    {
      id: 2,
      name: 'Cancha La Merced',
      business: 'Club Deportivo La Merced',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Calle 10 # 15-30, Cali',
      coordinates: { lat: 3.4408, lng: -76.5180 },
      price: 75000,
      type: 'Fútbol 5',
      rating: 4.2,
      image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=La+Merced',
      facilities: ['Vestidores', 'Cafetería'],
      courts: [
        { id: 'c2-1', name: 'Cancha Central', type: 'Fútbol 5', price: 75000 },
        { id: 'c2-2', name: 'Cancha Norte', type: 'Fútbol 5', price: 70000 },
        { id: 'c2-3', name: 'Cancha Sur', type: 'Fútbol 7', price: 90000 }
      ],
      distance: 3.1
    },
    {
      id: 3,
      name: 'Cancha San Fernando',
      business: 'Complejo San Fernando',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Avenida 4N # 4-50, Cali',
      coordinates: { lat: 3.4600, lng: -76.5400 },
      price: 90000,
      type: 'Fútbol 7',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=San+Fernando',
      facilities: ['Vestidores', 'Estacionamiento', 'Tienda deportiva'],
      courts: [
        { id: 'c3-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 90000 },
        { id: 'c3-2', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 70000 }
      ],
      distance: 1.8
    },
    {
      id: 4,
      name: 'Cancha El Prado',
      business: 'Club El Prado',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Calle 52 # 2N-00, Cali',
      coordinates: { lat: 3.4700, lng: -76.5200 },
      price: 65000,
      type: 'Fútbol 5',
      rating: 4.0,
      image: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=El+Prado',
      facilities: ['Cafetería', 'Parqueadero'],
      courts: [
        { id: 'c4-1', name: 'Cancha A', type: 'Fútbol 5', price: 65000 },
        { id: 'c4-2', name: 'Cancha B', type: 'Fútbol 5', price: 65000 }
      ],
      distance: 4.0
    },
    {
      id: 5,
      name: 'Cancha Los Cristales',
      business: 'Complejo Los Cristales',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Carrera 100 # 16-00, Cali',
      coordinates: { lat: 3.3900, lng: -76.5400 },
      price: 95000,
      type: 'Fútbol 7',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Los+Cristales',
      facilities: ['Vestidores VIP', 'Restaurante', 'Estacionamiento'],
      courts: [
        { id: 'c5-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 95000 },
        { id: 'c5-2', name: 'Cancha VIP', type: 'Fútbol 7', price: 110000 },
        { id: 'c5-3', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 75000 }
      ],
      distance: 5.2
    },
    {
      id: 6,
      name: 'Cancha El Refugio',
      business: 'Club El Refugio',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Calle 13 # 66-00, Cali',
      coordinates: { lat: 3.3800, lng: -76.5300 },
      price: 70000,
      type: 'Fútbol 5',
      rating: 4.1,
      image: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=El+Refugio',
      facilities: ['Vestidores', 'Parqueadero'],
      courts: [
        { id: 'c6-1', name: 'Cancha Única', type: 'Fútbol 5', price: 70000 }
      ],
      distance: 6.0
    },
    {
      id: 7,
      name: 'Cancha La Flora',
      business: 'Complejo La Flora',
      city: 'cali',
      department: 'valle-del-cauca',
      address: 'Avenida 3N # 47-00, Cali',
      coordinates: { lat: 3.4800, lng: -76.5250 },
      price: 85000,
      type: 'Fútbol 7',
      rating: 4.3,
      image: 'https://via.placeholder.com/300x200/14b8a6/ffffff?text=La+Flora',
      facilities: ['Vestidores', 'Cafetería', 'Zona de espera'],
      courts: [
        { id: 'c7-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 85000 },
        { id: 'c7-2', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 68000 }
      ],
      distance: 3.8
    },
    // Palmira - 5 canchas
    {
      id: 8,
      name: 'Cancha El Estadio',
      business: 'Complejo El Estadio',
      city: 'palmira',
      department: 'valle-del-cauca',
      address: 'Calle 30 # 28-00, Palmira',
      coordinates: { lat: 3.5300, lng: -76.2900 },
      price: 70000,
      type: 'Fútbol 7',
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=El+Estadio',
      facilities: ['Vestidores', 'Estacionamiento'],
      courts: [
        { id: 'c8-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 70000 },
        { id: 'c8-2', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 55000 }
      ],
      distance: 25.0
    },
    {
      id: 9,
      name: 'Cancha La Victoria',
      business: 'Club La Victoria',
      city: 'palmira',
      department: 'valle-del-cauca',
      address: 'Carrera 19 # 10-00, Palmira',
      coordinates: { lat: 3.5400, lng: -76.3000 },
      price: 60000,
      type: 'Fútbol 5',
      rating: 3.9,
      image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=La+Victoria',
      facilities: ['Cafetería'],
      courts: [
        { id: 'c9-1', name: 'Cancha Norte', type: 'Fútbol 5', price: 60000 },
        { id: 'c9-2', name: 'Cancha Sur', type: 'Fútbol 5', price: 60000 }
      ],
      distance: 26.5
    },
    {
      id: 10,
      name: 'Cancha El Paraíso',
      business: 'Complejo El Paraíso',
      city: 'palmira',
      department: 'valle-del-cauca',
      address: 'Calle 42 # 35-00, Palmira',
      coordinates: { lat: 3.5200, lng: -76.2800 },
      price: 80000,
      type: 'Fútbol 7',
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=El+Paraíso',
      facilities: ['Vestidores', 'Estacionamiento', 'Zona BBQ'],
      courts: [
        { id: 'c10-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 80000 },
        { id: 'c10-2', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 65000 }
      ],
      distance: 24.0
    },
    {
      id: 11,
      name: 'Cancha San Antonio',
      business: 'Club San Antonio',
      city: 'palmira',
      department: 'valle-del-cauca',
      address: 'Carrera 25 # 12-00, Palmira',
      coordinates: { lat: 3.5500, lng: -76.3100 },
      price: 68000,
      type: 'Fútbol 5',
      rating: 4.0,
      image: 'https://via.placeholder.com/300x200/f97316/ffffff?text=San+Antonio',
      facilities: ['Cafetería'],
      courts: [
        { id: 'c11-1', name: 'Cancha Única', type: 'Fútbol 5', price: 68000 }
      ],
      distance: 27.8
    },
    {
      id: 12,
      name: 'Cancha El Mirador',
      business: 'Complejo El Mirador',
      city: 'palmira',
      department: 'valle-del-cauca',
      address: 'Vía a Rozo Km 3, Palmira',
      coordinates: { lat: 3.5600, lng: -76.2700 },
      price: 90000,
      type: 'Fútbol 7',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x200/a855f7/ffffff?text=El+Mirador',
      facilities: ['Vestidores', 'Estacionamiento', 'Mirador panorámico'],
      courts: [
        { id: 'c12-1', name: 'Cancha Principal', type: 'Fútbol 7', price: 90000 },
        { id: 'c12-2', name: 'Cancha VIP', type: 'Fútbol 7', price: 105000 },
        { id: 'c12-3', name: 'Cancha Auxiliar', type: 'Fútbol 5', price: 70000 }
      ],
      distance: 28.2
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simular obtención de ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSelectedCity('cali');
          setSelectedDepartment('valle-del-cauca');
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.current.show({ severity: 'warn', summary: 'Ubicación no disponible', detail: 'No se pudo obtener tu ubicación. Mostrando canchas en Cali por defecto.', life: 5000 });
          setUserLocation({ lat: 3.4516, lng: -76.5320 });
          setSelectedCity('cali');
          setSelectedDepartment('valle-del-cauca');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.current.show({ severity: 'warn', summary: 'Geolocalización no soportada', detail: 'Tu navegador no soporta geolocalización. Mostrando canchas en Cali por defecto.', life: 5000 });
      setUserLocation({ lat: 3.4516, lng: -76.5320 });
      setSelectedCity('cali');
      setSelectedDepartment('valle-del-cauca');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let tempCourts = courtsData;

    if (selectedDepartment) {
      tempCourts = tempCourts.filter(court => court.department === selectedDepartment);
    }

    if (selectedCity) {
      tempCourts = tempCourts.filter(court => court.city === selectedCity);
    }

    if (searchTerm) {
      tempCourts = tempCourts.filter(court =>
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Calculate distance if user location is available
    if (userLocation) {
      tempCourts = tempCourts.map(court => {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, court.coordinates.lat, court.coordinates.lng);
        return { ...court, distance: dist };
      }).sort((a, b) => a.distance - b.distance);
    }

    setFilteredCourts(tempCourts);
  }, [selectedDepartment, selectedCity, searchTerm, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const priceTemplate = (rowData) => {
    return (
      <span className="court-price font-semibold text-green-600">
        {rowData.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}/hr
      </span>
    );
  };

  const ratingTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={`pi ${i < Math.floor(rowData.rating) ? 'pi-star-fill' : 'pi-star'}`}
            style={{ color: '#f59e0b' }}
          ></i>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rowData.rating})</span>
      </div>
    );
  };

  const facilitiesTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">
        {rowData.facilities.slice(0, 2).map((facility, index) => (
          <Tag key={index} value={facility} className="p-tag-rounded p-tag-info" />
        ))}
        {rowData.facilities.length > 2 && (
          <Tag value={`+${rowData.facilities.length - 2}`} className="p-tag-rounded p-tag-secondary" />
        )}
      </div>
    );
  };

  const distanceTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-1">
        <i className="pi pi-map-marker text-green-500"></i>
        <span className="court-distance font-semibold">
          {rowData.distance ? `${rowData.distance} km` : 'N/A'}
        </span>
      </div>
    );
  };

  const handleCourtClick = (court) => {
    setSelectedCourt(court);
    setShowCalendarModal(true);
  };

  const handleDateSelect = (date, availability) => {
    toast.current.show({
      severity: 'info',
      summary: 'Fecha Seleccionada',
      detail: `Has seleccionado ${date.toLocaleDateString('es-CO')} con ${availability.count} horarios disponibles`,
      life: 3000
    });
    setShowCalendarModal(false);
  };

  const courtImageTemplate = (rowData) => {
    return (
      <img 
        src={rowData.image} 
        alt={rowData.name}
        className="border-round shadow-2"
        style={{ 
          width: '80px', 
          height: '60px', 
          objectFit: 'cover',
          cursor: 'pointer'
        }}
        onClick={() => handleCourtClick(rowData)}
      />
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <Button
        label="Reservar"
        icon="pi pi-calendar"
        className="p-button-success p-button-sm"
        onClick={() => handleCourtClick(rowData)}
      />
    );
  };

  const clearFilters = () => {
    setSelectedDepartment(null);
    setSelectedCity(null);
    setSearchTerm('');
  };

  const getCityOptions = () => {
    if (!selectedDepartment) {
      return cities;
    }
    return cities.filter(city => city.department === selectedDepartment);
  };

  const sortOptions = [
    { label: 'Distancia (más cercano)', value: 'distance' },
    { label: 'Precio (más barato)', value: 'price' },
    { label: 'Rating (más alto)', value: 'rating' },
    { label: 'Nombre (A-Z)', value: 'name' }
  ];

  const handleSort = (option) => {
    setSortField(option.value);
    const sortedCourts = [...filteredCourts].sort((a, b) => {
      if (option.value === 'distance') return a.distance - b.distance;
      if (option.value === 'price') return a.price - b.price;
      if (option.value === 'rating') return b.rating - a.rating;
      if (option.value === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    setFilteredCourts(sortedCourts);
  };

  return (
    <div className="courts-container">
      <Toast ref={toast} />

      {/* Header Principal */}
      <div className="courts-header mb-4">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Encuentra tu Cancha Ideal</h1>
          <p className="text-lg text-gray-600">Reserva canchas de fútbol en Cali y Palmira</p>
        </div>
      </div>

      {/* Panel de Filtros Mejorado */}
      <Card className="mb-4 shadow-2">
        <div className="grid">
          {/* Ubicación del Usuario */}
          <div className="col-12 md:col-3">
            <div className="flex align-items-center mb-3">
              <i className="pi pi-map-marker mr-2 text-green-500 text-xl"></i>
              <h3 className="font-semibold text-lg text-gray-700 m-0">Tu Ubicación</h3>
            </div>
            <div className="p-3 bg-green-50 border-round">
              <p className="text-sm text-gray-600 mb-1">
                {userLocation ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}` : 'Obteniendo ubicación...'}
              </p>
              <small className="text-gray-500">Las canchas se ordenan por distancia</small>
            </div>
          </div>

          {/* Filtro por Ciudad */}
          <div className="col-12 md:col-3">
            <div className="flex align-items-center mb-3">
              <i className="pi pi-globe mr-2 text-blue-500 text-xl"></i>
              <h3 className="font-semibold text-lg text-gray-700 m-0">Ciudad</h3>
            </div>
            <Dropdown
              value={selectedCity}
              options={getCityOptions()}
              onChange={(e) => setSelectedCity(e.value)}
              placeholder="Selecciona una ciudad"
              className="w-full"
              disabled={!selectedDepartment}
            />
          </div>

          {/* Búsqueda */}
          <div className="col-12 md:col-4">
            <div className="flex align-items-center mb-3">
              <i className="pi pi-search mr-2 text-orange-500 text-xl"></i>
              <h3 className="font-semibold text-lg text-gray-700 m-0">Buscar Cancha</h3>
            </div>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, negocio o dirección"
                className="w-full"
              />
            </span>
          </div>

          {/* Ordenar */}
          <div className="col-12 md:col-2">
            <div className="flex align-items-center mb-3">
              <i className="pi pi-sort mr-2 text-purple-500 text-xl"></i>
              <h3 className="font-semibold text-lg text-gray-700 m-0">Ordenar</h3>
            </div>
            <Dropdown
              value={sortField}
              options={sortOptions}
              onChange={(e) => handleSort(e.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <Divider />
        <div className="flex justify-content-between align-items-center">
          <div className="flex align-items-center gap-2">
            <Button
              label="Limpiar Filtros"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={clearFilters}
            />
            <Button
              label="Actualizar Ubicación"
              icon="pi pi-refresh"
              className="p-button-text p-button-sm"
              onClick={() => window.location.reload()}
            />
          </div>
          <div className="flex align-items-center gap-2">
            <Badge value={filteredCourts.length} severity="info" />
            <span className="text-sm text-gray-600">canchas encontradas</span>
          </div>
        </div>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid mb-4">
        <div className="col-12 md:col-3">
          <Card className="stats-card text-center">
            <div className="stats-number text-green-600">{filteredCourts.length}</div>
            <div className="stats-label">Canchas Encontradas</div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="stats-card text-center">
            <div className="stats-number text-blue-600">{courtsData.filter(c => c.city === 'cali').length}</div>
            <div className="stats-label">Canchas en Cali</div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="stats-card text-center">
            <div className="stats-number text-purple-600">{courtsData.filter(c => c.city === 'palmira').length}</div>
            <div className="stats-label">Canchas en Palmira</div>
          </Card>
        </div>
        <div className="col-12 md:col-3">
          <Card className="stats-card text-center">
            <div className="stats-number text-orange-600">
              {filteredCourts.length > 0 ? Math.round(filteredCourts.reduce((sum, court) => sum + court.price, 0) / filteredCourts.length).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '$0'}
            </div>
            <div className="stats-label">Precio Promedio</div>
          </Card>
        </div>
      </div>

      {/* Tabla de Canchas Mejorada */}
      <Card title="Canchas Disponibles" className="shadow-2">
        <DataTable
          value={filteredCourts}
          paginator
          rows={8}
          rowsPerPageOptions={[4, 8, 12, 20]}
          dataKey="id"
          className="p-datatable-gridlines"
          emptyMessage="No se encontraron canchas con los filtros aplicados."
          responsiveLayout="scroll"
          loading={loading}
        >
          <Column header="Imagen" body={courtImageTemplate} style={{ width: '100px' }}></Column>
          <Column field="name" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" style={{ minWidth: '150px' }}></Column>
          <Column field="business" header="Negocio" sortable style={{ minWidth: '150px' }}></Column>
          <Column field="address" header="Dirección" style={{ minWidth: '200px' }}></Column>
          <Column header="Tipo" field="type" sortable style={{ width: '100px' }}></Column>
          <Column header="Precio" body={priceTemplate} sortable style={{ width: '120px' }}></Column>
          <Column header="Rating" body={ratingTemplate} sortable style={{ width: '120px' }}></Column>
          <Column header="Facilidades" body={facilitiesTemplate} style={{ width: '150px' }}></Column>
          <Column header="Distancia" body={distanceTemplate} sortable style={{ width: '120px' }}></Column>
          <Column header="Acciones" body={actionTemplate} style={{ width: '120px' }}></Column>
        </DataTable>
      </Card>

      {/* Modal de Calendario */}
      <CourtCalendarModal
        visible={showCalendarModal}
        onHide={() => setShowCalendarModal(false)}
        court={selectedCourt}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}