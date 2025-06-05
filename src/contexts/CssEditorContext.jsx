import React, { createContext, useState, useEffect } from 'react';

// Varsayılan stil değişkenleri App.css :root tan alınacak veya burada tutulacak
const initialCssVariables = {
  '--general-bg-gradient': 'linear-gradient(135deg, #17171A 0%, #2B0A50 100%)',
  '--general-bg-color': '#17171A',
  '--header-background': 'linear-gradient(135deg, #3a3a3d 0%, #18181b 100%)',
  '--profile-background': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  '--profile-text-color': 'white',
  '--profile-icon-color': '#FFCC00',
  '--profile-border-color': 'rgba(255, 255, 255, 0.15)',
  '--shake-rights-background': 'linear-gradient(135deg, rgba(255, 204, 0, 0.2), rgba(255, 165, 0, 0.2))',
  '--shake-rights-text-color': 'white',
  '--shake-rights-icon-color': '#FFCC00',
  '--shake-rights-border-color': 'rgba(255, 204, 0, 0.3)',
  '--rights-button-background': 'linear-gradient(135deg, #FFCC00, #FFA500)',
  '--rights-button-text-color': '#2B0A50',
  '--rights-button-icon-color': '#2B0A50',
  '--rights-button-border-color': 'rgba(255, 204, 0, 0.5)',
  '--history-button-background': 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
  '--history-button-text-color': 'white',
  '--history-button-icon-color': 'white',
  '--history-button-border-color': 'rgba(255, 255, 255, 0.2)',
  '--title-color': '#FFFFFF',
  '--title-span-color': '#FFCC00',
  '--title-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)',
  '--instruction-bg': 'linear-gradient(135deg, rgba(255, 204, 0, 0.3), rgba(255, 165, 0, 0.3))',
  '--instruction-text-color': 'white',
  '--instruction-border-color': 'rgba(255, 204, 0, 0.2)',
  '--button-gradient': 'linear-gradient(45deg, #FFCC00 0%, #FFA500 100%)',
  '--button-text-color': '#2B0A50',
  '--button-border-radius': '30px',
  '--button-shadow': '0 8px 15px rgba(0, 0, 0, 0.2)',
  '--button-border-color': 'rgba(255, 204, 0, 0.5)',
  // SVG renk değişkenleri
  '--scratch-svg-color-1': '#0087d6',
  '--scratch-svg-color-2': '#09ed5c',
  '--scratch-svg-color-3': '#ff0a0a',
  // Dialog değişkenleri
  '--dialog-background': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
  '--dialog-text-color': '#2B0A50',
  '--dialog-border-color': 'rgba(255, 204, 0, 0.5)',
  '--dialog-border-radius': '15px',
  '--dialog-shadow': '0 8px 32px rgba(0, 0, 0, 0.2)',
  '--dialog-title-color': '#FFCC00',
  '--dialog-close-button-color': '#2B0A50',
  '--dialog-close-button-hover': '#FFCC00',
  '--dialog-message-font-size': '1.2rem',
  '--dialog-message-font-weight': '600',
  '--dialog-padding': '2rem',
  '--dialog-width': '90%',
  '--dialog-max-width': '400px',
  '--dialog-animation-duration': '0.3s',
  '--dialog-overlay-background': 'rgba(0, 0, 0, 0.4)',
  '--dialog-overlay-blur': '8px',
  '--dialog-icon-color': '#34d399',
  '--dialog-icon-size': '48px',
  '--dialog-title-font-size': '1.5rem',
  '--dialog-title-font-weight': '600',
  '--dialog-title-margin': '0 0 1rem',
  '--dialog-message-margin': '0 0 2rem',
  '--dialog-message-line-height': '1.6',
  '--dialog-message-letter-spacing': '0.3px',
  '--dialog-action-button-background': 'linear-gradient(135deg, #34d399, #10b981)',
  '--dialog-action-button-color': 'white',
  '--dialog-action-button-padding': '0.8rem 2rem',
  '--dialog-action-button-border-radius': '12px',
  '--dialog-action-button-font-size': '1rem',
  '--dialog-action-button-font-weight': '600',
  '--dialog-action-button-shadow': '0 4px 12px rgba(52, 211, 153, 0.2)',
  '--dialog-action-button-hover-shadow': '0 6px 16px rgba(52, 211, 153, 0.3)',
  '--dialog-close-button-size': '32px',
  '--dialog-close-button-padding': '8px',
  '--dialog-close-button-border-radius': '8px',
  '--dialog-close-button-hover-background': 'rgba(0, 0, 0, 0.05)',
  '--dialog-close-button-hover-color': '#333',
  '--dialog-top-line-height': '4px',
  '--dialog-top-line-gradient': 'linear-gradient(90deg, var(--dialog-title-color, #FFCC00), var(--dialog-close-button-hover, #FFA500))',
  // Dialog durumları için özel renkler
  '--dialog-success-icon-color': '#34d399',
  '--dialog-error-icon-color': '#f87171',
  '--dialog-warning-icon-color': '#fbbf24',
  '--dialog-success-button-background': 'linear-gradient(135deg, #34d399, #10b981)',
  '--dialog-error-button-background': 'linear-gradient(135deg, #f87171, #ef4444)',
  '--dialog-warning-button-background': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  '--dialog-success-button-shadow': '0 4px 12px rgba(52, 211, 153, 0.2)',
  '--dialog-error-button-shadow': '0 4px 12px rgba(248, 113, 113, 0.2)',
  '--dialog-warning-button-shadow': '0 4px 12px rgba(251, 191, 36, 0.2)',
  // Kart bileşeni için varsayılan CSS değişkenleri
  '--card-width': '150px',
  '--card-height': '150px',
  '--card-border-radius': '12px',
  '--card-box-shadow': '0 8px 16px rgba(0,0,0,0.1)',
  '--card-hover-transform': '-2px',
  '--card-hover-shadow': '0 12px 20px rgba(0,0,0,0.15)',
  '--card-content-bg': 'linear-gradient(135deg, #ffffff, #f5f5f5)',
  '--reward-text-size': '28px',
  '--reward-text-gradient': 'linear-gradient(45deg, #2196f3, #3f51b5)',
  '--reward-text-shadow': '2px 2px 4px rgba(0,0,0,0.1)',
  '--scratch-area-gradient': 'linear-gradient(135deg, #3f51b5, #2196f3)',
  '--question-mark-color': 'rgba(255, 255, 255, 0.2)',
  '--question-mark-size': '80px',
  '--corner-decoration-color': 'rgba(255, 255, 255, 0.1)',
  '--corner-decoration-width': '2px',
  // Diğer değişkenler buraya eklenebilir
};

