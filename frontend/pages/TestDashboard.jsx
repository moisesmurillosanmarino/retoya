import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function TestDashboard() {
  const handleDirectAccess = () => {
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
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card title="Test Dashboard - RetoYa" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '20px 0' }}>
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            Esta página permite probar el dashboard sin necesidad de validación del backend.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Button 
              label="Acceso Directo al Dashboard" 
              onClick={handleDirectAccess}
              style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
              size="large"
            />
            
            <Button 
              label="Ir a Login (con validación mock)" 
              onClick={() => window.location.href = '/login'}
              outlined
              size="large"
            />
            
            <Button 
              label="Volver a Home" 
              onClick={() => window.location.href = '/'}
              text
              size="large"
            />
          </div>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '8px',
            border: '1px solid #22c55e'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#22c55e' }}>Información:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151' }}>
              <li>El login ahora salta la validación del backend</li>
              <li>Cualquier email y contraseña válidos funcionarán</li>
              <li>Se crea un usuario mock automáticamente</li>
              <li>Acceso directo al dashboard completo</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
