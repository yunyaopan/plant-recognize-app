'use client';

import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50 transition-colors"
    >
      {i18n.language === 'en' ? '中文' : 'English'}
    </button>
  );
}