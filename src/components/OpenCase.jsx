import React, { useState, useRef, useEffect, useContext } from 'react';
import './OpenCase.css'; // CSS dosyasını ayrıca oluşturacağım
import { getGameData, startGame } from '../services/userServices';
import { UserContext } from '../contexts/UserContext';

const RARITY_COLORS = {
  blue: '#4b69ff',
  purple: '#8847ff',
  pink: '#d32ce6',
  red: '#eb4b4b',
  gold: '#ffd700',
};

const ROLLER_VISIBLE = 7; // Ortada 7 kutucuk görünsün
const BOX_WIDTH = 140; // px

export default function OpenCase() {
  const { getScratchConfig,id:userid } = useContext(UserContext);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState('closed'); // 'closed', 'rolling', 'result'
  const [selectedReward, setSelectedReward] = useState(null);
  const [rollerRewards, setRollerRewards] = useState([]);
  const [rollerPos, setRollerPos] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [finalIndex, setFinalIndex] = useState(0);
  const [backendReward, setBackendReward] = useState(null);
  const [animationDone, setAnimationDone] = useState(false);
  const rollerRef = useRef();

  // Ödülleri çek
  useEffect(() => {
    const fetchRewards = async () => {
        
      setLoading(true);
      setError(null);
      try {
        if (!getScratchConfig || !getScratchConfig.spinWheelId) {
          setRewards([]);
          setLoading(false);
          return;
        }
        const gameData = await getGameData(getScratchConfig.spinWheelId);
        console.log("gameData:", gameData);
        let rewardList = [];
        let segments = Array.isArray(gameData) ? gameData : (Array.isArray(gameData?.segments) ? gameData.segments : []);
        if (segments.length > 0) {
          if (typeof segments[0] === 'string') {
            rewardList = segments.map(str => ({
              name: str,
              rarity: 'blue',
            }));
          } else if (typeof segments[0] === 'object' && segments[0] !== null) {
            rewardList = segments.map(item => ({
              name: item.name || item.title || 'Ödül',
              rarity: item.rarity || 'blue',
            }));
          } else {
            rewardList = segments.map(item => ({
              name: String(item),
              rarity: 'blue',
            }));
          }
        }
        console.log("rewardList:", rewardList);
        setRewards(rewardList);
      } catch (err) {
        setError('Ödüller yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
    // eslint-disable-next-line
  }, [getScratchConfig]);

  // Kutuya tıklayınca veya butona basınca animasyonu başlat
  const handleStart = () => {
    if (!rewards || rewards.length === 0) return;

    setIsRolling(true);
    setStep('rolling');
    setSelectedReward(null);
    setBackendReward(null);
    setAnimationDone(false);

    // 1. Animasyon için rollerRewards'ı rewards ile doldur
    const rewardsArr = [...rewards, ...rewards, ...rewards, ...rewards]; // 4 kez tekrarla
    setRollerRewards(rewardsArr);

    // 2. API çağrısını başlat
    startGame(getScratchConfig.spinWheelId, userid)
      .then(result => {
        const win = result?.data?.win;
        setBackendReward(win);
        
        // 5 saniye sonra sonucu göster ama animasyon devam etsin
        setTimeout(() => {
          setStep('result');
          // Backend'den gelen ödülü bul
          const winReward = rewards.find(r => r.name === win);
          setSelectedReward(winReward);
        }, 5000);
      })
      .catch(() => {
        setBackendReward(null);
        setError('Ödül alınırken hata oluştu.');
      });
  };

  // Roller animasyonu
  useEffect(() => {
    if (step !== 'rolling' || !isRolling) return;

    const rollerElement = document.querySelector('.roller-strip-inner');
    if (!rollerElement) return;

    rollerElement.style.animation = 'none';
    rollerElement.style.animation = 'rolling 1.5s linear';

    return () => {
      if (rollerElement) {
        rollerElement.style.animation = 'none';
      }
    };
  }, [step, isRolling]);

  // Sonucu gösterme
  useEffect(() => {
    if (animationDone && backendReward !== null) {
      // Sadece backend'den dönen ödülü göster
      let winReward = rewards.find(r => r.name === backendReward);
      console.log("winReward:", winReward);
      setSelectedReward(winReward);
      setStep('result');
      setAnimationDone(false); // tekrar açma için
    }
  }, [animationDone, backendReward, rewards]);

  const handleRestart = () => {
    setStep('closed');
    setSelectedReward(null);
    setRollerRewards([]);
    setRollerPos(0);
    setIsRolling(false);
  };

  if (loading) {
    return <div className="csgo-case-container"><div>Ödüller yükleniyor...</div></div>;
  }
  if (error) {
    return <div className="csgo-case-container"><div>{error}</div></div>;
  }
  if (!rewards || rewards.length === 0) {
    return <div className="csgo-case-container"><div>Bu kutuda hiç ödül yok.</div></div>;
  }

  return (
    <div className="csgo-case-container">
      {(step === 'closed') && (
        <>
          <div className="case-top-area">
            <div className="case-box-static">
              <img src="/kutu.png" alt="Kutu" className="case-image" />
              <div className="case-title">Bravo Case</div>
            </div>
            <button className="continue-btn" onClick={handleStart}>Continue</button>
          </div>
          <div className="case-items-area">
            <div className="case-items-title">Items that might be in this case:</div>
            <div className="case-items-grid">
              {rewards.map((r, i) => (
                <div key={i} className="case-item-box" style={{ background: RARITY_COLORS[r.rarity] }}>
                  <span className="case-item-name">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {step === 'rolling' && (
        <div className="case-rolling-roller">
          <div className="roller-strip-outer">
            <div className={`roller-strip-inner ${isRolling ? 'rolling' : ''}`}>
              {rollerRewards.map((r, i) => (
                <div key={i} className="roller-reward-box" style={{ background: RARITY_COLORS[r.rarity], width: BOX_WIDTH }}>
                  <span className="roller-reward-name">{r.name}</span>
                </div>
              ))}
            </div>
            <div className="roller-indicator">▼</div>
          </div>
        </div>
      )}
      {step === 'result' && selectedReward && (
        <div className="case-result">
          <div className="result-label">Kazandığın Ödül</div>
          <div className="result-reward" style={{ background: RARITY_COLORS[selectedReward.rarity] }}>
            {selectedReward.name}
          </div>
          <button className="restart-btn" onClick={handleRestart}>Tekrar Aç</button>
        </div>
      )}
    </div>
  );
}
