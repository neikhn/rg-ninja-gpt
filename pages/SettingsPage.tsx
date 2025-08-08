import React from 'react';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useChat } from '../contexts/ChatContext';
import type { Locale } from '../types';
import { SunIcon, MoonIcon, TrashIcon } from '../components/icons/Icons';

/**
 * A page for managing application settings, such as theme and data.
 */
const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useAppSettings();
  const { locale, setLocale, t } = useLanguage();
  const { chatSessions, deleteSession } = useChat();

  /**
   * Clears all saved chat history from localStorage.
   */
  const handleClearAllChatHistory = () => {
    if (window.confirm(t('settings.data.clearHistoryConfirmation'))) {
      chatSessions.forEach(session => deleteSession(session.id));
      alert(t('settings.data.clearHistorySuccess'));
    }
  };
  
  const handleSetLocale = (lang: Locale) => {
    setLocale(lang);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('settings.title')}</h1>
      
      {/* Theme Settings Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{t('settings.theme.title')}</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">{t('settings.theme.description')}</p>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="relative inline-flex items-center h-8 rounded-full w-16 transition-colors bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950 focus:ring-primary"
          >
            <span
              className={`${
                theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
              } inline-block w-6 h-6 transform bg-white rounded-full transition-transform flex items-center justify-center`}
            >
              {theme === 'light' ? <SunIcon className="w-4 h-4 text-yellow-500" /> : <MoonIcon className="w-4 h-4 text-primary" />}
            </span>
          </button>
        </div>
      </div>
      
      {/* Language Settings Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{t('settings.language.title')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{t('settings.language.description')}</p>
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button 
              onClick={() => handleSetLocale('vi')}
              className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${locale === 'vi' ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              Tiếng Việt
            </button>
            <button 
              onClick={() => handleSetLocale('en')}
              className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${locale === 'en' ? 'bg-white dark:bg-gray-800 text-primary shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              English
            </button>
        </div>
      </div>


      {/* Data Management Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">{t('settings.data.title')}</h2>
        <div className="flex items-center justify-between">
          <div className="flex-grow pr-4">
              <p className="text-gray-600 dark:text-gray-300">{t('settings.data.deleteAllHistory')}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">{t('settings.data.deleteAllHistoryDescription')}</p>
          </div>
          <button
            onClick={handleClearAllChatHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 transition-colors"
          >
            <TrashIcon className="w-4 h-4"/>
            <span>{t('settings.data.deleteAllButton')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;