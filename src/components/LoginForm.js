import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { Button } from './ui/button';
import { Input } from './ui/input'; 
import { Label } from './ui/label'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'; 
import { HardHat, Lock, Mail, Eye, EyeOff } from 'lucide-react'; // Importar los íconos de ojo
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard'); // Navegar al dashboard después del inicio de sesión exitoso
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navegar a la página de solicitud de restablecimiento de contraseña
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Cambiar el estado de visibilidad de la contraseña
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <HardHat className="h-16 w-16 text-yellow-400" /> {/* Ajustar tamaño del casco */}
          </div>
          <CardTitle className="text-3xl font-bold text-center text-white">ProjectSoft</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Innovación en Gestión de Proyectos de Infraestructura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white"> {/* Cambiado a text-white */}
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email"
                  placeholder="nombre@empresa.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-95 h-12 rounded-md" // Ajustar tamaño y agregar borde redondeado
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white"> {/* Cambiado a text-white */}
                Contraseña
              </Label>
              <div className="relative">
                <div className="icon-container absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="icon text-gray-400" size={18} />
                  <div onClick={toggleShowPassword}>
                    {showPassword ? <EyeOff className="icon text-gray-400 eye" size={18} /> : <Eye className="icon text-gray-400 eye" size={18} />}
                  </div>
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'} // Cambiar el tipo de entrada según el estado de visibilidad
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-95 h-12 rounded-md" // Ajustar tamaño y agregar borde redondeado
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md">
              Iniciar sesión
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <button className="text-sm text-gray-300 hover:text-white" onClick={handleForgotPassword}>
            ¿Olvidó su contraseña?
          </button>
          <p className="text-sm text-center text-gray-400">
            ¿Necesita una cuenta?{' '}
            <a href="#" className="text-yellow-400 hover:text-yellow-300">
              Contacte a su administrador
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;