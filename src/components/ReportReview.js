import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import './ReportReview.css';
import Modal from 'react-modal';
import RejectReportModal from './RejectReportModal';

Modal.setAppElement('#root');

const ReportReview = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingReports, setPendingReports] = useState([]);
  const [approvedReports, setApprovedReports] = useState([]);
  const [error, setError] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenRejectModal = (reportId) => {
    setSelectedReportId(reportId);
    setRejectionReason('');
    setError(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró el token de autenticación');
          return;
        }

        // Decodificar el token para obtener los roles del usuario
        const decodedToken = jwtDecode(token);
        console.log('Token decodificado:', decodedToken);

        // Extraer roles directamente del token decodificado
        const roles = decodedToken.roles || [];
        console.log('Roles extraídos:', roles);
        setUserRoles(roles);

        const response = await axios.get('/daily-reports', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const reports = response.data;
        setPendingReports(reports.filter(report => !report.status || report.status === 'pending'));
        setApprovedReports(reports.filter(report => report.status === 'approved'));
      } catch (error) {
        console.error('Error completo:', error);
        if (error.response && error.response.status === 403) {
          setError('No tienes permisos para acceder a este recurso');
        } else {
          setError('Error al cargar los informes');
        }
      }
    };

    fetchReports();
  }, []);

  const canApproveReports = userRoles.includes('Director') || userRoles.includes('Ingeniero Residente');
  console.log('Puede aprobar informes:', canApproveReports); // Log para depuración

  const handleApproveReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/daily-reports/${reportId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPendingReports(prev => prev.filter(report => report._id !== reportId));
        setApprovedReports(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error al aprobar:', error);
      setError(error.response?.data?.message || 'Error al aprobar el informe');
    }
  };

  const handleRejectReport = async (reason) => {
    try {
      if (!reason.trim()) {
        setError('El motivo de rechazo es requerido');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.put(`/daily-reports/${selectedReportId}/reject`,
        { rejectionReason: reason },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setPendingReports(prev => prev.filter(report => report._id !== selectedReportId));
        setIsModalOpen(false);
        setSelectedReportId(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error al rechazar:', error);
      setError(error.response?.data?.message || 'Error al rechazar el informe');
    }
  };

  const handleDownloadPDF = (report) => {
    const token = localStorage.getItem('token');
    axios.get(`/daily-reports/${report._id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'blob' // Asegurarse de que la respuesta se maneje como un blob
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const reportDate = new Date(report.date).toLocaleDateString('es-CO').replace(/\//g, '-');
        link.setAttribute('download', `informe_${reportDate}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => {
        console.error('Error al descargar el PDF:', error);
        setError('Error al descargar el PDF');
      });
  };

  return (
    <div className="report-review">
      <h1>Revisión de Informes</h1>
      {error && <div className="error">{error}</div>}

      <div className="tabs">
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Informes Pendientes
        </button>
        <button
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          Informes Aprobados
        </button>
      </div>

      <div className="reports-list">
        {activeTab === 'pending' ? (
          pendingReports.map(report => (
            <div key={report._id} className="report-card">
              <h3>Informe del {new Date(report.date).toLocaleDateString()}</h3>
              <p><strong>Resumen:</strong> {report.summary}</p>
              <p><strong>Actividades:</strong> {report.activities.length}</p>
              <p><strong>Creado por:</strong> {report.createdBy?.nombre || 'N/A'}</p>
              <div className="activities-list">
                {report.activities.map(activity => (
                  <div key={activity._id} className="activity-item">
                    <p><strong>CIV:</strong> {activity.civ?.numero || 'N/A'}</p>
                    <p><strong>Actividad:</strong> {activity.actividad}</p>
                    <p><strong>Ubicación Inicial:</strong> {activity.ubi_inicial}</p>
                    <p><strong>Ubicación Final:</strong> {activity.ubi_final}</p>
                    <p><strong>Item:</strong> {activity.item}</p>
                    <p><strong>Medidas:</strong> Largo: {activity.largo}, Ancho: {activity.ancho}, Alto: {activity.alto}</p>
                    <p><strong>Total:</strong> {activity.total}</p>
                    <p><strong>Descuentos:</strong> Largo: {activity.descuento_largo}, Ancho: {activity.descuento_ancho}, Alto: {activity.descuento_alto}</p>
                    <p><strong>Total Descuento:</strong> {activity.total_descuento}</p>
                    <p><strong>Total Final:</strong> {activity.total_final}</p>
                    <p><strong>Observaciones:</strong> {activity.observaciones}</p>
                    {activity.fotografia && (
                      <div>
                        <h4>Fotografía:</h4>
                        <img src={activity.fotografia} alt="Fotografía de la actividad" style={{ width: '100%', maxWidth: '300px' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {canApproveReports && (
                <div className="action-buttons">
                  <button onClick={() => handleApproveReport(report._id)}>Aprobar</button>
                  <button onClick={() => handleOpenRejectModal(report._id)}>Rechazar</button>
                </div>
              )}
            </div>
          ))
        ) : (
          approvedReports.map(report => (
            <div key={report._id} className="report-card">
              <h3>Informe del {new Date(report.date).toLocaleDateString()}</h3>
              <p><strong>Resumen:</strong> {report.summary}</p>
              <p><strong>Actividades:</strong> {report.activities.length}</p>
              <p><strong>Creado por:</strong> {report.createdBy?.nombre || 'N/A'}</p>
              <p><strong>Aprobado por:</strong> {report.approvedBy?.nombre || 'N/A'}</p>
              <button onClick={() => handleDownloadPDF(report)}>
                descargar PDF
              </button>
            </div>
          ))
        )}
      </div>
      <RejectReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRejectReport}
        error={error}
      />
    </div>
  );
};

export default ReportReview;