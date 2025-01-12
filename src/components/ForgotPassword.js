import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { HardHat, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

const PasswordResetRequest = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', 
        { correo: email }, // Changed from email to correo
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setStatus('success');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-gray-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <HardHat className="h-16 w-16 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">Restablecer Contraseña</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Ingrese su correo electrónico para recibir un enlace de restablecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    placeholder="nombre@empresa.com"
                    type="email"
                    required
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-full h-12 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md">
                Enviar Enlace de Restablecimiento
              </Button>
            </form>
          )}
          {status === 'success' && (
            <Alert className="bg-green-500/20 border-green-500 text-green-100">
              <Mail className="h-4 w-4" />
              <AlertTitle>Correo Enviado</AlertTitle>
              <AlertDescription>
                Se ha enviado un enlace de restablecimiento a su correo electrónico. Por favor, revise su bandeja de entrada.
              </AlertDescription>
            </Alert>
          )}
          {status === 'error' && (
            <Alert className="bg-red-500/20 border-red-500 text-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                El correo electrónico ingresado no está registrado en nuestra plataforma. Por favor, verifique e intente nuevamente.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="text-gray-300 hover:text-white" onClick={onBackToLogin}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio de sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordResetRequest;