import React from 'react';
import './DashboardModule.css'; // Importar el archivo CSS para los estilos

const DashboardModule = ({ title, description, logo, onClick }) => {
  return (
    <div className="dashboard-module">
      <div className="module-header">
        <h2>{title}</h2>
        <img src={logo} alt={`${title} logo`} className="module-logo" />
      </div>
      <p className="module-description">{description}</p>
      <button className="module-button" onClick={onClick}>Acceder</button>
    </div>
  );
};

export default DashboardModule;