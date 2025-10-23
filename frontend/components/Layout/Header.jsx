import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useAuthStore } from '../../app/store/auth.js';
import AuthModal from '../Auth/AuthModal.jsx';

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const [userMenu] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => {
        // Navigate to profile
        window.location.href = '/profile';
      }
    },
    {
      label: 'Mis Reservas',
      icon: 'pi pi-calendar',
      command: () => {
        // Navigate to bookings
        window.location.href = '/bookings';
      }
    },
    {
      label: 'Mis Equipos',
      icon: 'pi pi-users',
      command: () => {
        // Navigate to teams
        window.location.href = '/teams';
      }
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: handleLogout
    }
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <i className="pi pi-soccer-ball text-white text-sm"></i>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  RedBullJab
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Inicio
              </a>
              <a 
                href="/courts" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Canchas
              </a>
              <a 
                href="/matches" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Partidos
              </a>
              <a 
                href="/teams" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Equipos
              </a>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    ¡Hola, {user?.name || 'Usuario'}!
                  </span>
                  <div className="relative">
                    <Avatar
                      image={user?.avatar_url}
                      icon="pi pi-user"
                      size="normal"
                      shape="circle"
                      className="cursor-pointer"
                      onClick={(e) => userMenu?.toggle(e)}
                    />
                    <Menu
                      ref={userMenu}
                      model={userMenuItems}
                      popup
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    label="Iniciar Sesión"
                    outlined
                    size="small"
                    onClick={() => setShowAuthModal(true)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  />
                  <Button
                    label="Registrarse"
                    size="small"
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        visible={showAuthModal} 
        onHide={() => setShowAuthModal(false)} 
      />
    </>
  );
}
