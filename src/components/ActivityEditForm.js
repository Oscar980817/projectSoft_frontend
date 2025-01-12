import React, { useState, useEffect } from 'react';

// Helper function for image URLs
const getImageUrl = (fotografia) => {
  if (!fotografia) return '';
  if (fotografia.startsWith('data:image')) return fotografia;
  if (fotografia.startsWith('/uploads/')) {
    return `${process.env.REACT_APP_API_URL}${fotografia}`;
  }
  if (fotografia.startsWith('http')) return fotografia;
  return `${process.env.REACT_APP_API_URL}/uploads/${fotografia}`;
};

const ActivityEditForm = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    actividad: '',
    item: '',
    ubi_inicial: '',
    ubi_final: '',
    largo: 0,
    ancho: 0,
    alto: 0,
    descuento_largo: 0,
    descuento_ancho: 0,
    descuento_alto: 0,
    observaciones: '',
    fotografia: '',
    civ: null
  });

  useEffect(() => {
    if (activity) {
      // Process the fotografia field when setting initial data
      const processedFotografia = activity.fotografia
        ? activity.fotografia.startsWith('data:image')
          ? activity.fotografia
          : activity.fotografia.startsWith('/uploads/')
            ? activity.fotografia
            : `/uploads/${activity.fotografia.split('/').pop()}`
        : '';

      setFormData({
        ...activity,
        actividad: activity.actividad || '',
        item: activity.item || '',
        ubi_inicial: activity.ubi_inicial || '',
        ubi_final: activity.ubi_final || '',
        largo: activity.largo || 0,
        ancho: activity.ancho || 0,
        alto: activity.alto || 0,
        descuento_largo: activity.descuento_largo || 0,
        descuento_ancho: activity.descuento_ancho || 0,
        descuento_alto: activity.descuento_alto || 0,
        observaciones: activity.observaciones || '',
        fotografia: processedFotografia,
        civ: activity.civ || null
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      if (file.size > 5000000) { // 5MB limit
        alert('La imagen es demasiado grande. Por favor seleccione una imagen menor a 5MB.');
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image before setting to state
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 1024;
          const maxHeight = 1024;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({
            ...prev,
            fotografia: compressedDataUrl
          }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="activity-edit-form">
      <div className="form-section">
        <h4>Información General</h4>
        <div className="form-group">
          <input
            type="text"
            name="actividad"
            value={formData.actividad}
            onChange={handleChange}
            placeholder="Actividad"
          />
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            placeholder="Item"
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Ubicación</h4>
        <div className="form-group">
          <input
            type="text"
            name="ubi_inicial"
            value={formData.ubi_inicial}
            onChange={handleChange}
            placeholder="Ubicación Inicial"
          />
          <input
            type="text"
            name="ubi_final"
            value={formData.ubi_final}
            onChange={handleChange}
            placeholder="Ubicación Final"
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Medidas</h4>
        <div className="form-group">
          <input
            type="number"
            name="largo"
            value={formData.largo}
            onChange={handleChange}
            placeholder="Largo"
          />
          <input
            type="number"
            name="ancho"
            value={formData.ancho}
            onChange={handleChange}
            placeholder="Ancho"
          />
          <input
            type="number"
            name="alto"
            value={formData.alto}
            onChange={handleChange}
            placeholder="Alto"
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Descuentos</h4>
        <div className="form-group">
          <input
            type="number"
            name="descuento_largo"
            value={formData.descuento_largo}
            onChange={handleChange}
            placeholder="Descuento Largo"
          />
          <input
            type="number"
            name="descuento_ancho"
            value={formData.descuento_ancho}
            onChange={handleChange}
            placeholder="Descuento Ancho"
          />
          <input
            type="number"
            name="descuento_alto"
            value={formData.descuento_alto}
            onChange={handleChange}
            placeholder="Descuento Alto"
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Observaciones</h4>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Observaciones"
        />
      </div>

      <div className="form-section" key="imagen">
        <h4>Fotografía</h4>
        <div className="image-upload-container">
          {formData.fotografia && (
            <div className="activity-image">
              <img
                src={getImageUrl(formData.fotografia)}
                alt="Fotografía de la actividad"
                loading="lazy"
                onError={(e) => {
                  console.error('Error loading image:', formData.fotografia);
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="image-upload-controls">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="image-upload"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload').click()}
              className="save-button"
            >
              {formData.fotografia ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button
          type="button"
          onClick={() => onSave({ ...activity, ...formData })}
          className="save-button"
        >
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ActivityEditForm;