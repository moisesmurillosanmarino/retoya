import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { apiService } from '../../services/api.js';
import { useAuthStore } from '../../app/store/auth.js';

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuthStore();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular login exitoso sin validación del backend
      const mockResponse = {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          name: formData.email.split('@')[0] || 'Usuario',
          email: formData.email,
          avatar_url: null,
          role: 'user'
        }
      };
      
      // Store login data
      login(mockResponse.token, mockResponse.user);
      
      // Store remember me preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess(mockResponse);
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              border: '4px solid #22c55e', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0fdf4',
              marginRight: '15px'
            }}>
              <i className="pi pi-bolt" style={{ fontSize: '28px', color: '#22c55e' }}></i>
            </div>
            <h1 style={{ 
              margin: 0, 
              color: '#22c55e', 
              fontSize: '32px', 
              fontWeight: 'bold' 
            }}>
              RetoYa
            </h1>
          </div>
          <h2 style={{ 
            margin: 0, 
            color: '#1f2937', 
            fontSize: '24px', 
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            Iniciar Sesión
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#6b7280', 
            fontSize: '16px' 
          }}>
            Accede a tu cuenta para continuar
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Message 
            severity="error" 
            text={error} 
            style={{ marginBottom: '20px' }}
          />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Email
            </label>
            <InputText
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              style={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: validationErrors.email ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              className={validationErrors.email ? 'p-invalid' : ''}
            />
            {validationErrors.email && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.email}
              </small>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Contraseña
            </label>
            <Password
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Tu contraseña"
              toggleMask
              style={{ width: '100%' }}
              inputStyle={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: validationErrors.password ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              className={validationErrors.password ? 'p-invalid' : ''}
            />
            {validationErrors.password && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.password}
              </small>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                inputId="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.checked)}
                style={{ marginRight: '8px' }}
              />
              <label htmlFor="rememberMe" style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                cursor: 'pointer'
              }}>
                Recordarme
              </label>
            </div>
            <Button
              type="button"
              label="¿Olvidaste tu contraseña?"
              link
              onClick={handleForgotPassword}
              style={{ 
                fontSize: '14px', 
                color: '#22c55e',
                padding: '0'
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label="Iniciar Sesión"
            loading={loading}
            style={{ 
              width: '100%',
              backgroundColor: '#22c55e',
              borderColor: '#22c55e',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600'
            }}
            className="p-button-lg"
          />

          <Divider style={{ margin: '30px 0' }}>
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>o</span>
          </Divider>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              ¿No tienes cuenta?{' '}
            </span>
            <Button
              type="button"
              label="Registrarse"
              link
              onClick={onSwitchToRegister}
              style={{ 
                fontSize: '14px', 
                color: '#22c55e',
                fontWeight: '600',
                padding: '0'
              }}
            />
          </div>
        </form>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#9ca3af', 
            fontSize: '12px' 
          }}>
            Al iniciar sesión, aceptas nuestros{' '}
            <a href="#" style={{ color: '#22c55e' }}>Términos de Servicio</a>
            {' '}y{' '}
            <a href="#" style={{ color: '#22c55e' }}>Política de Privacidad</a>
          </p>
        </div>
      </Card>
    </div>
  );
}
