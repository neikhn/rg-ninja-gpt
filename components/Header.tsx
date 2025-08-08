import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatIcon, BookOpenIcon, HeartIcon, SettingsIcon } from './icons/Icons';

/**
 * The main header component for the application.
 * It provides navigation to all top-level pages.
 */
const Header: React.FC = () => {
    const { t } = useLanguage();
    const activeLinkClass = "bg-primary-light text-primary dark:bg-primary/20 dark:text-white";
    const inactiveLinkClass = "text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    const linkBaseClass = "flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors";

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <nav className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2 rounded-lg group-hover:scale-105 transition-transform">
             <ChatIcon className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100 hidden sm:block"> NinjaGPT</span>
        </NavLink>
        <div className="flex items-center gap-1 md:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <ChatIcon className="h-5 w-5"/>
              <span className="hidden md:inline">{t('header.chatbot')}</span>
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <BookOpenIcon className="h-5 w-5" />
              <span className="hidden md:inline">{t('header.allCourses')}</span>
            </NavLink>
             <NavLink
              to="/favorites"
              className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <HeartIcon className="h-5 w-5" />
              <span className="hidden md:inline">{t('header.favorites')}</span>
            </NavLink>
             <NavLink
              to="/settings"
              className={({ isActive }) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
            >
              <SettingsIcon className="h-5 w-5" />
              <span className="hidden md:inline">{t('header.settings')}</span>
            </NavLink>
        </div>
        <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {t('header.login')}
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg">
              {t('header.signUp')}
            </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
