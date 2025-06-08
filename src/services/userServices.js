import axios from 'axios';
import config from '../config';

export const getConfig = async (gameid) => {
    const configReq = {
        process_id: "get-cark-config",
        user_id: gameid,
        recaptcha: "test",
    }

    const response = await axios.post(config.apiAdvanceUrl, configReq);
    return await response.data;
}

export const getUser = async (carkid, userid) => {
    const getUserRequest = {
        cark_obj_id: carkid,
        user_id: userid
    }
    const response = await axios.post(config.apiBaseUrl, getUserRequest);
    return await response.data;
}
/** şimdilik boş */
export const getGameData = async (carkid) => {
    const getdata = {
        cark_obj_id:carkid
    }
    const getdataresponse = await axios.post(config.apiBaseUrlCarkData,getdata);
    return await getdataresponse.data;
}

export const startGame = async(carkid,userid) =>{
    const gameRequest = {
        cark_obj_id: carkid,
        user_id: userid
    }
    const getdataresponse = await axios.post(config.apiBaseUrlCevir,gameRequest);
    return await getdataresponse.data;
}



export const getUserHistory = async (carkid, userid) => {
    const getUser = {
        cark_obj_id: carkid,
        user_id: userid
    }
    const response = await axios.post(config.apiBaseUrl3, getUser);
    return await response.data;
}

export const adminLogin = async (username, password) => {
    const userLoginrequest = {
        username: username,
        password: password
    }
    
    const loginresponse = await axios.post(config.adminApi + "login", userLoginrequest);
    return await loginresponse.data;
}


export const setCss = async (cssdata,spinwhellId) =>{
    try {
        // Validate input data
        if (!cssdata || typeof cssdata !== 'object') {
          throw new Error('Invalid CSS data');
        }
    
        const setcss = {
          data: cssdata,
          cark_obj_id: spinwhellId,
        };
        
        
        
        const response = await axios.post(config.adminApi + "set_cark_css", JSON.stringify(setcss), { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
    
        
        // Check if response exists and has data
        if (!response || !response.data) {
          throw new Error('Invalid API response');
        }
    
        // Return success response
        return {
          success: true,
          message: 'CSS başarıyla güncellendi',
          data: response.data
        };
    
      } catch (error) {
        console.error('CSS update error:', error);
        
        // Return error response
        return {
          success: false,
          message: error.response?.data?.message || error.message || 'CSS güncellenirken bir hata oluştu'
        };
      }
    
}

export const getCss = async (spinwhellId) =>{
    const getcss ={
        process_id: "get-cark-css",
        user_id: spinwhellId,
        recaptcha: "test",  
    }
    const responsegetcss = await axios.post(config.apiAdvanceUrl,getcss);
    
    return await responsegetcss.data;
}

export const updateGameUpdates = async (carkid,rewardtitle,subdomain) =>{
    const updateGameUpdatesRequest = {
        id: parseInt(carkid),
        name: rewardtitle,
        subdomain: subdomain
    }
    const responseupdategameupdates = await axios.post(config.adminApi + "update_cark_objects",updateGameUpdatesRequest);
    return await responseupdategameupdates.data;
}