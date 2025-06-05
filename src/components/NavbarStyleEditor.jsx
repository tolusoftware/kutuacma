import React, { useState, useEffect } from 'react';

const NavbarStyleEditor = ({ onUpdateStyle }) => {
  const [navbarGradientColor1, setNavbarGradientColor1] = useState('#3a3a3d');
  const [navbarGradientColor2, setNavbarGradientColor2] = useState('#18181b');
  const [navbarGradientDirection, setNavbarGradientDirection] = useState('135deg');

  // Button Style States (new)
  const [buttonBgColor1, setButtonBgColor1] = useState('#FFCC00');
  const [buttonBgColor2, setButtonBgColor2] = useState('#FFA500');
  const [buttonBgDirection, setButtonBgDirection] = useState('45deg');
  const [buttonTextColor, setButtonTextColor] = useState('#2B0A50');
  const [buttonIconColor, setButtonIconColor] = useState('#2B0A50');
  const [buttonBorderRadius, setButtonBorderRadius] = useState('30'); // Sadece sayı tutalım, CSS'te px ekleriz

  // Buton stilleri için local state'ler (başlangıç değerleri contextten alınabilir daha sonra)
  // Hak Talep Et butonu stilleri
  const [rightsButtonBgColor1, setRightsButtonBgColor1] = useState('#FFCC00');
  const [rightsButtonBgColor2, setRightsButtonBgColor2] = useState('#FFA500');
  const [rightsButtonBgDirection, setRightsButtonBgDirection] = useState('45deg');
  const [rightsButtonTextColor, setRightsButtonTextColor] = useState('#2B0A50');
  const [rightsButtonIconColor, setRightsButtonIconColor] = useState('#2B0A50');
  const [rightsButtonBorderRadius, setRightsButtonBorderRadius] = useState('30');

  // Geçmiş butonu stilleri
  const [historyButtonBgColor1, setHistoryButtonBgColor1] = useState('rgba(255, 255, 255, 0.15)');
  const [historyButtonBgColor2, setHistoryButtonBgColor2] = useState('rgba(255, 255, 255, 0.05)');
  const [historyButtonBgDirection, setHistoryButtonBgDirection] = useState('135deg');
  const [historyButtonTextColor, setHistoryButtonTextColor] = useState('white');
  const [historyButtonIconColor, setHistoryButtonIconColor] = useState('white');
  const [historyButtonBorderRadius, setHistoryButtonBorderRadius] = useState('50');

  // State değiştiğinde üst componente (CssEditor) tüm stil değerlerini haber ver
  useEffect(() => {
    const navbarGradientValue = `linear-gradient(${navbarGradientDirection}, ${navbarGradientColor1}, ${navbarGradientColor2})`;
    const buttonBackgroundValue = `linear-gradient(${buttonBgDirection}, ${buttonBgColor1} 0%, ${buttonBgColor2} 100%)`;
    const buttonBorderRadiusValue = `${buttonBorderRadius}px`;

    const rightsButtonStyles = {
      background: `linear-gradient(${rightsButtonBgDirection}, ${rightsButtonBgColor1} 0%, ${rightsButtonBgColor2} 100%)`,
      textColor: rightsButtonTextColor,
      iconColor: rightsButtonIconColor,
      borderRadius: `${rightsButtonBorderRadius}px`,
      // Hover stilleri de buraya eklenebilir
    };

    const historyButtonStyles = {
        background: `linear-gradient(${historyButtonBgDirection}, ${historyButtonBgColor1}, ${historyButtonBgColor2})`,
        textColor: historyButtonTextColor,
        iconColor: historyButtonIconColor,
        borderRadius: `${historyButtonBorderRadius}px`,
        // Hover stilleri
        // hoverBackground: ..., hoverTransform: ..., hoverBoxShadow: ...
    };

    onUpdateStyle({
      navbarGradient: navbarGradientValue,
      buttonStyles: {
        background: buttonBackgroundValue,
        textColor: buttonTextColor,
        iconColor: buttonIconColor,
        borderRadius: buttonBorderRadiusValue,
        'rights-button': rightsButtonStyles,
        'history-nav-button': historyButtonStyles,
      }
    });
  }, [
    navbarGradientColor1, navbarGradientColor2, navbarGradientDirection,
    buttonBgColor1, buttonBgColor2, buttonBgDirection,
    buttonTextColor, buttonIconColor, buttonBorderRadius,
    rightsButtonBgColor1, rightsButtonBgColor2, rightsButtonBgDirection, rightsButtonTextColor, rightsButtonIconColor, rightsButtonBorderRadius,
    historyButtonBgColor1, historyButtonBgColor2, historyButtonBgDirection, historyButtonTextColor, historyButtonIconColor, historyButtonBorderRadius,
    onUpdateStyle // onUpdateStyle propu da bağımlılık olarak eklenmeli
  ]);

  // Bu component şimdilik sadece kontrolleri gösterecek.
  // Context ile stil güncelleme daha sonra eklenecek.

  return (
    <div>
      <h3>Navbar Arka Plan Stilini Düzenle</h3>
      <div>
        <label htmlFor="navbarColor1">Renk 1:</label>
        <input 
          type="color" 
          id="navbarColor1" 
          value={navbarGradientColor1} 
          onChange={(e) => setNavbarGradientColor1(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="navbarColor2">Renk 2:</label>
        <input 
          type="color" 
          id="navbarColor2" 
          value={navbarGradientColor2} 
          onChange={(e) => setNavbarGradientColor2(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="navbarDirection">Yön:</label>
        <select 
          id="navbarDirection" 
          value={navbarGradientDirection} 
          onChange={(e) => setNavbarGradientDirection(e.target.value)}
        >
          <option value="0deg">Yukarı</option>
          <option value="45deg">Sağ Üst</option>
          <option value="90deg">Sağ</option>
          <option value="135deg">Sağ Alt</option>
          <option value="180deg">Aşağı</option>
          <option value="225deg">Sol Alt</option>
          <option value="270deg">Sol</option>
          <option value="315deg">Sol Üst</option>
        </select>
      </div>

      <hr /> {/* Ayırıcı çizgi */}

      <h3>Buton Stilini Düzenle</h3>
      <div>
        <label htmlFor="buttonBgColor1">Arka Plan Renk 1:</label>
        <input 
          type="color" 
          id="buttonBgColor1" 
          value={buttonBgColor1} 
          onChange={(e) => setButtonBgColor1(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="buttonBgColor2">Arka Plan Renk 2:</label>
        <input 
          type="color" 
          id="buttonBgColor2" 
          value={buttonBgColor2} 
          onChange={(e) => setButtonBgColor2(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="buttonBgDirection">Arka Plan Yön:</label>
        <select 
          id="buttonBgDirection" 
          value={buttonBgDirection} 
          onChange={(e) => setButtonBgDirection(e.target.value)}
        >
          <option value="0deg">Yukarı</option>
          <option value="45deg">Sağ Üst</option>
          <option value="90deg">Sağ</option>
          <option value="135deg">Sağ Alt</option>
          <option value="180deg">Aşağı</option>
          <option value="225deg">Sol Alt</option>
          <option value="270deg">Sol</option>
          <option value="315deg">Sol Üst</option>
        </select>
      </div>
      <div>
        <label htmlFor="buttonTextColor">Yazı Rengi:</label>
        <input 
          type="color" 
          id="buttonTextColor" 
          value={buttonTextColor} 
          onChange={(e) => setButtonTextColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="buttonIconColor">İkon Rengi:</label>
        <input 
          type="color" 
          id="buttonIconColor" 
          value={buttonIconColor} 
          onChange={(e) => setButtonIconColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="buttonBorderRadius">Kenar Yuvarlaklığı (px):</label>
        <input 
          type="number" 
          id="buttonBorderRadius" 
          value={buttonBorderRadius} 
          onChange={(e) => setButtonBorderRadius(e.target.value)} 
          min="0"
        />
      </div>

      <hr /> {/* Ayırıcı çizgi */}

      <h3>Hak Talep Et Butonu Stilini Düzenle</h3>
      <div>
        <label htmlFor="rightsButtonBgColor1">Arka Plan Renk 1:</label>
        <input 
          type="color" 
          id="rightsButtonBgColor1" 
          value={rightsButtonBgColor1} 
          onChange={(e) => setRightsButtonBgColor1(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="rightsButtonBgColor2">Arka Plan Renk 2:</label>
        <input 
          type="color" 
          id="rightsButtonBgColor2" 
          value={rightsButtonBgColor2} 
          onChange={(e) => setRightsButtonBgColor2(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="rightsButtonBgDirection">Arka Plan Yön:</label>
        <select 
          id="rightsButtonBgDirection" 
          value={rightsButtonBgDirection} 
          onChange={(e) => setRightsButtonBgDirection(e.target.value)}
        >
          <option value="0deg">Yukarı</option>
          <option value="45deg">Sağ Üst</option>
          <option value="90deg">Sağ</option>
          <option value="135deg">Sağ Alt</option>
          <option value="180deg">Aşağı</option>
          <option value="225deg">Sol Alt</option>
          <option value="270deg">Sol</option>
          <option value="315deg">Sol Üst</option>
        </select>
      </div>
      <div>
        <label htmlFor="rightsButtonTextColor">Yazı Rengi:</label>
        <input 
          type="color" 
          id="rightsButtonTextColor" 
          value={rightsButtonTextColor} 
          onChange={(e) => setRightsButtonTextColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="rightsButtonIconColor">İkon Rengi:</label>
        <input 
          type="color" 
          id="rightsButtonIconColor" 
          value={rightsButtonIconColor} 
          onChange={(e) => setRightsButtonIconColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="rightsButtonBorderRadius">Kenar Yuvarlaklığı (px):</label>
        <input 
          type="number" 
          id="rightsButtonBorderRadius" 
          value={rightsButtonBorderRadius} 
          onChange={(e) => setRightsButtonBorderRadius(e.target.value)} 
          min="0"
        />
      </div>

      <hr /> {/* Ayırıcı çizgi */}

      <h3>Geçmiş Butonu Stilini Düzenle</h3>
      <div>
        <label htmlFor="historyButtonBgColor1">Arka Plan Renk 1:</label>
        <input 
          type="color" 
          id="historyButtonBgColor1" 
          value={historyButtonBgColor1} 
          onChange={(e) => setHistoryButtonBgColor1(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="historyButtonBgColor2">Arka Plan Renk 2:</label>
        <input 
          type="color" 
          id="historyButtonBgColor2" 
          value={historyButtonBgColor2} 
          onChange={(e) => setHistoryButtonBgColor2(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="historyButtonBgDirection">Arka Plan Yön:</label>
        <select 
          id="historyButtonBgDirection" 
          value={historyButtonBgDirection} 
          onChange={(e) => setHistoryButtonBgDirection(e.target.value)}
        >
          <option value="0deg">Yukarı</option>
          <option value="45deg">Sağ Üst</option>
          <option value="90deg">Sağ</option>
          <option value="135deg">Sağ Alt</option>
          <option value="180deg">Aşağı</option>
          <option value="225deg">Sol Alt</option>
          <option value="270deg">Sol</option>
          <option value="315deg">Sol Üst</option>
        </select>
      </div>
      <div>
        <label htmlFor="historyButtonTextColor">Yazı Rengi:</label>
        <input 
          type="color" 
          id="historyButtonTextColor" 
          value={historyButtonTextColor} 
          onChange={(e) => setHistoryButtonTextColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="historyButtonIconColor">İkon Rengi:</label>
        <input 
          type="color" 
          id="historyButtonIconColor" 
          value={historyButtonIconColor} 
          onChange={(e) => setHistoryButtonIconColor(e.target.value)} 
        />
      </div>
      <div>
        <label htmlFor="historyButtonBorderRadius">Kenar Yuvarlaklığı (px):</label>
        <input 
          type="number" 
          id="historyButtonBorderRadius" 
          value={historyButtonBorderRadius} 
          onChange={(e) => setHistoryButtonBorderRadius(e.target.value)} 
          min="0"
        />
      </div>

      {/* Diğer buton tipleri için benzer bloklar eklenebilir */}

    </div>
  );
};

export default NavbarStyleEditor; 