import React, { useState } from 'react';
import { User, Lock, Mail, Dumbbell, Building2, Users, Shield } from 'lucide-react';
import { AuthService } from '../services/auth-service';
import { LoginCredentials } from '../types/auth';

export const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const authService = AuthService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.login(credentials);
      if (user) {
        // Redirigir según el rol
        const redirectUrl = authService.getRedirectUrl(user);
        window.location.href = redirectUrl;
      } else {
        setError('Credenciales incorrectas. Por favor intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const demoUsers = [
    {
      email: 'superadmin@entrenatech.com',
      role: 'Super Administrador',
      description: 'Acceso completo a todos los gimnasios',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      email: 'owner@powerfit.com',
      role: 'Dueño de Gimnasio',
      description: 'Gestión completa de PowerFit Gym',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      email: 'trainer@powerfit.com',
      role: 'Entrenador',
      description: 'Gestión de clases y miembros',
      icon: Dumbbell,
      color: 'text-green-600'
    },
    {
      email: 'member@powerfit.com',
      role: 'Miembro',
      description: 'Portal para clientes del gimnasio',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">

        {/* Panel izquierdo - Login */}
        <div className="flex flex-col justify-center">
          <div className="card">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">EntrenaTech</h1>
              <p className="text-gray-600">Plataforma de Gestión de Gimnasios</p>
            </div>

            {/* Formulario de login */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="input-field pl-12"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="input-field pl-12"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Link para demo */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {showDemo ? 'Ocultar' : 'Ver'} cuentas de demostración
              </button>
            </div>
          </div>
        </div>

        {/* Panel derecho - Información y Demo */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Gestión Integral para Tu Gimnasio
            </h2>
            <p className="text-gray-600 mb-8">
              Accede a diferentes paneles según tu rol en la plataforma
            </p>
          </div>

          {/* Tarjetas de demostración */}
          <div className="space-y-4">
            {demoUsers.map((demoUser, index) => {
              const Icon = demoUser.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setCredentials({
                      email: demoUser.email,
                      password: 'password123'
                    });
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 bg-gray-50 rounded-lg ${demoUser.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{demoUser.role}</h3>
                      <p className="text-sm text-gray-600 mb-1">{demoUser.description}</p>
                      <p className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {demoUser.email}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              🔑 Contraseña de demostración
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Usa la contraseña <code className="bg-blue-100 px-2 py-1 rounded">password123</code>
              para todas las cuentas de demostración.
            </p>
            <div className="text-xs text-blue-600">
              <p>• Los datos son de demostración y no se guardan</p>
              <p>• Cada rol redirige a su panel correspondiente</p>
              <p>• Puedes probar diferentes roles para explorar la plataforma</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};