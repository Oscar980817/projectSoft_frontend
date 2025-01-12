import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { HardHat } from 'lucide-react';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/auth/reset/${token}`, { password, confirmPassword }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-600">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <HardHat className="h-16 w-16 text-yellow-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-white">Restablecer Contraseña</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Ingrese su nueva contraseña dos veces para restablecerla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Nueva Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full h-12 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 w-full h-12 rounded-md"
              />
            </div>
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md">
              Restablecer Contraseña
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">Contraseña restablecida con éxito. Redirigiendo...</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;