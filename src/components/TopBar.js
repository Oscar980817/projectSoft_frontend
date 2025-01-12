import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import axios from '../axiosConfig';
import './TopBar.css';

const TopBar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleNotifications = async () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      await markNotificationsAsRead();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      // Update the API path to match backend route
      await axios.put('/api/notifications/mark-as-read', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setHasUnreadNotifications(false);
      // Also update the get notifications path
      const response = await axios.get('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const unreadNotifications = response.data.some(notification => !notification.leido);
        setHasUnreadNotifications(unreadNotifications);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h1>ProjectSoft</h1>
      </div>
      <div className="top-bar-right">
        <div className="notification-container">
          <Bell className={`notification-icon ${hasUnreadNotifications ? 'has-unread' : ''}`} size={24} onClick={toggleNotifications} />
          {notificationsOpen && (
            <div className="notifications-dropdown">
              {notifications.length === 0 ? (
                <p>No hay notificaciones</p>
              ) : (
                <ul>
                  {notifications.slice(0, 5).map(notification => (
                    <li key={notification._id}>
                      <p><strong>{notification.estado}</strong></p>
                      <p>{notification.mensaje}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="user-info" onClick={toggleMenu}>
          <span>{user.name}</span>
          <ChevronDown className="chevron-icon" size={18} />
        </div>
        {menuOpen && (
          <div className="dropdown-menu">
            <p>{user.name}</p>
            <p>{user.role}</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;