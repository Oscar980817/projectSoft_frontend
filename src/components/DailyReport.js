import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Importa la configuración de Axios
import './DailyReport.css'; // Importa el archivo CSS para los estilos

const DailyReport = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/activities', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      setError('Failed to fetch activities');
    }
  };

  const generateReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/reports/generate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setReport(response.data);
    } catch (error) {
      setError('Failed to generate report');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="daily-report">
      <h1>Informe Diario</h1>
      {error && <p className="error">{error}</p>}
      <div className="activities-list">
        <h2>Actividades Diarias</h2>
        {activities.map(activity => (
          <div key={activity._id} className="activity-item">
            <p><strong>CIV:</strong> {activity.civ?.numero}</p>
            <p><strong>Ubicación Inicial:</strong> {activity.ubi_inicial}</p>
            <p><strong>Ubicación Final:</strong> {activity.ubi_final}</p>
            <p><strong>Item:</strong> {activity.item}</p>
            <p><strong>Actividad:</strong> {activity.actividad}</p>
            <p><strong>Largo:</strong> {activity.largo}</p>
            <p><strong>Ancho:</strong> {activity.ancho}</p>
            <p><strong>Alto:</strong> {activity.alto}</p>
            <p><strong>Total:</strong> {activity.total}</p>
            <p><strong>Descuento Largo:</strong> {activity.descuento_largo}</p>
            <p><strong>Descuento Ancho:</strong> {activity.descuento_ancho}</p>
            <p><strong>Descuento Alto:</strong> {activity.descuento_alto}</p>
            <p><strong>Total Descuento:</strong> {activity.total_descuento}</p>
            <p><strong>Total Final:</strong> {activity.total_final}</p>
            <p><strong>Fotografía:</strong> {activity.fotografia}</p>
            <p><strong>Observaciones:</strong> {activity.observaciones}</p>
            <p><strong>Creado Por:</strong> {activity.createdBy?.nombre}</p>
            <p><strong>Cargo:</strong> {activity.cargo}</p>
          </div>
        ))}
      </div>
      <button onClick={generateReport}>Generar Informe Diario</button>
      {report && (
        <div className="report">
          <h2>Informe Diario Generado</h2>
          <p><strong>Clima a las 7 am:</strong> {report.clima_7am}</p>
          <p><strong>Clima a las 9 am:</strong> {report.clima_9am}</p>
          <p><strong>Clima a las 12 pm:</strong> {report.clima_12pm}</p>
          <p><strong>Clima a las 4 pm:</strong> {report.clima_4pm}</p>
          <h3>Actividades:</h3>
          {report.activities.map(activity => (
            <div key={activity._id} className="activity-item">
              <p><strong>CIV:</strong> {activity.civ?.numero}</p>
              <p><strong>Ubicación Inicial:</strong> {activity.ubi_inicial}</p>
              <p><strong>Ubicación Final:</strong> {activity.ubi_final}</p>
              <p><strong>Item:</strong> {activity.item}</p>
              <p><strong>Actividad:</strong> {activity.actividad}</p>
              <p><strong>Largo:</strong> {activity.largo}</p>
              <p><strong>Ancho:</strong> {activity.ancho}</p>
              <p><strong>Alto:</strong> {activity.alto}</p>
              <p><strong>Total:</strong> {activity.total}</p>
              <p><strong>Descuento Largo:</strong> {activity.descuento_largo}</p>
              <p><strong>Descuento Ancho:</strong> {activity.descuento_ancho}</p>
              <p><strong>Descuento Alto:</strong> {activity.descuento_alto}</p>
              <p><strong>Total Descuento:</strong> {activity.total_descuento}</p>
              <p><strong>Total Final:</strong> {activity.total_final}</p>
              <p><strong>Fotografía:</strong> {activity.fotografia}</p>
              <p><strong>Observaciones:</strong> {activity.observaciones}</p>
              <p><strong>Creado Por:</strong> {activity.createdBy?.nombre}</p>
              <p><strong>Cargo:</strong> {activity.cargo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyReport;