import React, { useState, useRef, useEffect } from 'react';
import '../App.css'; // Modal stilleri için App.css kullanılacak

const DesignEditorModal = ({ onClose, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  // Mouse aşağı basıldığında sürüklemeyi başlat
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Mouse hareket ettiğinde componentin pozisyonunu güncelle
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  // Mouse yukarı kalktığında sürüklemeyi bitir
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Component yüklendiğinde mousemove ve mouseup event listenerlarını ekle
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = (e) => handleMouseUp(e);

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    // Component kaldırıldığında event listenerları temizle
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, offset, position]); // isDragging, offset, position bağımlılıkları eklendi

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Overlay'e tıklayınca kapanma */}
      <div 
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Modal içeriğine tıklayınca kapanmayı engelle
        onMouseDown={handleMouseDown} // Mouse aşağı basma event listenerı
        style={{
          position: 'absolute', // Sürüklenebilirlik için position absolute olmalı
          top: position.y,
          left: position.x,
          cursor: isDragging ? 'grabbing' : 'grab', // Sürükleme durumuna göre imleç değişimi
        }}
      >
        <div className="modal-header">
          <h2>Tasarım Editörü</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DesignEditorModal; 