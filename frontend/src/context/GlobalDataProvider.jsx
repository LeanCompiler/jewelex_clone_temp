import React, { createContext, useState, useEffect } from "react";
import {
  getItemWithExpiry,
  setItemWithExpiry,
} from "../utils/localStorageHandler.js";

const GlobalDataContext = createContext({});

export const GlobalDataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState(() => {
    const storedAuth = {
      userId: getItemWithExpiry("userId"),
    };

    return storedAuth;
  });

  useEffect(() => {
    setItemWithExpiry("userId", globalData.userId);
  }, [globalData]);

  return (
    <GlobalDataContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export default GlobalDataContext;
