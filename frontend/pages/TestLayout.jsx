import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function TestLayout() {
  return (
    <div className="p-4">
      <Card title="Prueba del Layout con Menú Dinámico" className="mb-4">
        <p>Esta página prueba que el menú dinámico esté disponible en todas las páginas.</p>
        <div className="flex gap-2 mt-3">
          <Button label="Ir a Dashboard" icon="pi pi-home" onClick={() => window.location.href = '/dashboard'} />
          <Button label="Ver Canchas" icon="pi pi-building" onClick={() => window.location.href = '/courts/view'} />
          <Button label="Ir a Home" icon="pi pi-arrow-left" onClick={() => window.location.href = '/'} />
        </div>
      </Card>
      
      <Card title="Características del Layout">
        <div className="grid">
          <div className="col-12 md:col-6">
            <h4>Menú Dinámico</h4>
            <ul>
              <li>✅ Sidebar adaptativo</li>
              <li>✅ Navegación entre páginas</li>
              <li>✅ Responsive design</li>
              <li>✅ Información del usuario</li>
              <li>✅ Notificaciones</li>
            </ul>
          </div>
          <div className="col-12 md:col-6">
            <h4>Funcionalidades</h4>
            <ul>
              <li>✅ Auto-ocultar en móviles</li>
              <li>✅ Overlay en pantallas pequeñas</li>
              <li>✅ Menú de usuario</li>
              <li>✅ Logout con confirmación</li>
              <li>✅ Estado activo del menú</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
