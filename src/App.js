import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import Dashboard from './components/Dashboard'; // Asegúrate de importar el componente Dashboard
import DailyActivity from './components/DailyActivity'; // Importar el componente de actividad diaria
import ReportReview from './components/ReportReview';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import EditDailyReport from './components/EditDailyReport';
import PhotoGallery from './components/PhotoGallery';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset/:token" element={<PasswordReset />} />
        <Route path="/forgot-password" element={<PasswordResetRequest />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Asegúrate de usar el componente Dashboard */}
        <Route path="/daily-activity" element={<DailyActivity />} /> {/* Agregar la ruta para la actividad diaria */}
        <Route path="/report-review" element={<ReportReview />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/daily-report/edit/:id" element={<EditDailyReport />} />        
        <Route path="/" element={<LoginForm />} />
        <Route path="/photo-gallery" element={<PhotoGallery />} />
      </Routes>
    </Router>
  );
};

export default App;