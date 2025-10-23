import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function TestLogin() {
  return (
    <div style={{ padding: '20px' }}>
      <Card title="Test Login Components" style={{ marginBottom: '20px' }}>
        <p>Esta página verifica que los componentes de login funcionen correctamente.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button 
            label="Ir a Login" 
            onClick={() => window.location.href = '/login'}
            style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
          />
          <Button 
            label="Ir a Home" 
            onClick={() => window.location.href = '/'}
            outlined
          />
        </div>
      </Card>
    </div>
  );
}
