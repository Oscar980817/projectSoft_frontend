import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [civs, setCivs] = useState([]);
  const [selectedCiv, setSelectedCiv] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCivs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/civs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCivs(response.data);
    } catch (error) {
      console.error('Error fetching CIVs:', error);
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          civId: selectedCiv,
          month: selectedMonth,
          year: selectedYear
        }
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCivs();
  }, []);

  useEffect(() => {
    if (selectedCiv && selectedMonth) {
      fetchPhotos();
    }
  }, [selectedCiv, selectedMonth, selectedYear]);

  return (
    <div className="photo-gallery">
      <h1>Registro Fotográfico</h1>
      
      <div className="gallery-controls">
        <div className="control-group">
          <label>CIV:</label>
          <select 
            value={selectedCiv} 
            onChange={(e) => setSelectedCiv(e.target.value)}
          >
            <option value="">Seleccione un CIV</option>
            {civs.map(civ => (
              <option key={civ._id} value={civ._id}>
                {civ.numero}
              </option>
            ))}
          </select>
        </div>

        {selectedCiv && (
          <div className="control-group">
            <label>Mes:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i, 1).toLocaleString('es', { month: 'long' })}
                </option>
              ))}
            </select>

            <label>Año:</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              min="2000"
              max="2100"
            />
          </div>
        )}
      </div>

      {!selectedCiv ? (
        <div className="select-message">Por favor seleccione un CIV</div>
      ) : loading ? (
        <div className="loading">Cargando...</div>
      ) : Object.keys(photos).length === 0 ? (
        <div className="no-photos">No hay fotos para mostrar en este período</div>
      ) : (
        <div className="photos-container">
          {Object.entries(photos).sort().map(([date, dayPhotos]) => (
            <div key={date} className="date-group">
              <h3>{new Date(date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</h3>
              <div className="photo-grid">
                {dayPhotos.map(photo => (
                  <div key={photo._id} className="photo-card">
                    <img src={photo.fotografia} alt="Foto del informe" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;