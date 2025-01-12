import React, { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    borderRadius: '8px'
  }
};

Modal.setAppElement('#root');

const RejectReportModal = ({ isOpen, onClose, onSubmit, error }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Rechazar Informe"
    >
      <div className="reject-modal">
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Rechazar Informe</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="rejectionReason"
              style={{ display: 'block', marginBottom: '5px' }}
            >
              Motivo del Rechazo:
            </label>
            <textarea
              id="rejectionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '10px'
              }}
              placeholder="Ingrese el motivo del rechazo..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Rechazar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RejectReportModal;