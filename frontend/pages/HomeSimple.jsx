import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    setShowModal(false);
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header Simple */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
          <h1 style={{ margin: 0, color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>RetoYa</h1>
        </div>
        <div>
          <Button 
            label="Iniciar Sesión" 
            outlined 
            onClick={() => window.location.href = '/login'}
            style={{ marginRight: '10px' }}
          />
          <Button 
            label="Registrarse" 
            onClick={() => window.location.href = '/login'}
            style={{ marginRight: '10px' }}
          />
          <Button 
            label="Acceso Directo" 
            onClick={() => {
              // Simular login automático
              const mockUser = {
                id: 1,
                name: 'Usuario Demo',
                email: 'demo@retoya.com',
                avatar_url: null,
                role: 'user'
              };
              localStorage.setItem('authToken', 'mock-token-demo');
              localStorage.setItem('user', JSON.stringify(mockUser));
              window.location.href = '/dashboard';
            }}
            style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <Card style={{ marginBottom: '20px', textAlign: 'center', backgroundColor: '#22c55e', color: 'white' }}>
        <div style={{ padding: '40px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>¡Encuentra tu Cancha Ideal!</h1>
          <p style={{ fontSize: '20px', marginBottom: '30px' }}>Reserva canchas de fútbol, organiza partidos y forma equipos</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              label="Explorar Canchas" 
              size="large"
              style={{ backgroundColor: 'white', color: '#22c55e' }}
            />
            <Button 
              label="Crear Partido" 
              size="large"
              outlined
              style={{ borderColor: 'white', color: 'white' }}
            />
          </div>
        </div>
      </Card>

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <Card style={{ textAlign: 'center', padding: '30px' }}>
          <i className="pi pi-building" style={{ fontSize: '48px', color: '#22c55e', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Canchas Premium</h3>
          <p style={{ color: '#666' }}>Accede a las mejores canchas de fútbol con instalaciones de primera calidad</p>
        </Card>
        
        <Card style={{ textAlign: 'center', padding: '30px' }}>
          <i className="pi pi-calendar" style={{ fontSize: '48px', color: '#22c55e', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Reservas Fáciles</h3>
          <p style={{ color: '#666' }}>Reserva tu cancha favorita en pocos clics y gestiona tus horarios</p>
        </Card>
        
        <Card style={{ textAlign: 'center', padding: '30px' }}>
          <i className="pi pi-users" style={{ fontSize: '48px', color: '#22c55e', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Forma Equipos</h3>
          <p style={{ color: '#666' }}>Conecta con otros jugadores y forma equipos para tus partidos</p>
        </Card>
      </div>

      {/* Courts Section */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '15px' }}>Nuestras Canchas</h2>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            Descubre las mejores canchas de fútbol disponibles para ti
          </p>
          
          {/* Mock Courts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} style={{ textAlign: 'left' }}>
                <div style={{ height: '200px', backgroundColor: '#e5e7eb', borderRadius: '8px', marginBottom: '15px' }}></div>
                <h4 style={{ marginBottom: '10px' }}>Cancha {i}</h4>
                <p style={{ color: '#666', marginBottom: '15px' }}>Cancha de fútbol de alta calidad</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>$50,000 / hora</span>
                  <Button label="Ver Detalles" size="small" outlined />
                </div>
              </Card>
            ))}
          </div>
          
          <Button 
            label="Ver Todas las Canchas" 
            size="large"
            style={{ marginTop: '30px' }}
          />
        </div>
      </Card>

      {/* CTA Section */}
      <Card style={{ backgroundColor: '#22c55e', color: 'white', textAlign: 'center' }}>
        <div style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>¿Listo para empezar?</h2>
          <p style={{ fontSize: '20px', marginBottom: '30px' }}>
            Únete a la comunidad de RetoYa y disfruta del fútbol como nunca antes
          </p>
          <Button
            label="Registrarse Ahora"
            size="large"
            style={{ backgroundColor: 'white', color: '#22c55e', borderColor: 'white' }}
            onClick={() => {
              // Simular login automático
              const mockUser = {
                id: 1,
                name: 'Usuario Demo',
                email: 'demo@retoya.com',
                avatar_url: null,
                role: 'user'
              };
              localStorage.setItem('authToken', 'mock-token-demo');
              localStorage.setItem('user', JSON.stringify(mockUser));
              window.location.href = '/dashboard';
            }}
          />
        </div>
      </Card>

      {/* Login Modal */}
      <Dialog
        header="Iniciar Sesión"
        visible={showModal}
        onHide={() => setShowModal(false)}
        style={{ width: '400px' }}
        modal
      >
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña</label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              toggleMask
              style={{ width: '100%' }}
            />
          </div>
          
          <Button
            label="Iniciar Sesión"
            onClick={handleLogin}
            style={{ width: '100%' }}
          />
          
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <span style={{ color: '#666' }}>¿No tienes cuenta? </span>
            <Button label="Registrarse" link />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
