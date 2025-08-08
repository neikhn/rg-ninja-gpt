import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import type { Theme } from '../types';

/**
 * Defines the shape of the application settings context.
 */
interface AppSettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (courseId: string) => void;
}

/**
 * React context for managing global app settings.
 */
const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

/**
 * Provider component that makes app settings available to all child components.
 * It manages the theme and favorites state, and persists them to localStorage.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 */
export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage or default to 'light'
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    // Initialize favorites from localStorage or default to an empty array
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Effect to apply the theme class to the HTML root and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effect to save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  /**
   * Adds or removes a course from the favorites list.
   * @param courseId - The ID of the course to toggle.
   */
  const toggleFavorite = (courseId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(courseId)
        ? prevFavorites.filter((id) => id !== courseId)
        : [...prevFavorites, courseId]
    );
  };

  return (
    <AppSettingsContext.Provider value={{ theme, toggleTheme, favorites, toggleFavorite }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

/**
 * Custom hook to easily access the application settings context.
 * Throws an error if used outside of an AppSettingsProvider.
 * @returns The application settings context.
 */
export const useAppSettings = (): AppSettingsContextType => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
