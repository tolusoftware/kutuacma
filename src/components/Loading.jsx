import React from 'react';

const Loading = () => {
    return (
    <div className="general-loading-container">
        <div className="loading-container">
            <div className="loading-content">
                <div className="loading-logo">
                    <img src="/logo.png" alt="Logo" />
                </div>
                <div className="loading-progress">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <div className="loading-text">Yükleniyor...</div>
                </div>
            </div>
        </div>
        </div>
       
    );
};

export default Loading; 