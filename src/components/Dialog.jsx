import React from 'react';

const Dialog = ({ isOpen, onClose, message, type = 'success', actionButtonText = 'Ödülü Al!', title, children }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="dialog-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'win':
                return (
                    <svg className="dialog-icon win-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 1L15.09 7.26L22 8.27L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.27L8.91 7.26L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'rewards':
                return (
                    <svg className="dialog-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'error':
                return (
                    <svg className="dialog-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="dialog-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div
                className={`dialog-content ${type}`}
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--dialog-background, white)',
                    color: 'var(--dialog-text-color, #1a1a1a)',
                    border: '1px solid var(--dialog-border-color, #FFD700)'
                }}
            >
                <button className="dialog-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                {getIcon()}
                <h2 className="dialog-title">{title || (type === 'win' ? 'Tebrikler!' : 'Tebrikler!')}</h2>
                {type === 'rewards' ? (
                    <div className="dialog-rewards-content">
                        {children}
                    </div>
                ) : (
                    <p className="dialog-message">{message}</p>
                )}
                {type !== 'rewards' && (
                    <button
                        className="dialog-action-button"
                        onClick={onClose}
                        style={{
                            background: 'var(--dialog-action-button-background, white)',
                            color: 'var(--dialog-action-button-color, #FFA500)',
                            boxShadow: 'var(--dialog-action-button-shadow, 0 4px 12px rgba(52, 211, 153, 0.2))',
                            border: '2px solid var(--dialog-action-button-border, #FFA500)'
                        }}
                    >
                        {actionButtonText}
                    </button>
                )}
            </div>

            <style jsx>{`
                .dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .dialog-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 1.5rem;
                    position: relative;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    animation: popIn 0.3s ease-out;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .dialog-content.rewards {
                    max-width: 400px;
                    max-height: 85vh;
                    overflow-y: auto;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                    border: 1px solid rgba(255, 215, 0, 0.3);
                }

                .dialog-rewards-content {
                    margin: 1.5rem 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 1.2rem;
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    backdrop-filter: blur(10px);
                }

                .dialog-rewards-content .prize-list-item {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 0.8rem;
                    padding: 1rem;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    min-height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-weight: 500;
                    font-size: 0.95rem;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .dialog-rewards-content .prize-list-item:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.15);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }

                .dialog-rewards-content .prize-list-item.rarity-blue {
                    border-color: #3fa7ff;
                    box-shadow: 0 0 15px rgba(63, 167, 255, 0.3);
                }

                .dialog-rewards-content .prize-list-item.rarity-purple {
                    border-color: #a259e6;
                    box-shadow: 0 0 15px rgba(162, 89, 230, 0.3);
                }

                .dialog-rewards-content .prize-list-item.rarity-gold {
                    border-color: #ffd700;
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
                }

                .dialog-rewards-content .prize-list-item.rarity-red {
                    border-color: #eb4b4b;
                    box-shadow: 0 0 15px rgba(235, 75, 75, 0.3);
                }

                .dialog-rewards-content .prize-list-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                }

                .dialog-rewards-content .prize-list-item:hover::before {
                    transform: translateX(100%);
                }

                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .dialog-content.win {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: white;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                .dialog-icon {
                    width: 64px;
                    height: 64px;
                    margin-bottom: 1rem;
                    color: currentColor;
                }

                .win-icon {
                    color: white;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .dialog-close {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    color: currentColor;
                }

                .dialog-close svg {
                    width: 24px;
                    height: 24px;
                }

                .dialog-title {
                    font-size: 1.5rem;
                    margin: 0 0 1rem 0;
                    font-weight: bold;
                }

                .dialog-message {
                    margin: 0 0 1.5rem 0;
                    font-size: 1.2rem;
                }

                .dialog-action-button {
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 2rem;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .dialog-action-button:hover {
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .dialog-content {
                        padding: 1.5rem;
                        max-width: 320px;
                    }

                    .dialog-content.rewards {
                        max-width: 90vw;
                        padding: 1.2rem;
                    }

                    .dialog-rewards-content {
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                        gap: 1rem;
                        padding: 1rem;
                    }

                    .dialog-rewards-content .prize-list-item {
                        min-height: 90px;
                        font-size: 0.9rem;
                        padding: 0.8rem;
                    }
                }

                @media (max-width: 480px) {
                    .dialog-content {
                        padding: 1.25rem;
                        max-width: 280px;
                    }

                    .dialog-content.rewards {
                        max-width: 95vw;
                        padding: 1rem;
                    }

                    .dialog-rewards-content {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                        gap: 0.8rem;
                        padding: 0.8rem;
                    }

                    .dialog-rewards-content .prize-list-item {
                        min-height: 80px;
                        font-size: 0.85rem;
                        padding: 0.6rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dialog; 