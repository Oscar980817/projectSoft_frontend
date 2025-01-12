import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        setError('Failed to fetch notifications');
      }
    };

    fetchNotifications();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="notifications">
      <h2>Notificaciones</h2>
      <ul>
        {notifications.map(notification => (
          <li key={notification._id}>
            <p><strong>Estado:</strong> {notification.estado}</p>
            <p><strong>Mensaje:</strong> {notification.mensaje}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;