import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageOption, LANGUAGE_OPTIONS } from '../types/language';
import { TRANSLATIONS, Translations } from '../translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  currentLanguageOption: LanguageOption;
  isRTL: boolean;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('voya_language');
      if (saved && LANGUAGE_OPTIONS.some((opt) => opt.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // Fallback
    }
    return 'en-GB';
  });

  const currentLanguageOption = 
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];
  const isRTL = currentLanguageOption.direction === 'rtl';

  useEffect(() => {
    try {
      localStorage.setItem('voya_language', language);
    } catch {
      // ignore
    }
    // Update document element attributes for screen readers & CSS layout
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['en-GB'];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        isRTL,
        availableLanguages: LANGUAGE_OPTIONS,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
