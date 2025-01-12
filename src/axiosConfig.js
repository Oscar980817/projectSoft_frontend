import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Asegúrate de que la URL base sea correcta
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permitir el envío de cookies
});

export default instance;