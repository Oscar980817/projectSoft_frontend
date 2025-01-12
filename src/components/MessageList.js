import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const MessageList = ({ reportId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reportId) {
      setError('Report ID no encontrado');
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/messages?reportId=${reportId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessages(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Error al cargar los mensajes');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [reportId]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no válida';
    }
  };

  if (loading) return <div className="messages-loading">Cargando mensajes...</div>;
  if (error) return <div className="messages-error">{error}</div>;

  return (
    <div className="message-list">
      {!messages?.conversation?.length ? (
        <p className="no-messages">No hay mensajes</p>
      ) : (
        messages.conversation.map((message, index) => (
          <div key={index} className="message">
            <div className="message-header">
              <span className="message-sender">{message.sender}</span>
              <span className="message-date">{formatDate(message.date)}</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;