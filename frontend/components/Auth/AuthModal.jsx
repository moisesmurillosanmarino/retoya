import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { apiService } from '../../services/api.js';
import { useAuthStore } from '../../app/store/auth.js';

export default function AuthModal({ visible, onHide }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const { login: loginUser } = useAuthStore();

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
        
        loginUser(response.token, response.user);
        onHide();
      } else {
        await apiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        
        // Auto login after registration
        const response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
        
        loginUser(response.token, response.user);
        onHide();
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog
      header={isLogin ? "Iniciar Sesión" : "Registrarse"}
      visible={visible}
      onHide={onHide}
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
          severity="info"
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
  );
}
