import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function TestPage() {
  return (
    <div className="p-6">
      <Card title="Test Page" className="mb-4">
        <p>Esta es una página de prueba para verificar que PrimeReact funciona correctamente.</p>
        <Button label="Botón de Prueba" className="mt-3" />
      </Card>
    </div>
  );
}
