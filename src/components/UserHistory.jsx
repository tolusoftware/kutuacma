import React from 'react';


export default function UserHistory({ isOpen, onClose, historyLoading, prizeHistory }){


  function formatDate(windate)
  {
    const date = new Date(windate);
    const datePart = date.toLocaleDateString("tr-TR");
    const timepart = date.toLocaleTimeString("tr-TR",{
      hour:"2-digit",
      minute:"2-digit",
      hour12:false
    })

    const wdate = `${datePart} ${timepart}`;
    return wdate;
  }

  
  if (!isOpen) return null;

  const PrizeIcon = ({ won }) => (
    <div className={`prize-icon ${won ? 'won' : 'lost'}`}>
      {won ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8l3 4h2l2 1h1v3l-3 3-3-2h-4l-3 2-3-3v-3h1l2-1h2l3-4z"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )}
    </div>
  );

  return (
    <div className="history-modal">
      <div className="history-modal-overlay" onClick={onClose} />
      <div className="history-modal-content">
        <div className="history-modal-header">
          <h2>Oyun Geçmişi</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="history-modal-body">
          {historyLoading ? (
            <div className="history-loading">
              <div className="loading-spinner"></div>
              <p>Geçmiş yükleniyor...</p>
            </div>
          ) : prizeHistory.length === 0 ? (
            <div className="history-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M20 12H4M12 4v16"/>
              </svg>
              <p>Henüz oyun geçmişiniz bulunmuyor.</p>
              <button className="start-playing-btn" onClick={onClose}>
                Oynamaya Başla
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="history-list">
              {prizeHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <PrizeIcon won={item.win !== 'Kazanamadı'} />
                  <div className="history-item-details">
                    <h3 className={item.win === 'Kazanamadı' ? 'lost' : 'won'}>
                      {item.win}
                    </h3>
                    <p className="history-date">{formatDate(item.tarih)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 