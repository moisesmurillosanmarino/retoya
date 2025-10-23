import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Menubar } from 'primereact/menubar';
import { apiService } from '../services/api.js';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courts, setCourts] = useState([]);
  const [courtsLoading, setCourtsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      setCourtsLoading(true);
      const data = await apiService.getCourts();
      setCourts(data);
    } catch (err) {
      console.error('Error loading courts:', err);
    } finally {
      setCourtsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
        console.log('Login successful:', response);
        setShowAuthModal(false);
      } else {
        await apiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        console.log('Registration successful');
        setShowAuthModal(false);
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '', phone: '' });
    setError('');
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

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => window.location.href = '/'
    },
    {
      label: 'Canchas',
      icon: 'pi pi-building',
      command: () => window.location.href = '/courts'
    },
    {
      label: 'Partidos',
      icon: 'pi pi-calendar',
      command: () => window.location.href = '/matches'
    },
    {
      label: 'Equipos',
      icon: 'pi pi-users',
      command: () => window.location.href = '/teams'
    }
  ];

  const start = (
    <div className="flex align-items-center">
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '50%', 
        border: '3px solid #22c55e', 
        marginRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0fdf4'
      }}>
        <i className="pi pi-bolt" style={{ fontSize: '20px', color: '#22c55e' }}></i>
      </div>
      <span className="text-xl font-bold" style={{ color: '#22c55e' }}>RetoYa</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <Button
        label="Iniciar Sesión"
        outlined
        size="small"
        onClick={() => setShowAuthModal(true)}
      />
      <Button
        label="Registrarse"
        size="small"
        onClick={() => setShowAuthModal(true)}
      />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header con Menubar de PrimeReact */}
      <Menubar model={menuItems} start={start} end={end} className="mb-4" />
      
      {/* Hero Section */}
      <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>¡Encuentra tu Cancha Ideal!</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Reserva canchas de fútbol, organiza partidos y forma equipos</p>
        <div className="flex flex-column md:flex-row gap-3 justify-content-center">
          <Button
            label="Explorar Canchas"
            size="large"
            style={{ backgroundColor: 'white', color: '#22c55e' }}
            onClick={() => {
              document.getElementById('courts-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <Button
            label="Crear Partido"
            size="large"
            outlined
            style={{ borderColor: 'white', color: 'white' }}
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="p-6 bg-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">¿Por qué elegir RetoYa?</h2>
          <p className="text-lg text-gray-600">La plataforma más completa para amantes del fútbol</p>
        </div>
        
        <div className="grid">
          <div className="col-12 md:col-4">
            <Card className="text-center p-4">
              <i className="pi pi-building text-4xl mb-3" style={{ color: '#22c55e' }}></i>
              <h3 className="text-xl font-semibold mb-3">Canchas Premium</h3>
              <p className="text-gray-600">Accede a las mejores canchas de fútbol con instalaciones de primera calidad</p>
            </Card>
          </div>
          
          <div className="col-12 md:col-4">
            <Card className="text-center p-4">
              <i className="pi pi-calendar text-4xl mb-3" style={{ color: '#22c55e' }}></i>
              <h3 className="text-xl font-semibold mb-3">Reservas Fáciles</h3>
              <p className="text-gray-600">Reserva tu cancha favorita en pocos clics y gestiona tus horarios</p>
            </Card>
          </div>
          
          <div className="col-12 md:col-4">
            <Card className="text-center p-4">
              <i className="pi pi-users text-4xl mb-3" style={{ color: '#22c55e' }}></i>
              <h3 className="text-xl font-semibold mb-3">Forma Equipos</h3>
              <p className="text-gray-600">Conecta con otros jugadores y forma equipos para tus partidos</p>
            </Card>
          </div>
        </div>
      </div>

      <Divider />

      {/* Courts Section */}
      <div id="courts-section" className="p-6 bg-gray-50">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Nuestras Canchas</h2>
          <p className="text-gray-600">Descubre las mejores canchas de fútbol disponibles para ti</p>
        </div>

        {courtsLoading ? (
          <div className="grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="col-12 md:col-6 lg:col-4">
                <Card>
                  <Skeleton height="200px" className="mb-3" />
                  <Skeleton height="1.5rem" className="mb-2" />
                  <Skeleton height="1rem" className="mb-2" />
                  <Skeleton height="1rem" width="60%" />
                </Card>
              </div>
            ))}
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-6">
            <i className="pi pi-building text-6xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay canchas disponibles</h3>
            <p className="text-gray-500">Pronto tendremos más canchas disponibles para ti.</p>
          </div>
        ) : (
          <div className="grid">
            {courts.map((court) => (
              <div key={court.id} className="col-12 md:col-6 lg:col-4">
                <Card 
                  title={court.name}
                  subTitle={court.location}
                  className="h-full"
                >
                  <div className="mb-3">
                    <img 
                      src={court.image_url || 'https://via.placeholder.com/400x200?text=Cancha+' + encodeURIComponent(court.name)} 
                      alt={court.name}
                      className="w-full h-48 object-cover border-round"
                    />
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {court.description || 'Cancha de fútbol de alta calidad para disfrutar del deporte.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getCourtStatusTag(court.status)}
                    <Tag value={`${court.capacity} jugadores`} severity="secondary" />
                  </div>

                  <div className="flex align-items-center justify-content-between">
                    <div className="text-lg font-semibold text-blue-600">
                      ${court.price_per_hour?.toLocaleString() || 'N/A'} / hora
                    </div>
                    <Button 
                      label="Ver Detalles" 
                      size="small"
                      outlined
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <Button 
            label="Ver Todas las Canchas" 
            size="large"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: '#22c55e', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>¿Listo para empezar?</h2>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Únete a la comunidad de RetoYa y disfruta del fútbol como nunca antes</p>
        <Button
          label="Registrarse Ahora"
          size="large"
          style={{ backgroundColor: 'white', color: '#22c55e', borderColor: 'white' }}
          onClick={() => setShowAuthModal(true)}
        />
      </div>

      {/* Auth Modal */}
      <Dialog
        header={isLogin ? "Iniciar Sesión" : "Registrarse"}
        visible={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        style={{ width: '400px' }}
        modal
        className="p-fluid"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Message severity="error" text={error} className="w-full" />
          )}

          {!isLogin && (
            <div className="field">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre completo
              </label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Tu nombre completo"
                required={!isLogin}
                className="w-full"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full"
            />
          </div>

          {!isLogin && (
            <div className="field">
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Teléfono
              </label>
              <InputText
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
                className="w-full"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <Password
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Tu contraseña"
              required
              toggleMask
              className="w-full"
              inputClassName="w-full"
            />
          </div>

          <Button
            type="submit"
            label={isLogin ? "Iniciar Sesión" : "Registrarse"}
            loading={loading}
            className="w-full"
          />

          <Divider />

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </span>
            <Button
              type="button"
              label={isLogin ? "Registrarse" : "Iniciar Sesión"}
              link
              onClick={toggleMode}
              className="ml-2"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}