export const CssEditorContext = createContext({
  cssVariables: initialCssVariables,
  updateCssVariable: (variableName, value) => {},
  setInitialCssVariables: (variables) => {}, // API'den çekilen veriyi yüklemek için
  resetCssVariables: () => {}, // Varsayılanlara sıfırlamak için
});

export const CssEditorProvider = ({ children, initialCss }) => {
  const [cssVariables, setCssVariables] = useState(initialCssVariables);

  // initialCss prop'u değiştiğinde state'i güncellemek için useEffect
  useEffect(() => {
      if (initialCss) {
          // initialCss geldiğinde sadece state'i güncelle, DOM'a uygulama diğer useEffect'te yapılacak.
          setCssVariables(prevVariables => ({ ...prevVariables, ...initialCss }));

          // Bu döngü stilleri DOM'a uyguluyor (Bu kısım artık gereksiz olmalı)
          // for (const [variable, value] of Object.entries(initialCss)) { // initialCss üzerinde dönelim
          //     document.documentElement.style.setProperty(variable, value);
          // }
      }
  }, [initialCss]); // initialCss prop'u değiştiğinde tetikle

  // Belirli bir CSS değişkenini güncelleyen fonksiyon
  const updateCssVariable = (variableName, value) => {
    setCssVariables(prevVariables => ({
      ...prevVariables,
      [variableName]: value,
    }));
  };

  // Varsayılan CSS değişkenlerine sıfırlayan fonksiyon
  const resetCssVariables = () => {
    setCssVariables(initialCssVariables);
  };

  // cssVariables state'i her değiştiğinde, DOM'daki :root değişkenlerini güncelle
  useEffect(() => {
      for (const [variable, value] of Object.entries(cssVariables)) {
          document.documentElement.style.setProperty(variable, value);
      }
  }, [cssVariables]); // cssVariables değiştiğinde tetikle

  return (
    <CssEditorContext.Provider value={{ cssVariables, updateCssVariable, resetCssVariables }}>
      {children}
    </CssEditorContext.Provider>
  );
}; 