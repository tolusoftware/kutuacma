import React, { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react';
import './OpenCase.css';
import { getGameData, startGame } from '../services/userServices';
import { UserContext } from '../contexts/UserContext';
import Dialog from './Dialog';
import AdminLogin from './AdminLogin';
import CssEditor from './CssEditor';
import { CssEditorContext } from '../contexts/CssEditorContext';



const WINNING_INDEX = 80;

// Responsive değerleri JS'de state olarak tut
const getResponsiveValues = () => {
  const width = window.innerWidth;
  if (width <= 480) {
    return { ITEM_WIDTH: 55, ITEM_MARGIN_LEFT: 3, ITEM_FONT_SIZE: 12 };
  } else if (width <= 768) {
    return { ITEM_WIDTH: 70, ITEM_MARGIN_LEFT: 5, ITEM_FONT_SIZE: 14 };
  } else {
    return { ITEM_WIDTH: 85, ITEM_MARGIN_LEFT: 5, ITEM_FONT_SIZE: 18 };
  }
};

export default function OpenCase() {
  const { id, getScratchConfig, user, setUser, isLogin } = useContext(UserContext);
  const [rollerItems, setRollerItems] = useState([]);
  const [rolled, setRolled] = useState("rolling");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [otherrewards, setOtherRewards] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showRewardsDialog, setShowRewardsDialog] = useState(false);
  const [winReward, setWinReward] = useState(null);
  const holderRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900); // varsayılan genişlik
  const [responsive, setResponsive] = useState(getResponsiveValues());
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { cssVariables } = useContext(CssEditorContext);
  const [noSpinDialog, setNoSpinDialog] = useState(false);



  const adminRoute =  () => {
    return window.location.pathname.includes("/admin");
  }

  const handleAdminLogin = () => {
    setIsAdminLogin(false);
};


  useEffect(() => {
    if (adminRoute()) {
      setIsAdminLogin(true);
    }
  }, []);

  // Responsive değerleri güncelle
  useEffect(() => {
    const handleResize = () => {
      setResponsive(getResponsiveValues());
      if (holderRef.current) {
        setContainerWidth(holderRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // ilk yüklemede de çalışsın
    return () => window.removeEventListener('resize', handleResize);
  }, [opened]);

  useLayoutEffect(() => {
    if (holderRef.current) {
      setContainerWidth(holderRef.current.offsetWidth);
    }
  }, [opened]);

  // Alınabilecek ödülleri sayfa yüklenince çek
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        if (!getScratchConfig?.spinWheelId) return;
        const data = await getGameData(getScratchConfig.spinWheelId);

        // API yanıtını kontrol et ve uygun şekilde işle
        if (data && typeof data === 'object') {
          if (Array.isArray(data)) {
            setOtherRewards(data);
          } else if (Array.isArray(data.segments)) {
            setOtherRewards(data.segments);
          } else if (Array.isArray(data.rewards)) {
            setOtherRewards(data.rewards);
          } else {
            console.warn("API response format is not as expected:", data);
            setOtherRewards([]);
          }
        } else {
          console.warn("Invalid API response:", data);
          setOtherRewards([]);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
        setOtherRewards([]);
      }
    };
    fetchRewards();
  }, [getScratchConfig]);

  const generate = async () => {
    // Kullanıcının spin hakkı yoksa dialog göster
    if (!user || typeof user.spin_count !== 'number' || user.spin_count <= 0) {
      setNoSpinDialog(true);
      return;
    }
    setLoading(true);
    // 1. Ödülleri çek
    const data = await getGameData(getScratchConfig.spinWheelId);
    let rewards = Array.isArray(data) ? data : (Array.isArray(data?.segments) ? data.segments : []);
    if (!rewards.length) {
      setLoading(false);
      return;
    }
    // 2. Kazananı çek
    const result = await startGame(getScratchConfig.spinWheelId, id);
    const win = result?.data?.win;
    setWinReward(win);
    // 3. 101 kutuluk bir şerit oluştur
    const temp = [];
    for (let i = 0; i < 101; i++) {
      let rewardName = rewards[Math.floor(Math.random() * rewards.length)];
      temp.push({
        name: rewardName,
        id: i
      });
    }

    temp[WINNING_INDEX].name = win;
    setRollerItems(temp);
    setTimeout(() => {
      setRolled(win);
      setLoading(false);
      setShowDialog(true);
    }, 8700);
  };

  return (
    <div>
      {!opened ? (
        <div>
          <img src="/kutu.png" alt="Kutu" onClick={() => setOpened(true)} className='kutu-img' />
        </div>
      ) : (
        <>
          <div className="general-container">
            <div className="raffle-roller">
              <div className="raffle-roller-holder" ref={holderRef}>
                <div
                  className="raffle-roller-container"
                  style={{
                    marginLeft: rollerItems.length > 0
                      ? `calc(${containerWidth - (responsive.ITEM_WIDTH * 20) - (responsive.ITEM_MARGIN_LEFT * 20)}px)`
                      : "0px",
                    background: cssVariables['--roller-container-bg']
                  }}
                >
                  {rollerItems.map((item, index) => (
                    <div
                      key={index}
                      className={`item class_red_item ${item.winning ? "winning-item" : ""}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: responsive.ITEM_FONT_SIZE }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
                <div className="indicator-line"></div>
              </div>
            </div>
          </div>
          <center>
            <div className="button-container">
              <button
                className="open-case-btn"
                onClick={generate}
                disabled={loading}
                style={{
                  background: cssVariables['--button-gradient'],
                  color: cssVariables['--button-text-color'],
                  border: `2px solid ${cssVariables['--button-border-color']}`
                }}
              >
                {loading ? "Yükleniyor..." : "Başla"}
              </button>
              <button
                className="info-btn"
                onClick={() => setShowRewardsDialog(true)}
                style={{
                  background: cssVariables['--info-btn-bg'],
                  color: cssVariables['--info-btn-color'],
                  border: `2px solid ${cssVariables['--info-btn-border']}`
                }}
              >
                <span style={{ color: cssVariables['--info-btn-color'], fontSize: '1.4rem', fontWeight: 'bold' }}>?</span>
              </button>
            </div>
          </center>
          <br />
          <Dialog
            isOpen={showDialog}
            onClose={() => {
              setShowDialog(false);
              setOpened(false);
              setRollerItems([]);
              setRolled("rolling");
              setLoading(false);
              if (user && typeof user.spin_count === 'number' && typeof setUser === 'function') {
                setUser({ ...user, spin_count: Math.max(0, user.spin_count - 1) });
              }
            }}
            message={winReward ? `Kazandığınız ödül: ${winReward}` : ''}
            type="win"
            actionButtonText="Ödülü Al!"
            title="Tebrikler!"
          />
          <Dialog
            isOpen={showRewardsDialog}
            onClose={() => setShowRewardsDialog(false)}
            type="rewards"
            title="Ödüller"
            variant="small"
          >
            <div className="modern-prize-list">
              {otherrewards && otherrewards.length > 0 ? (
                otherrewards.map((reward, i) => (
                  <div key={i} className="modern-prize-item">
                    {reward.name || reward}
                  </div>
                ))
              ) : (
                <div>Ödül bulunamadı</div>
              )}
            </div>
          </Dialog>
          {/* Kutu açma hakkı yoksa gösterilecek dialog */}
          <Dialog
            isOpen={noSpinDialog}
            onClose={() => setNoSpinDialog(false)}
            message="Kutu açma hakkınız kalmamıştır."
            type="error"
            title="Uyarı"
            actionButtonText="Tamam"
          />
        </>
      )}
      {isAdminLogin && (<AdminLogin onLogin={() => handleAdminLogin(false)} onClose={() => setIsAdminLogin(false)} />)}
      {isLogin && (<CssEditor />)}

    </div>
  );
}
