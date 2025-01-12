import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import TopBar from './TopBar';
import DashboardModule from './DashboardModule';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleModuleClick = (module) => {
    if (module === 'Informe Diario') {
      navigate('/daily-activity');
    } else if (module === 'Informes Generados') {
      navigate('/report-review');
    } else if (module === 'Mensajes y Notificaciones') {
      navigate('/messages');
    }else if (module === 'Registro Fotográfico') {
      navigate('/photo-gallery');
    }
    console.log(`Accediendo al módulo: ${module}`);
  };

  const userRoles = data.user.roles.map(role => role.nombre);
  const canViewReports = userRoles.includes('Director') || userRoles.includes('Ingeniero Residente');

  return (
    <div className="dashboard">
      <TopBar user={{ name: data.user.nombre, role: data.user.roles[0].nombre }} />
      <div className="dashboard-content">
        <DashboardModule
          title="Informe Diario"
          description="Acceda al módulo de informe diario para registrar las actividades diarias"
          logo="./assets/paste.svg"
          onClick={() => handleModuleClick('Informe Diario')}
        />
        {canViewReports && (
          <DashboardModule
            title="Informes Generados"
            description="Gestione la aprobación de informes diarios"
            logo="./assets/check.svg"
            onClick={() => handleModuleClick('Informes Generados')}
          />
        )}
        <DashboardModule
          title="Control Cantidades"
          description="Acceda al módulo de control de cantidades para gestionar las mismas"
          logo="./assets/excavation.svg"
          onClick={() => handleModuleClick('Control Cantidades')}
        />
        <DashboardModule
          title="Registro Fotográfico"
          description="Acceda al módulo de registro fotográfico para visualizar las fotografías de actividades diarias"
          logo="./assets/camera-solid.svg"
          onClick={() => handleModuleClick('Registro Fotográfico')}
        />
        <DashboardModule
          title="Roles y Permisos"
          description="Acceda al módulo de roles y permisos para gestionar los accesos a cada módulo"
          logo="../assets/user.svg"
          onClick={() => handleModuleClick('Roles y Permisos')}
        />
        <DashboardModule
          title="Ingreso Datos"
          description="Acceda al módulo de datos para gestionar los planos, normas, balances, programación, etc..."
          logo="../assets/data.svg"
          onClick={() => handleModuleClick('Ingreso Datos')}
        />
        <DashboardModule
          title="Mensajes y Notificaciones"
          description="Acceda al módulo de mensajes y notificaciones para enviar notificaciones a colaboradores"
          logo="../assets/message.svg"
          onClick={() => handleModuleClick('Mensajes y Notificaciones')}
        />
      </div>
    </div>
  );
};

export default Dashboard;