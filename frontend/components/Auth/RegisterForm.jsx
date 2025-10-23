import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { apiService } from '../../services/api.js';

export default function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!formData.phone) {
      errors.phone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      errors.phone = 'El teléfono no es válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      // Simular registro exitoso sin validación del backend
      const mockResponse = {
        user: {
          id: Date.now(),
          name: formData.name.trim(),
          email: formData.email,
          phone: formData.phone,
          avatar_url: null,
          role: 'user'
        }
      };
      
      // Call success callback
      if (onSuccess) {
        onSuccess(mockResponse);
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
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
          maxWidth: '450px',
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
            Crear Cuenta
          </h2>
          <p style={{ 
            margin: 0, 
            color: '#6b7280', 
            fontSize: '16px' 
          }}>
            Únete a la comunidad RetoYa
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

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Nombre Completo
            </label>
            <InputText
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              style={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: validationErrors.name ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              className={validationErrors.name ? 'p-invalid' : ''}
            />
            {validationErrors.name && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.name}
              </small>
            )}
          </div>

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

          {/* Phone Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Teléfono
            </label>
            <InputText
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+57 300 123 4567"
              style={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: validationErrors.phone ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              className={validationErrors.phone ? 'p-invalid' : ''}
            />
            {validationErrors.phone && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.phone}
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
              placeholder="Mínimo 6 caracteres"
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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              Confirmar Contraseña
            </label>
            <Password
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Repite tu contraseña"
              toggleMask
              style={{ width: '100%' }}
              inputStyle={{ 
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: validationErrors.confirmPassword ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '8px'
              }}
              className={validationErrors.confirmPassword ? 'p-invalid' : ''}
            />
            {validationErrors.confirmPassword && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.confirmPassword}
              </small>
            )}
          </div>

          {/* Terms and Conditions */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Checkbox
                inputId="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.checked)}
                style={{ marginRight: '8px', marginTop: '2px' }}
              />
              <label htmlFor="acceptTerms" style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                cursor: 'pointer',
                lineHeight: '1.4'
              }}>
                Acepto los{' '}
                <a href="#" style={{ color: '#22c55e' }}>Términos de Servicio</a>
                {' '}y la{' '}
                <a href="#" style={{ color: '#22c55e' }}>Política de Privacidad</a>
                {' '}de RetoYa
              </label>
            </div>
            {validationErrors.acceptTerms && (
              <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {validationErrors.acceptTerms}
              </small>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label="Crear Cuenta"
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

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              ¿Ya tienes cuenta?{' '}
            </span>
            <Button
              type="button"
              label="Iniciar Sesión"
              link
              onClick={onSwitchToLogin}
              style={{ 
                fontSize: '14px', 
                color: '#22c55e',
                fontWeight: '600',
                padding: '0'
              }}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}
