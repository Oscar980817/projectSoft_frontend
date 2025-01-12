import React, { useRef, useState } from 'react';

const PhotoCapture = ({ onCapture }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCamera = async () => {
    setIsCameraActive(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  const handleTakePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    onCapture(imageData);
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setIsCameraActive(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={() => fileInputRef.current.click()}>
        Cargar Fotografía
      </button>
      <button type="button" onClick={handleStartCamera}>
        Tomar Fotografía
      </button>
      {isCameraActive && (
        <div>
          <video ref={videoRef} style={{ display: 'block', width: '100%' }}></video>
          <button type="button" onClick={handleTakePhoto}>
            Capturar
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;