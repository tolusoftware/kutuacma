const handleStart = () => {
  if (!rewards || rewards.length === 0) return;

  setIsRolling(true);
  setStep('rolling');
  setSelectedReward(null);
  setBackendReward(null);
  setAnimationDone(false);
  setPendingBackendReward(true);

  // 1. Animasyon için rollerRewards'ı rewards ile doldur
  const rewardsArr = [...rewards];
  setRollerRewards(rewardsArr);
  setFinalIndex(rewardsArr.length - Math.ceil(ROLLER_VISIBLE / 2) - 1);
  setRollerPos(0);

  // 2. API çağrısını başlat
  startGame(getScratchConfig.spinWheelId, userid)
    .then(result => {
      const win = result?.data?.win;
      setBackendReward(win);
      setPendingBackendReward(false);
    })
    .catch(() => {
      setBackendReward(null);
      setError('Ödül alınırken hata oluştu.');
      setPendingBackendReward(false);
    });
}; 