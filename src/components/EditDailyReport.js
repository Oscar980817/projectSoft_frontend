import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import './EditDailyReport.css';
import ActivityEditForm from './ActivityEditForm';

const getImagePath = (fotografia) => {
  if (!fotografia) return '';

  // Handle base64 images
  if (fotografia.startsWith('data:image')) {
    return fotografia;
  }

  // Handle relative paths
  if (fotografia.startsWith('/uploads/')) {
    return `${process.env.REACT_APP_API_URL}${fotografia}`;
  }

  // Handle full URLs
  if (fotografia.startsWith('http')) {
    return fotografia;
  }

  // Default case
  return `${process.env.REACT_APP_API_URL}/uploads/${fotografia}`;
};

const ActivityDetails = React.memo(({ activity, onEdit }) => (
  <div className="activity-content">
    <div className="activity-header">
      <button className="edit-button" onClick={() => onEdit(activity)}>
        Editar
      </button>
    </div>
    <div className="activity-details">
      <div className="info-section">
        <h4>Información General</h4>
        <p><strong>CIV:</strong> {activity?.civ?.numero || 'N/A'}</p>
        <p><strong>Actividad:</strong> {activity?.actividad || 'N/A'}</p>
        <p><strong>Item:</strong> {activity?.item || 'N/A'}</p>
        <p><strong>Ubicación Inicial:</strong> {activity?.ubi_inicial || 'N/A'}</p>
        <p><strong>Ubicación Final:</strong> {activity?.ubi_final || 'N/A'}</p>
      </div>

      <div className="measurements">
        <h4>Medidas</h4>
        <p><strong>Largo:</strong> {activity?.largo || '0'} m</p>
        <p><strong>Ancho:</strong> {activity?.ancho || '0'} m</p>
        <p><strong>Alto:</strong> {activity?.alto || '0'} m</p>
        <p><strong>Total:</strong> {activity?.total || '0'} m³</p>
      </div>

      <div className="discounts">
        <h4>Descuentos</h4>
        <p><strong>Largo:</strong> {activity?.descuento_largo || '0'} m</p>
        <p><strong>Ancho:</strong> {activity?.descuento_ancho || '0'} m</p>
        <p><strong>Alto:</strong> {activity?.descuento_alto || '0'} m</p>
        <p><strong>Total Descuento:</strong> {activity?.total_descuento || '0'} m³</p>
        <p><strong>Total Final:</strong> {activity?.total_final || '0'} m³</p>
      </div>

      {activity?.observaciones && (
        <div className="observations">
          <h4>Observaciones</h4>
          <p>{activity.observaciones}</p>
        </div>
      )}

      {activity?.fotografia && (
        <div className="activity-image">
          <h4>Fotografía</h4>
          <img
            src={getImagePath(activity.fotografia)}
            alt="Fotografía de la actividad"
            loading="lazy"
            onError={(e) => {
              console.error('Error loading image:', activity.fotografia);
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  </div>
));

const EditDailyReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('ID del informe no encontrado');
      navigate('/daily-reports');
      return;
    }
    fetchReport();
  }, [id, navigate]);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await axios.get(`/daily-reports/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.data || !response.data.activities) {
        throw new Error('Datos del informe inválidos');
      }

      const processedReport = {
        ...response.data,
        activities: response.data.activities.map(activity => {
          const activityData = activity._doc || activity;
          return {
            _id: activityData._id,
            civ: activityData.civ,
            actividad: activityData.actividad || '',
            item: activityData.item || '',
            ubi_inicial: activityData.ubi_inicial || '',
            ubi_final: activityData.ubi_final || '',
            largo: parseFloat(activityData.largo) || 0,
            ancho: parseFloat(activityData.ancho) || 0,
            alto: parseFloat(activityData.alto) || 0,
            descuento_largo: parseFloat(activityData.descuento_largo) || 0,
            descuento_ancho: parseFloat(activityData.descuento_ancho) || 0,
            descuento_alto: parseFloat(activityData.descuento_alto) || 0,
            total: parseFloat(activityData.total) || 0,
            total_descuento: parseFloat(activityData.total_descuento) || 0,
            total_final: parseFloat(activityData.total_final) || 0,
            observaciones: activityData.observaciones || '',
            fotografia: activityData.fotografia
              ? activityData.fotografia.startsWith('data:image')
                ? activityData.fotografia
                : `/uploads/${activityData.fotografia.split('/').pop()}`
              : null
          };
        })
      };

      setReport(processedReport);
      setSummary(processedReport.summary || '');
    } catch (error) {
      console.error('Error fetching report:', error);
      setError(error.message || 'Error al cargar el informe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityUpdate = (updatedActivity) => {
    setReport(prev => ({
      ...prev,
      activities: prev.activities.map(act =>
        act._id === updatedActivity._id ? updatedActivity : act
      )
    }));
    setEditingActivity(null);
  };

  const handleActivityEdit = (activity) => {
    const processedActivity = {
      ...activity,
      fotografia: activity.fotografia
        ? activity.fotografia.startsWith('data:image')
          ? activity.fotografia
          : activity.fotografia.startsWith('/uploads/')
            ? activity.fotografia
            : `/uploads/${activity.fotografia.split('/').pop()}`
        : null
    };
    setEditingActivity(processedActivity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !report) return;
  
    // Check if report can be edited
    if (report.status !== 'rejected') {
      setError('No se puede editar un informe que ya ha sido procesado');
      return;
    }
  
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
  
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Token decodificado:', decodedToken);
      console.log('Estado del informe:', report.status);
  
      const response = await axios({
        method: 'PUT',
        url: `/daily-reports/${id}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': decodedToken._id,
          'x-user-role': decodedToken.roles[0]
        },
        data: {
          ...report,
          summary,
          activities: report.activities, // Ensure activities are included in the request
          status: 'pending' // Reset status to pending after edit
        }
      });
  
      if (response.data) {
        navigate('/daily-activity'); // Navigate back to daily activity
      }
    } catch (error) {
      console.error('Error detallado:', error);
      if (error.response?.status === 400) {
        setError(error.response.data.message || 'No se puede editar este informe');
      } else {
        setError('Error al actualizar el informe');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!report) return <div className="not-found">Informe no encontrado</div>;

  return (
    <div className="edit-daily-report">
      <h2>Editar Informe Diario</h2>
      <p>Fecha: {new Date(report.date).toLocaleDateString()}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Resumen:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>

        <div className="activities-list">
          <h3>Actividades incluidas:</h3>
          {report.activities.map((activity, index) => (
            <React.Fragment key={`activity-wrapper-${activity._id}`}>
              <div className="activity-item">
                {editingActivity?._id === activity._id ? (
                  <ActivityEditForm
                    key={`edit-${activity._id}`}
                    activity={editingActivity}
                    onSave={handleActivityUpdate}
                    onCancel={() => setEditingActivity(null)}
                  />
                ) : (
                  <ActivityDetails
                    key={`details-${activity._id}`}
                    activity={activity}
                    onEdit={handleActivityEdit}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={isSaving}
            className={isSaving ? 'saving' : ''}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/daily-reports')}
            disabled={isSaving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDailyReport;