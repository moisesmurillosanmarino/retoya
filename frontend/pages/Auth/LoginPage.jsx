import React, { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm.jsx';
import RegisterForm from '../../components/Auth/RegisterForm.jsx';
import { Message } from 'primereact/message';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSuccess = (response) => {
    console.log('Login successful:', response);
    setSuccessMessage('¡Bienvenido a RetoYa!');
    
    // Redirect to home page after successful login
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  };

  const handleRegisterSuccess = (response) => {
    console.log('Registration successful:', response);
    setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo...');
    
    // Auto-login after successful registration
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setSuccessMessage('');
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setSuccessMessage('');
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 9999,
          width: '90%',
          maxWidth: '400px'
        }}>
          <Message 
            severity="success" 
            text={successMessage}
            style={{ 
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          />
        </div>
      )}

      {/* Auth Forms */}
      {isLogin ? (
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      ) : (
        <RegisterForm 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </div>
  );
}
