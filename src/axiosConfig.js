import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://projectsoft.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permitir el envío de cookies
});

export default instance;
