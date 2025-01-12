import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openThreads, setOpenThreads] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/messages', {
          headers: { 'Authorization': `Bearer ${token}` }
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
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const toggleThread = (reportId) => {
    setOpenThreads(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  return (
    <div className="messages-container">
      <h1>Mensajes y Notificaciones</h1>
      <div className="messages-list">
        {Object.entries(messages).map(([reportId, messageGroup]) => (
          <div key={reportId} className="message-group">
            <div 
              className="message-group-header" 
              onClick={() => toggleThread(reportId)}
            >
              <h3>{formatDate(messageGroup[0]?.fecha_de_programa)}</h3>
              <span className={`toggle-icon ${openThreads[reportId] ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`message-thread ${openThreads[reportId] ? 'open' : ''}`}>
              {messageGroup.map((message) => (
                <div key={message._id} className="message-card">
                  <div className="message-header">
                    <span className="message-from">De: {message.remitente?.nombre}</span>
                    <span className="message-date">{formatDate(message.fecha_de_programa)}</span>
                  </div>
                  <h3 className="message-subject">{message.asunto}</h3>
                  <p className="message-content">{message.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;