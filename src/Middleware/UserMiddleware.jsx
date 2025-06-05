import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar';
import "../App.css"
import { UserProvider } from '../contexts/UserContext';
import { getConfig, getUser, getGameData } from '../services/userServices';
import NotFound from '../components/NotFound';
import Loading from '../components/Loading';
import { CssEditorProvider } from '../contexts/CssEditorContext';
import { getCss } from '../services/userServices';
import config from '../config';
import OpenCase from '../components/OpenCase';

export default function UserMiddleware() {
  const { userid } = useParams();
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadedCss, setLoadedCss] = useState(null);
  const [rewards, setRewards] = useState(null);

  useEffect(() => {
    const Control = async () => {
      try {
        const response = await getConfig(config.apigameid);
        const userResponse = await getUser(response.spinWheelId, userid);
        if (userResponse.status === false) {
          setIsUser(false);
        } else {
          setIsUser(true);
        }

        // Ödülleri çek
        const gameData = await getGameData(response.spinWheelId);
        // Beklenen format: [{name, rarity}, ...]
        let rewardList = [];
        if (gameData && Array.isArray(gameData.rewards)) {
          rewardList = gameData.rewards.map(item => ({
            name: item.name || item.title || 'Ödül',
            rarity: item.rarity || 'blue',
          }));
        }
        setRewards(rewardList);

        const cssResponse = await getCss(response.spinWheelId);
        if (cssResponse && typeof cssResponse === 'object' && Object.keys(cssResponse).length > 0) {
          setLoadedCss(cssResponse);
        } else {
          console.warn('No saved CSS settings found or unexpected response format in Middleware.', cssResponse);
        }

      } catch (error) {
        console.error('Error in UserMiddleware Control:', error);
        setIsUser(false);
      } finally {
        setLoading(false);
      }
    }

    Control();
  }, [userid]);

  if (loading) {
    return <Loading />
  }

  if (isUser === false) {
    return <NotFound />
  }

  return (
    <CssEditorProvider initialCss={loadedCss}>
      <UserProvider id={userid}>
        <div className="App">
          <Navbar />
          <div className='general-container'>
            <img src={config.imgUrl} className='logo' alt='' />
            <h1 className="title">
              <span style={{ color: 'var(--title-color, #FFFFFF)' }}>Kazı</span>
              <span style={{ color: 'var(--title-span-color, #FFCC00)' }}> & Kazan!</span>
            </h1>
            <OpenCase />
          </div>
        </div>
      </UserProvider>
    </CssEditorProvider>
  )
}
