import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import PhotoCapture from './PhotoCapture';
import { useNavigate } from 'react-router-dom';
import './DailyActivity.css';


const DailyActivity = () => {
  const [nuevaActividad, setNuevaActividad] = useState({
    civ: '',
    ubi_inicial: '',
    ubi_final: '',
    item: '',
    actividad: '',
    largo: '',
    ancho: '',
    alto: '',
    descuento_largo: '',
    descuento_ancho: '',
    descuento_alto: '',
    fotografia: '',
    observaciones: ''
  });

  const [actividades, setActividades] = useState([]);
  const [civs, setCivs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [informes, setInformes] = useState([]);
  const [mostrarInformes, setMostrarInformes] = useState(false);
  const [resumenInforme, setResumenInforme] = useState('');
  const [editandoActividad, setEditandoActividad] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setActividades(response.data.filter(activity => !activity.informeGenerado));
      } catch (error) {
        setError('Error al obtener actividades');
      }
    };

    const fetchCivs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/civs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCivs(response.data);
      } catch (error) {
        setError('Error al obtener CIVs');
      }
    };

    const fetchInformes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/daily-reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setInformes(response.data);
      } catch (error) {
        setError('Error al obtener informes');
      }
    };

    fetchActividades();
    fetchCivs();
    fetchInformes();
  }, []);

  const handleChange = (e) => {
    setNuevaActividad({
      ...nuevaActividad,
      [e.target.name]: e.target.value
    });
  };

  const handleCapture = (image) => {
    setNuevaActividad({
      ...nuevaActividad,
      fotografia: image
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMensajeExito('');
  
    const formData = new FormData();
    const camposNumericos = ['largo', 'ancho', 'alto', 'descuento_largo', 'descuento_ancho', 'descuento_alto'];
    const datosActividad = { ...nuevaActividad };
  
    camposNumericos.forEach(field => {
      datosActividad[field] = parseFloat(datosActividad[field]) || 0;
    });
  
    Object.keys(datosActividad).forEach(key => {
      formData.append(key, datosActividad[key]);
    });
  
    try {
      const token = localStorage.getItem('token');
      let response;
      if (editandoActividad) {
        response = await axios.put(`/activities/${editandoActividad._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post('/activities', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
  
      const actividadId = response.data.id || editandoActividad._id;
      const actividadActualizada = await axios.get(`/activities/${actividadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      if (editandoActividad) {
        setActividades(prevActividades => prevActividades.map(activity => activity._id === editandoActividad._id ? actividadActualizada.data : activity));
        setEditandoActividad(null);
      } else {
        setActividades(prevActividades => [...prevActividades, actividadActualizada.data]);
      }
  
      setNuevaActividad({
        civ: '',
        ubi_inicial: '',
        ubi_final: '',
        item: '',
        actividad: '',
        largo: '',
        ancho: '',
        alto: '',
        descuento_largo: '',
        descuento_ancho: '',
        descuento_alto: '',
        fotografia: '',
        observaciones: ''
      });
      setMensajeExito(editandoActividad ? 'Actividad actualizada exitosamente' : 'Actividad creada exitosamente');
    } catch (error) {
      console.error('Error al crear/actualizar actividad:', error);
      setError(error.response?.data?.message || 'Error al crear/actualizar actividad');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerarInforme = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/daily-reports', {
        date: new Date().toISOString().split('T')[0], // Usar la fecha actual
        activities: actividades.map(activity => activity._id),
        summary: resumenInforme
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Marcar las actividades como incluidas en un informe
      await Promise.all(actividades.map(activity =>
        axios.put(`/activities/${activity._id}`, { informeGenerado: true }, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ));

      setInformes(prev => [...prev, response.data]);
      setMensajeExito('Informe generado exitosamente');
      setResumenInforme('');
      setActividades([]); // Reiniciar la lista de actividades
    } catch (error) {
      console.error('Error al generar informe:', error);
      setError('Error al generar informe');
    }
  };

  const handleDescargarInforme = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/daily-reports/${reportId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Error al descargar informe');
    }
  };

  const handleEliminarActividad = async (activityId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/activities/${activityId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setActividades(prevActividades => prevActividades.filter(activity => activity._id !== activityId));
      setMensajeExito('Actividad eliminada exitosamente');
    } catch (error) {
      setError('Error al eliminar actividad');
    }
  };

  const handleEditarActividad = (activity) => {
    setNuevaActividad({
      civ: activity.civ._id,
      ubi_inicial: activity.ubi_inicial,
      ubi_final: activity.ubi_final,
      item: activity.item,
      actividad: activity.actividad,
      largo: activity.largo,
      ancho: activity.ancho,
      alto: activity.alto,
      descuento_largo: activity.descuento_largo,
      descuento_ancho: activity.descuento_ancho,
      descuento_alto: activity.descuento_alto,
      fotografia: activity.fotografia,
      observaciones: activity.observaciones
    });
    setEditandoActividad(activity);
  };

  const handleEditReport = (reportId) => {
    navigate(`/daily-report/edit/${reportId}`);
  };

  return (
    <div className="daily-activity">
      <h1>Actividad Diaria</h1>
      {error && <p className="error">{error}</p>}
      {mensajeExito && <p className="success">{mensajeExito}</p>}
      {isLoading && <p className="loading">Cargando...</p>}

      <form onSubmit={handleSubmit} className="activity-form">
        <select name="civ" value={nuevaActividad.civ} onChange={handleChange} required>
          <option value="">Selecciona un CIV</option>
          {civs.map(civ => (
            <option key={civ._id} value={civ._id}>{civ.numero}</option>
          ))}
        </select>
        <input type="text" name="ubi_inicial" placeholder="Ubicación Inicial" value={nuevaActividad.ubi_inicial} onChange={handleChange} required />
        <input type="text" name="ubi_final" placeholder="Ubicación Final" value={nuevaActividad.ubi_final} onChange={handleChange} required />
        <input type="text" name="item" placeholder="Item" value={nuevaActividad.item} onChange={handleChange} required />
        <input type="text" name="actividad" placeholder="Actividad" value={nuevaActividad.actividad} onChange={handleChange} required />
        <input type="number" name="largo" placeholder="Largo" value={nuevaActividad.largo} onChange={handleChange} required />
        <input type="number" name="ancho" placeholder="Ancho" value={nuevaActividad.ancho} onChange={handleChange} required />
        <input type="number" name="alto" placeholder="Alto" value={nuevaActividad.alto} onChange={handleChange} required />
        <input type="number" name="descuento_largo" placeholder="Descuento Largo" value={nuevaActividad.descuento_largo} onChange={handleChange} required />
        <input type="number" name="descuento_ancho" placeholder="Descuento Ancho" value={nuevaActividad.descuento_ancho} onChange={handleChange} required />
        <input type="number" name="descuento_alto" placeholder="Descuento Alto" value={nuevaActividad.descuento_alto} onChange={handleChange} required />
        <PhotoCapture onCapture={handleCapture} />
        {nuevaActividad.fotografia && (
          <div>
            <h3>Vista Previa de la Fotografía</h3>
            <img src={nuevaActividad.fotografia} alt="Fotografía" style={{ width: '100%', maxWidth: '300px' }} />
          </div>
        )}
        <textarea name="observaciones" placeholder="Observaciones" value={nuevaActividad.observaciones} onChange={handleChange} required></textarea>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creando...' : editandoActividad ? 'Actualizar Actividad' : 'Crear Actividad'}
        </button>
      </form>

      <div className="activities-list">
        <h2>Actividades Diarias</h2>
        {actividades.map((activity, index) => (
          <div key={activity._id || index} className="activity-item">
            <p key={`civ-${activity._id || index}`}><strong>CIV:</strong> {activity.civ?.numero}</p>
            <p key={`ubi-inicial-${activity._id || index}`}><strong>Ubicación Inicial:</strong> {activity.ubi_inicial}</p>
            <p key={`ubi-final-${activity._id || index}`}><strong>Ubicación Final:</strong> {activity.ubi_final}</p>
            <p key={`item-${activity._id || index}`}><strong>Item:</strong> {activity.item}</p>
            <p key={`actividad-${activity._id || index}`}><strong>Actividad:</strong> {activity.actividad}</p>
            <p key={`largo-${activity._id || index}`}><strong>Largo:</strong> {activity.largo}</p>
            <p key={`ancho-${activity._id || index}`}><strong>Ancho:</strong> {activity.ancho}</p>
            <p key={`alto-${activity._id || index}`}><strong>Alto:</strong> {activity.alto}</p>
            <p key={`total-${activity._id || index}`}><strong>Total:</strong> {activity.total}</p>
            <p key={`desc-largo-${activity._id || index}`}><strong>Descuento Largo:</strong> {activity.descuento_largo}</p>
            <p key={`desc-ancho-${activity._id || index}`}><strong>Descuento Ancho:</strong> {activity.descuento_ancho}</p>
            <p key={`desc-alto-${activity._id || index}`}><strong>Descuento Alto:</strong> {activity.descuento_alto}</p>
            <p key={`foto-${activity._id || index}`}><strong>Fotografía:</strong>
              <img src={activity.fotografia} alt="Fotografía" style={{ width: '100%', maxWidth: '300px' }} />
            </p>
            <p key={`obs-${activity._id || index}`}><strong>Observaciones:</strong> {activity.observaciones}</p>
            <button onClick={() => handleEditarActividad(activity)}>Editar</button>
            <button onClick={() => handleEliminarActividad(activity._id)}>Eliminar</button>
          </div>
        ))}
      </div>

      <div className="report-section">
        <h2>Generar Informe Diario</h2>
        <div className="report-form">
          <textarea
            placeholder="Resumen del informe"
            value={resumenInforme}
            onChange={(e) => setResumenInforme(e.target.value)}
            required
          />
          <button
            onClick={handleGenerarInforme}
            disabled={actividades.length === 0 || !resumenInforme}
          >
            Generar Informe
          </button>
        </div>
      </div>

      <div className="reports-section">
        <h2>Informes Diarios</h2>
        <button onClick={() => setMostrarInformes(!mostrarInformes)}>
          {mostrarInformes ? 'Ocultar Informes' : 'Ver Informes'}
        </button>

        {mostrarInformes && (
          <div className="reports-list">
            {informes.map(report => (
              <div key={report._id} className="report-item">
                <p><strong>Fecha:</strong> {new Date(report.date).toLocaleDateString()}</p>
                <p><strong>Resumen:</strong> {report.summary}</p>
                <p><strong>Actividades:</strong> {report.activities.length}</p>
                <p className={`status ${report.status}`}>
                  <strong>Estado:</strong> {report.status === 'approved' ? 'Aprobado' :
                    report.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                </p>

                {report.status === 'approved' && (
                  <button
                    className="download-button"
                    onClick={() => handleDescargarInforme(report._id)}
                  >
                    Descargar PDF
                  </button>
                )}

                {report.status === 'rejected' && (
                  <>
                    <p className="rejection-reason">
                      <strong>Motivo de rechazo:</strong> {report.rejectionReason}
                    </p>
                    <button
                      className="edit-button"
                      onClick={() => handleEditReport(report._id)}
                    >
                      Corregir
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyActivity;