import React, { createContext, useState, useEffect } from 'react';

// Varsayılan stil değişkenleri App.css :root tan alınacak veya burada tutulacak
const initialCssVariables = {
  // Genel arka plan ve başlıklar
  '--general-bg-gradient': 'linear-gradient(135deg, #17171A 0%, #2B0A50 100%)',
  '--general-bg-color': '#17171A',
  '--title-color': '#FFFFFF',
  '--title-span-color': '#FFCC00',
  '--title-shadow': '0 4px 8px rgba(0, 0, 0, 0.3)',

  // Oyun başlat butonu
  '--button-gradient': 'linear-gradient(90deg, #ffd700 0%, #eb4b4b 100%)',
  '--button-text-color': '#23272e',
  '--button-border-color': '#ffd700',
  '--button-shadow': '0 4px 24px #0004, 0 0 16px #ffd70055',

  // Hak talep et butonu
  '--rights-button-background': 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  '--rights-button-text-color': '#FFFFFF',
  '--rights-button-icon-color': '#FFFFFF',
  '--rights-button-border-color': '#45a049',

  // Geçmiş butonu
  '--history-button-background': 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  '--history-button-text-color': '#FFFFFF',
  '--history-button-icon-color': '#FFFFFF',
  '--history-button-border-color': '#1976D2',

  // Info butonu
  '--info-btn-bg': 'linear-gradient(135deg, #23243a 60%, #191726 100%)',
  '--info-btn-color': '#ffd700',
  '--info-btn-border': '#ffd700',

  // Raffle roller holder ve container
  '--roller-holder-border': '#3c3759',
  '--roller-container-bg': 'linear-gradient(135deg, #23243a 60%, #191726 100%)',
  '--roller-indicator-bg': '#d16266',

  // Kutular (item)
  '--roller-item-color': '#fff',
  '--roller-item-border': '#70677c',
  '--roller-item-bg': 'linear-gradient(135deg, #14202b 0%, #23243a 100%)',
  '--roller-item-red-border': '#EB4B4B',

  // Dialog
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
  // ... diğer dialog ve tema değişkenleri ...
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