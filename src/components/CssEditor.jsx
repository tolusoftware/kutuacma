import React, { useState, useContext, useRef, useEffect } from 'react'
import { CssEditorContext } from '../contexts/CssEditorContext'
import { setCss, updateGameUpdates } from '../services/userServices'
import { UserContext } from '../contexts/UserContext'
import Dialog from './Dialog'
import config from '../config'

export default function CssEditor() {
  const [showModal, setShowModal] = useState(false)
  const [showSvgModal, setShowSvgModal] = useState(false)
  const { cssVariables, updateCssVariable, resetCssVariables } = useContext(CssEditorContext)

  const modalRef = useRef(null);
  const svgModalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [svgPosition, setSvgPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const dragStartMousePos = useRef({ x: 0, y: 0 });
  const dragStartModalPos = useRef({ x: 0, y: 0 });

  const { id: userId, getScratchConfig } = useContext(UserContext);

  const [dialog, setDialog] = useState({ isOpen: false, message: '' });



    const [rewardTitle, setRewardTitle] = useState('');


    const handleSaveRewardTitle = async () => {
      const response = await updateGameUpdates(getScratchConfig.spinWheelId,rewardTitle,config.apigameid);
      if(response.success){
        setDialog({
          isOpen: true,
          message: 'Ödül metni başarıyla kaydedildi!'
        });
      }
    }
  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('genel');
  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  const handleOpenSvgModal = () => {
    setShowSvgModal(true);
    setSvgPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseSvgModal = () => {
    setShowSvgModal(false)
  }

  const handleSaveCss = async () => {
    // API'ye gönderilecek JSON formatı
    try {
      const response = await setCss(cssVariables, getScratchConfig.spinWheelId); // setCss API'sini çağırın

      if (response.success) {
        setDialog({
          isOpen: true,
          message: 'CSS ayarları başarıyla kaydedildi!'
        });
      }
    } catch (error) {
      console.error('Error saving CSS settings:', error);
      setDialog({
        isOpen: true,
        message: 'CSS ayarları kaydedilirken bir hata oluştu.'
      });
    }
  }

  const handleVariableChange = (variableName, value) => {
    updateCssVariable(variableName, value);
    // Eğer dialog buton kenarlık rengi değişiyorsa, üst çizgi rengini de güncelle
    if (variableName === '--dialog-action-button-border') {
      updateCssVariable('--dialog-top-line-color', value);
    }
  }

  const handleGradientChange = (variableName, color1, color2, direction = '135deg') => {
    const gradientValue = `linear-gradient(${direction}, ${color1}, ${color2})`
    updateCssVariable(variableName, gradientValue)
  }

  // Gradient değerlerini renklerine ayırma fonksiyonu
  const parseGradient = (gradientValue) => {
    if (!gradientValue) return { color1: '#000000', color2: '#000000', direction: '135deg' }

    const match = gradientValue.match(/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/)
    if (match) {
      return {
        direction: `${match[1]}deg`,
        color1: match[2].trim(),
        color2: match[3].trim()
      }
    }
    // Handle rgba colors within gradient for profile/shake-rights if needed, assuming they are the only colors
    const rgbaMatch = gradientValue.match(/linear-gradient\((\d+)deg,\s*(rgba\([^)]+\)),\s*(rgba\([^)]+\))\)/);
    if (rgbaMatch) {
      return {
        direction: `${rgbaMatch[1]}deg`,
        color1: rgbaMatch[2].trim(),
        color2: rgbaMatch[3].trim(),
      };
    }
    return { color1: '#000000', color2: '#000000', direction: '135deg' }
  }

  const handleMouseDown = (e, isSvgModal = false) => {
    const modal = isSvgModal ? svgModalRef.current : modalRef.current;
    if (!modal) return;

    setIsDragging(true);
    dragStartMousePos.current = { x: e.pageX, y: e.pageY };

    const rect = modal.getBoundingClientRect();
    dragStartModalPos.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.pageX - dragStartMousePos.current.x;
    const deltaY = e.pageY - dragStartMousePos.current.y;

    const newX = dragStartModalPos.current.x + deltaX;
    const newY = dragStartModalPos.current.y + deltaY;

    if (showSvgModal) {
      setSvgPosition({ x: newX, y: newY });
    } else {
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, showSvgModal]);

  return (
    <div>
      <div className='general-css-editor-left'>
        <button onClick={resetCssVariables}>VARSAYILAN CSS'E DÖN</button>
        <button onClick={handleSaveCss}>CSS'İ KAYDET</button>
      </div>
      <div className='general-css-editor-right'>
        <button onClick={handleOpenModal}>TASARIM EDİTÖRÜ</button>
        <button onClick={handleOpenSvgModal}>KAZI KAZAN EDİTÖRÜ</button>
      </div>

      {showModal && (
        <div className="css-editor-overlay">
          <div
            className="css-editor-modal"
            ref={modalRef}
            style={{
              position: 'absolute',
              top: position.y,
              left: position.x,
              transform: 'translate(-50%, -50%)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, false)}
            onTouchStart={(e) => handleMouseDown(e, false)}
          >
            <div className="css-editor-header">
              <h2>Tasarım Editörü</h2>
              <button onClick={handleCloseModal}>✕</button>
            </div>
            <div className="css-editor-content">
              <div className="css-editor-accordion">
                {/* Genel Ayarlar */}
                <div className="accordion-section">
                  <div className="accordion-title" onClick={() => toggleAccordion('genel')}>
                    <h3>Genel Ayarlar</h3>
                    <span>{openAccordion === 'genel' ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === 'genel' && (
                    <div className="accordion-body">
                      <div className="css-variable-group">
                        {/* Genel Arka Plan Gradient */}
                        <div className="css-variable-editor gradient-editor">
                          <label>Genel Arka Plan Gradient</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--general-bg-gradient']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--general-bg-gradient',
                                  e.target.value,
                                  parseGradient(cssVariables['--general-bg-gradient']).color2,
                                  parseGradient(cssVariables['--general-bg-gradient']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--general-bg-gradient']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--general-bg-gradient',
                                  parseGradient(cssVariables['--general-bg-gradient']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--general-bg-gradient']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Ana Oyun Başlat Butonu */}
                        <div className="css-variable-editor gradient-editor">
                          <label>Oyun Başlat Butonu Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--button-gradient']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--button-gradient',
                                  e.target.value,
                                  parseGradient(cssVariables['--button-gradient']).color2,
                                  parseGradient(cssVariables['--button-gradient']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--button-gradient']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--button-gradient',
                                  parseGradient(cssVariables['--button-gradient']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--button-gradient']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Oyun Başlat Butonu Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--button-text-color']}
                            onChange={(e) => handleVariableChange('--button-text-color', e.target.value)}
                          />
                        </div>

                        {/* Oyun Başlat Butonu Kenar Renkleri */}
                        <div className="css-variable-editor">
                          <label>Oyun Başlat Butonu Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--button-border-color']}
                            onChange={(e) => handleVariableChange('--button-border-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Oyun Başlat Butonu Hover Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--button-hover-border-color']}
                            onChange={(e) => handleVariableChange('--button-hover-border-color', e.target.value)}
                          />
                        </div>

                        {/* Title Ayarları */}
                        <div className="css-variable-editor">
                          <label>Kazı Başlık Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--title-color'] || '#FFFFFF'}
                            onChange={(e) => handleVariableChange('--title-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kazan Başlık Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--title-span-color'] || '#FFCC00'}
                            onChange={(e) => handleVariableChange('--title-span-color', e.target.value)}
                          />
                        </div>
                        {/* Shadow is not a color, leaving it out for color picker requests */}
                        {/* <div className="css-variable-editor">
                          <label>Başlık Gölge</label>
                          <input
                            type="text"
                            value={cssVariables['--title-shadow']}
                            onChange={(e) => handleVariableChange('--title-shadow', e.target.value)}
                          />
                        </div> */}

                      </div>
                    </div>
                  )}
                </div>
                {/* Header Ayarları */}
                <div className="accordion-section">
                  <div className="accordion-title" onClick={() => toggleAccordion('header')}>
                    <h3>Header Ayarları</h3>
                    <span>{openAccordion === 'header' ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === 'header' && (
                    <div className="accordion-body">
                      <div className="css-variable-group">
                        {/* Header Background */}
                        <div className="css-variable-editor gradient-editor">
                          <label>Header Background</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--header-background']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--header-background',
                                  e.target.value,
                                  parseGradient(cssVariables['--header-background']).color2,
                                  parseGradient(cssVariables['--header-background']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--header-background']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--header-background',
                                  parseGradient(cssVariables['--header-background']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--header-background']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Profile Ayarları */}
                        <h4>Profile</h4>
                        <div className="css-variable-editor">
                          <label>Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--profile-background']}
                            onChange={(e) => handleVariableChange('--profile-background', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--profile-text-color']}
                            onChange={(e) => handleVariableChange('--profile-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--profile-icon-color']}
                            onChange={(e) => handleVariableChange('--profile-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--profile-border-color']}
                            onChange={(e) => handleVariableChange('--profile-border-color', e.target.value)}
                          />
                        </div>

                        {/* Kazıma Hakkı Ayarları */}
                        <h4>Kazıma Hakkı</h4>
                        <div className="css-variable-editor">
                          <label>Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--shake-rights-background']}
                            onChange={(e) => handleVariableChange('--shake-rights-background', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--shake-rights-text-color']}
                            onChange={(e) => handleVariableChange('--shake-rights-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--shake-rights-icon-color']}
                            onChange={(e) => handleVariableChange('--shake-rights-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--shake-rights-border-color']}
                            onChange={(e) => handleVariableChange('--shake-rights-border-color', e.target.value)}
                          />
                        </div>

                        {/* Buton Kenar Renkleri */}
                        {/* Bu kısım zaten eklenmişti, şimdi diğer buton özelleştirmelerini ekliyoruz */}

                        {/* Hak Talep Et Butonu */}
                        <h4>Hak Talep Et Butonu</h4>
                        <div className="css-variable-editor gradient-editor">
                          <label>Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--rights-button-background']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--rights-button-background',
                                  e.target.value,
                                  parseGradient(cssVariables['--rights-button-background']).color2,
                                  parseGradient(cssVariables['--rights-button-background']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--rights-button-background']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--rights-button-background',
                                  parseGradient(cssVariables['--rights-button-background']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--rights-button-background']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--rights-button-text-color']}
                            onChange={(e) => handleVariableChange('--rights-button-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--rights-button-icon-color']}
                            onChange={(e) => handleVariableChange('--rights-button-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--rights-button-border-color']}
                            onChange={(e) => handleVariableChange('--rights-button-border-color', e.target.value)}
                          />
                        </div>


                        {/* Geçmiş Butonu */}
                        <h4>Geçmiş Butonu</h4>
                        <div className="css-variable-editor gradient-editor">
                          <label>Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-button-background']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--history-button-background',
                                  e.target.value,
                                  parseGradient(cssVariables['--history-button-background']).color2,
                                  parseGradient(cssVariables['--history-button-background']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-button-background']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--history-button-background',
                                  parseGradient(cssVariables['--history-button-background']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--history-button-background']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-button-text-color']}
                            onChange={(e) => handleVariableChange('--history-button-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-button-icon-color']}
                            onChange={(e) => handleVariableChange('--history-button-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-button-border-color']}
                            onChange={(e) => handleVariableChange('--history-button-border-color', e.target.value)}
                          />
                        </div>

                      </div>
                    </div>
                  )}
                </div>
                {/* Oyun Geçmişi Ayarları */}
                <div className="accordion-section">
                  <div className="accordion-title" onClick={() => toggleAccordion('history')}>
                    <h3>Oyun Geçmişi Ayarları</h3>
                    <span>{openAccordion === 'history' ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === 'history' && (
                    <div className="accordion-body">
                      <div className="css-variable-group">
                        <div className="css-variable-editor gradient-editor">
                          <label>İçerik Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-content-bg']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--history-content-bg',
                                  e.target.value,
                                  parseGradient(cssVariables['--history-content-bg']).color2,
                                  parseGradient(cssVariables['--history-content-bg']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-content-bg']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--history-content-bg',
                                  parseGradient(cssVariables['--history-content-bg']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--history-content-bg']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-border-color'] || 'rgba(255, 255, 255, 0.1)'}
                            onChange={(e) => handleVariableChange('--history-border-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Başlık Alanı Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--history-header-bg'] || 'rgba(255, 255, 255, 0.03)'}
                            onChange={(e) => handleVariableChange('--history-header-bg', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor gradient-editor">
                          <label>Başlık Gradient</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-title-gradient']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--history-title-gradient',
                                  e.target.value,
                                  parseGradient(cssVariables['--history-title-gradient']).color2,
                                  parseGradient(cssVariables['--history-title-gradient']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-title-gradient']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--history-title-gradient',
                                  parseGradient(cssVariables['--history-title-gradient']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--history-title-gradient']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Kapat Butonu Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--history-close-btn-bg'] || 'rgba(255, 255, 255, 0.1)'}
                            onChange={(e) => handleVariableChange('--history-close-btn-bg', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kapat Butonu Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-close-btn-color'] || '#fff'}
                            onChange={(e) => handleVariableChange('--history-close-btn-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-text-color'] || '#fff'}
                            onChange={(e) => handleVariableChange('--history-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Spinner Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-spinner-color'] || '#a78bfa'}
                            onChange={(e) => handleVariableChange('--history-spinner-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Boş Durum İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-empty-icon-color'] || 'rgba(255, 255, 255, 0.5)'}
                            onChange={(e) => handleVariableChange('--history-empty-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor gradient-editor">
                          <label>Oynamaya Başla Butonu Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-button-bg']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--history-button-bg',
                                  e.target.value,
                                  parseGradient(cssVariables['--history-button-bg']).color2,
                                  parseGradient(cssVariables['--history-button-bg']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--history-button-bg']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--history-button-bg',
                                  parseGradient(cssVariables['--history-button-bg']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--history-button-bg']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Oynamaya Başla Butonu Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-button-text'] || '#fff'}
                            onChange={(e) => handleVariableChange('--history-button-text', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Öğe Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--history-item-bg'] || 'rgba(255, 255, 255, 0.05)'}
                            onChange={(e) => handleVariableChange('--history-item-bg', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Öğe Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-item-border'] || 'rgba(255, 255, 255, 0.05)'}
                            onChange={(e) => handleVariableChange('--history-item-border', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kazanılan İkon Arka Plan</label>
                          <input
                            type="color"
                            value={cssVariables['--history-win-icon-bg'] || 'rgba(52, 211, 153, 0.2)'}
                            onChange={(e) => handleVariableChange('--history-win-icon-bg', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kazanılan İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-win-icon-color'] || '#34d399'}
                            onChange={(e) => handleVariableChange('--history-win-icon-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kazanılan İkon Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-win-icon-border'] || 'rgba(52, 211, 153, 0.3)'}
                            onChange={(e) => handleVariableChange('--history-win-icon-border', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kazanılan Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-win-text-color'] || '#34d399'}
                            onChange={(e) => handleVariableChange('--history-win-text-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Tarih Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--history-date-color'] || 'rgba(255, 255, 255, 0.5)'}
                            onChange={(e) => handleVariableChange('--history-date-color', e.target.value)}
                          />
                        </div>


                      </div>
                    </div>
                  )}
                </div>
                {/* Dialog Ayarları */}
                <div className="accordion-section">
                  <div className="accordion-title" onClick={() => toggleAccordion('dialog')}>
                    <h3>Dialog Ayarları</h3>
                    <span>{openAccordion === 'dialog' ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === 'dialog' && (
                    <div className="accordion-body">
                      <div className="css-variable-group">
                        <div className="css-variable-editor gradient-editor">
                          <label>Dialog Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--dialog-background']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--dialog-background',
                                  e.target.value,
                                  parseGradient(cssVariables['--dialog-background']).color2,
                                  parseGradient(cssVariables['--dialog-background']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--dialog-background']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--dialog-background',
                                  parseGradient(cssVariables['--dialog-background']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--dialog-background']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="css-variable-editor">
                          <label>Dialog Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-text-color']}
                            onChange={(e) => handleVariableChange('--dialog-text-color', e.target.value)}
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Dialog Kenar Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-border-color']}
                            onChange={(e) => handleVariableChange('--dialog-border-color', e.target.value)}
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Dialog Başlık Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-title-color']}
                            onChange={(e) => handleVariableChange('--dialog-title-color', e.target.value)}
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Kapat Butonu Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-close-button-color']}
                            onChange={(e) => handleVariableChange('--dialog-close-button-color', e.target.value)}
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Kapat Butonu Hover Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-close-button-hover']}
                            onChange={(e) => handleVariableChange('--dialog-close-button-hover', e.target.value)}
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Dialog Genişliği</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-width']}
                            onChange={(e) => handleVariableChange('--dialog-width', e.target.value)}
                            placeholder="90%"
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Maksimum Genişlik</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-max-width']}
                            onChange={(e) => handleVariableChange('--dialog-max-width', e.target.value)}
                            placeholder="400px"
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Kenar Yuvarlaklığı</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-border-radius']}
                            onChange={(e) => handleVariableChange('--dialog-border-radius', e.target.value)}
                            placeholder="15px"
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>İç Boşluk</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-padding']}
                            onChange={(e) => handleVariableChange('--dialog-padding', e.target.value)}
                            placeholder="2rem"
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Yazı Boyutu</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-message-font-size']}
                            onChange={(e) => handleVariableChange('--dialog-message-font-size', e.target.value)}
                            placeholder="1.2rem"
                          />
                        </div>

                        <div className="css-variable-editor">
                          <label>Yazı Kalınlığı</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-message-font-weight']}
                            onChange={(e) => handleVariableChange('--dialog-message-font-weight', e.target.value)}
                            placeholder="600"
                          />
                        </div>

                        {/* Dialog Durum Renkleri */}
                        <h4>Dialog Durum Renkleri</h4>
                        <div className="css-variable-editor">
                          <label> İkon Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-success-icon-color']}
                            onChange={(e) => handleVariableChange('--dialog-success-icon-color', e.target.value)}
                          />
                        </div>
                        {/* Dialog Buton Renkleri */}
                        <h4>Dialog Buton Renkleri</h4>
                        <div className="css-variable-editor gradient-editor">
                          <label>Dialog Buton Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--dialog-action-button-background']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--dialog-action-button-background',
                                  e.target.value,
                                  parseGradient(cssVariables['--dialog-action-button-background']).color2,
                                  parseGradient(cssVariables['--dialog-action-button-background']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--dialog-action-button-background']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--dialog-action-button-background',
                                  parseGradient(cssVariables['--dialog-action-button-background']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--dialog-action-button-background']).direction
                                )}
                              />
                            </div>
                            <div className="direction-select">
                              <span>Yön:</span>
                              <select
                                value={parseGradient(cssVariables['--dialog-action-button-background']).direction}
                                onChange={(e) => handleGradientChange(
                                  '--dialog-action-button-background',
                                  parseGradient(cssVariables['--dialog-action-button-background']).color1,
                                  parseGradient(cssVariables['--dialog-action-button-background']).color2,
                                  e.target.value
                                )}
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
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Dialog Buton Shadow</label>
                          <input
                            type="text"
                            value={cssVariables['--dialog-action-button-shadow'] || '0 4px 12px rgba(52, 211, 153, 0.2)'}
                            onChange={(e) => handleVariableChange('--dialog-action-button-shadow', e.target.value)}
                            placeholder="0 4px 12px rgba(52, 211, 153, 0.2)"
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Dialog Buton Yazı Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-action-button-color'] || '#FFA500'}
                            onChange={(e) => handleVariableChange('--dialog-action-button-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Dialog Buton Kenarlık Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--dialog-action-button-border'] || '#FFA500'}
                            onChange={(e) => handleVariableChange('--dialog-action-button-border', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Kazı Kazan Kartı Ayarları */}
                <div className="accordion-section">
                  <div className="accordion-title" onClick={() => toggleAccordion('card')}>
                    <h3>Kazı Kazan Kartı Ayarları</h3>
                    <span>{openAccordion === 'card' ? '▲' : '▼'}</span>
                  </div>
                  {openAccordion === 'card' && (
                    <div className="accordion-body">
                      <div className="css-variable-group">
                        {/* Kart Genel Ayarları */}
                        <div className="css-variable-editor">
                          <label>Kart Genişliği</label>
                          <input
                            type="text"
                            value={cssVariables['--card-width'] || '150px'}
                            onChange={(e) => handleVariableChange('--card-width', e.target.value)}
                            placeholder="150px"
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kart Yüksekliği</label>
                          <input
                            type="text"
                            value={cssVariables['--card-height'] || '150px'}
                            onChange={(e) => handleVariableChange('--card-height', e.target.value)}
                            placeholder="150px"
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kart Kenar Yuvarlaklığı</label>
                          <input
                            type="text"
                            value={cssVariables['--card-border-radius'] || '12px'}
                            onChange={(e) => handleVariableChange('--card-border-radius', e.target.value)}
                            placeholder="12px"
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Kart Gölgesi</label>
                          <input
                            type="text"
                            value={cssVariables['--card-box-shadow'] || '0 8px 16px rgba(0,0,0,0.1)'}
                            onChange={(e) => handleVariableChange('--card-box-shadow', e.target.value)}
                            placeholder="0 8px 16px rgba(0,0,0,0.1)"
                          />
                        </div>

                        {/* Kart İçerik Ayarları */}
                        <div className="css-variable-editor gradient-editor">
                          <label>Kart İçerik Arka Plan</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--card-content-bg']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--card-content-bg',
                                  e.target.value,
                                  parseGradient(cssVariables['--card-content-bg']).color2,
                                  parseGradient(cssVariables['--card-content-bg']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--card-content-bg']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--card-content-bg',
                                  parseGradient(cssVariables['--card-content-bg']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--card-content-bg']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Ödül Metni Ayarları */}
                        <div className="css-variable-editor">
                          <label>Ödül Metin Boyutu</label>
                          <input
                            type="text"
                            value={cssVariables['--reward-text-size'] || '28px'}
                            onChange={(e) => handleVariableChange('--reward-text-size', e.target.value)}
                            placeholder="28px"
                          />
                        </div>
                        <div className="css-variable-editor gradient-editor">
                          <label>Ödül Metin Gradient</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--reward-text-gradient']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--reward-text-gradient',
                                  e.target.value,
                                  parseGradient(cssVariables['--reward-text-gradient']).color2,
                                  parseGradient(cssVariables['--reward-text-gradient']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--reward-text-gradient']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--reward-text-gradient',
                                  parseGradient(cssVariables['--reward-text-gradient']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--reward-text-gradient']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Ödül Metin Gölgesi</label>
                          <input
                            type="text"
                            value={cssVariables['--reward-text-shadow'] || '2px 2px 4px rgba(0,0,0,0.1)'}
                            onChange={(e) => handleVariableChange('--reward-text-shadow', e.target.value)}
                            placeholder="2px 2px 4px rgba(0,0,0,0.1)"
                          />
                        </div>

                        {/* Kazıma Alanı Ayarları */}
                        <div className="css-variable-editor gradient-editor">
                          <label>Kazıma Alanı Gradient</label>
                          <div className="gradient-controls">
                            <div className="color-picker-group">
                              <span>Renk 1:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--scratch-area-gradient']).color1}
                                onChange={(e) => handleGradientChange(
                                  '--scratch-area-gradient',
                                  e.target.value,
                                  parseGradient(cssVariables['--scratch-area-gradient']).color2,
                                  parseGradient(cssVariables['--scratch-area-gradient']).direction
                                )}
                              />
                            </div>
                            <div className="color-picker-group">
                              <span>Renk 2:</span>
                              <input
                                type="color"
                                value={parseGradient(cssVariables['--scratch-area-gradient']).color2}
                                onChange={(e) => handleGradientChange(
                                  '--scratch-area-gradient',
                                  parseGradient(cssVariables['--scratch-area-gradient']).color1,
                                  e.target.value,
                                  parseGradient(cssVariables['--scratch-area-gradient']).direction
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="css-variable-editor">
                          <label>Soru İşareti Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--question-mark-color'] || 'rgba(255, 255, 255, 0.2)'}
                            onChange={(e) => handleVariableChange('--question-mark-color', e.target.value)}
                          />
                        </div>
                        <div className="css-variable-editor">
                          <label>Köşe Süs Rengi</label>
                          <input
                            type="color"
                            value={cssVariables['--corner-decoration-color'] || 'rgba(255, 255, 255, 0.1)'}
                            onChange={(e) => handleVariableChange('--corner-decoration-color', e.target.value)}
                          />
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSvgModal && (
        <div className="css-editor-overlay">
          <div
            className="css-editor-modal"
            ref={svgModalRef}
            style={{
              position: 'absolute',
              top: svgPosition.y,
              left: svgPosition.x,
              transform: 'translate(-50%, -50%)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={(e) => handleMouseDown(e, true)}
            onTouchStart={(e) => handleMouseDown(e, true)}
          >
            <div className="css-editor-header">
              <h2>Kazı Kazan Editörü</h2>
              <button onClick={handleCloseSvgModal}>✕</button>
            </div>
            <div className="css-editor-content">
              <h3>Kart Ayarları</h3>
              <div className="css-variable-group">
                {/* Kazıma Alanı Ayarları */}
                <div className="css-variable-editor gradient-editor">
                  <label>Kazıma Alanı Rengi</label>
                  <div className="gradient-controls">
                    <div className="color-picker-group">
                      <span>Renk 1:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--scratch-area-gradient']).color1}
                        onChange={(e) => handleGradientChange(
                          '--scratch-area-gradient',
                          e.target.value,
                          parseGradient(cssVariables['--scratch-area-gradient']).color2,
                          parseGradient(cssVariables['--scratch-area-gradient']).direction
                        )}
                      />
                    </div>
                    <div className="color-picker-group">
                      <span>Renk 2:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--scratch-area-gradient']).color2}
                        onChange={(e) => handleGradientChange(
                          '--scratch-area-gradient',
                          parseGradient(cssVariables['--scratch-area-gradient']).color1,
                          e.target.value,
                          parseGradient(cssVariables['--scratch-area-gradient']).direction
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="css-variable-editor">
                  <label>Soru İşareti Rengi</label>
                  <input
                    type="color"
                    value={cssVariables['--question-mark-color'] || 'rgba(255, 255, 255, 0.2)'}
                    onChange={(e) => handleVariableChange('--question-mark-color', e.target.value)}
                  />
                </div>

                <div className="css-variable-editor">
                  <label>Köşe Süs Rengi</label>
                  <input
                    type="color"
                    value={cssVariables['--corner-decoration-color'] || 'rgba(255, 255, 255, 0.1)'}
                    onChange={(e) => handleVariableChange('--corner-decoration-color', e.target.value)}
                  />
                </div>

                <div className="css-variable-editor gradient-editor">
                  <label>Kart İçerik Arka Plan</label>
                  <div className="gradient-controls">
                    <div className="color-picker-group">
                      <span>Renk 1:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--card-content-bg']).color1}
                        onChange={(e) => handleGradientChange(
                          '--card-content-bg',
                          e.target.value,
                          parseGradient(cssVariables['--card-content-bg']).color2,
                          parseGradient(cssVariables['--card-content-bg']).direction
                        )}
                      />
                    </div>
                    <div className="color-picker-group">
                      <span>Renk 2:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--card-content-bg']).color2}
                        onChange={(e) => handleGradientChange(
                          '--card-content-bg',
                          parseGradient(cssVariables['--card-content-bg']).color1,
                          e.target.value,
                          parseGradient(cssVariables['--card-content-bg']).direction
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="css-variable-editor gradient-editor">
                  <label>Ödül Metin Rengi</label>
                  <div className="gradient-controls">
                    <div className="color-picker-group">
                      <span>Renk 1:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--reward-text-gradient']).color1}
                        onChange={(e) => handleGradientChange(
                          '--reward-text-gradient',
                          e.target.value,
                          parseGradient(cssVariables['--reward-text-gradient']).color2,
                          parseGradient(cssVariables['--reward-text-gradient']).direction
                        )}
                      />
                    </div>
                    <div className="color-picker-group">
                      <span>Renk 2:</span>
                      <input
                        type="color"
                        value={parseGradient(cssVariables['--reward-text-gradient']).color2}
                        onChange={(e) => handleGradientChange(
                          '--reward-text-gradient',
                          parseGradient(cssVariables['--reward-text-gradient']).color1,
                          e.target.value,
                          parseGradient(cssVariables['--reward-text-gradient']).direction
                        )}
                      />
                    </div>
                  </div>

                </div>
              </div>
              <div className="color-picker-group">
                <label style={{color: 'white'}}>Ödül Metni</label>
                <input type='text' style={{width: '100%'}} className='form-control' name='rewardtitle' value={rewardTitle} onChange={(e) => setRewardTitle(e.target.value)} />
                <button className='btn btn-primary' onClick={handleSaveRewardTitle}>Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diyalog Kutusu */}
      <Dialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onClose={() => setDialog({ isOpen: false, message: '' })}
      />
    </div>
  )
}
