import React, { useState, useContext, useEffect } from 'react';
import './OpenCase.css';
import { getGameData, startGame } from '../services/userServices';
import { UserContext } from '../contexts/UserContext';
import Dialog from './Dialog';

export default function OpenCase() {
  const { id, getScratchConfig, user, setUser } = useContext(UserContext);
  const [rollerItems, setRollerItems] = useState([]);
  const [rolled, setRolled] = useState("rolling");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [otherrewards, setOtherRewards] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showRewardsDialog, setShowRewardsDialog] = useState(false);
  const [winReward, setWinReward] = useState(null);

  // Alınabilecek ödülleri sayfa yüklenince çek
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        if (!getScratchConfig?.spinWheelId) return;
        const data = await getGameData(getScratchConfig.spinWheelId);
        console.log("API Response:", data);
        
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
    const winningIndex = 80;
    for (let i = 0; i < 101; i++) {
      let rewardName = rewards[Math.floor(Math.random() * rewards.length)];
      temp.push({
        name: rewardName,
        id: i
      });
    }



    temp[winningIndex].name = win;
    console.log("temp", temp);
    setRollerItems(temp);
    console.log("Animasyon BAŞLANGICI: Gösterge altındaki index:", winningIndex, "Ad:", temp[winningIndex].name);
    setTimeout(() => {
      setRolled(win);
      setLoading(false);
      console.log("Animasyon BİTİŞİ: Gösterge altındaki index:", winningIndex, "Ad:", temp[winningIndex].name);
      setShowDialog(true);
    }, 8700);
  };

  return (
    <div>
      {!opened ? (
        <div>
          <img src="/kutu.png" alt="Kutu" onClick={() => setOpened(true)} style={{ cursor: "pointer" }} />
        </div>
      ) : (
        <>
          <div className="general-container">
            <div className="raffle-roller">
              <div className="raffle-roller-holder">
                <div
                  className="raffle-roller-container"
                  style={{ marginLeft: rollerItems.length > 0 ? "-6800px" : "0px" }}
                >
                  {rollerItems.map((item, index) => (
                    <div
                      key={index}
                      className={`item class_red_item ${item.winning ? "winning-item" : ""}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 18 }}
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
              <button className="open-case-btn" onClick={generate} disabled={loading}>
                {loading ? "Yükleniyor..." : "Başla"}
              </button>
              <button className="info-btn" onClick={() => setShowRewardsDialog(true)}>
                <span style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 'bold' }}>?</span>
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
        </>
      )}
    </div>
  );
}
