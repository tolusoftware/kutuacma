import React, { createContext, useEffect, useState } from 'react'
import { getConfig, getUser, getUserHistory } from "../services/userServices";
import "../App.css";
import config  from '../config';


export const UserContext = createContext();

export const UserProvider = ({ children, id }) => {
    const [user, setUser] = useState();
    const [isUser, setIsUser] = useState();
    const [userHistory, setUserHistory] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const [getScratchConfig, setScratchConfig] = useState();

   


    const getGameConfig = async () => {
        try {
            console.log("api game id",config.apigameid);
            
            const response = await getConfig(config.apigameid);

            const userResponse = await getUser(response.spinWheelId, id);
            const userHistoryResponse = await getUserHistory(response.spinWheelId, id);


            if (userResponse.status !== false) {
                setUser(userResponse.data);
                setUserHistory(userHistoryResponse.data);
                setScratchConfig(response);
                setIsUser(true);
            } else {
                setIsUser(false);
            }
        } catch (error) {
            console.error("Error fetching game config or user data:", error);
            setIsUser(false);
        }
    };

    useEffect(() => {
        getGameConfig();
    }, [id]);

    const refreshUser = async () => {
        await getGameConfig();
    };

    return (
        <UserContext.Provider value={{ user, isUser, userHistory, isLogin, setIsLogin, refreshUser,id,getScratchConfig }}>
            {children}
        </UserContext.Provider>
    );

};
