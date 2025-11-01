import React, { createContext, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "ru";

const initialState = {
  language: "en" as Language,
  setLanguage: (_value: Language) => {}
};

export const LanguageContext = createContext(initialState);

interface LanguageProviderProps {
  children: React.ReactNode,
  storageName: string
}

export function LanguageProvider({children, storageName}: LanguageProviderProps) {
  const [language, _setLanguage] = useState(initialState.language);
  const {i18n} = useTranslation();
  
  useLayoutEffect(() => {
    const saved = getLanguage();
    const newLanguage = (saved ?? initialState.language) as Language;
    setLanguage(newLanguage);
  }, []);
  
  function setLanguage(value: Language) {
    _setLanguage(value);
    i18n.changeLanguage(value);
    saveLanguage(value);
  }

  function getLanguage() {
    return localStorage.getItem(storageName);
  }

  function saveLanguage(value?: Language) {
    localStorage.setItem(storageName, value ?? language);
  }
  
  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  )
}
