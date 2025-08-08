import React from 'react';
import type { Course } from '../types';
import { useAppSettings } from '../contexts/AppSettingsContext';
import CourseCard from '../components/CourseCard';
import { HeartIcon } from '../components/icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecommendations } from '../contexts/RecommendationContext';

/**
 * Props for the FavoritesPage component.
 */
interface FavoritesPageProps {
  courses: Course[];
  onSelectCourse: (course: Course, analysis?: string) => void;
}

/**
 * A page that displays all courses the user has marked as favorite.
 * It fetches the list of favorite IDs from the AppSettingsContext.
 */
const FavoritesPage: React.FC<FavoritesPageProps> = ({ courses, onSelectCourse }) => {
  const { favorites } = useAppSettings();
  const { t } = useLanguage();
  const { recommendations } = useRecommendations();

  const favoriteCourses = courses.filter(course => favorites.includes(course.id));

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">{t('favorites.title')}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('favorites.subtitle')}</p>
      </div>

      {favoriteCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteCourses.map(course => {
            const courseAnalysis = recommendations.find(r => r.courseId === course.id)?.reasoning;
            const isRecommended = !!courseAnalysis;
            return (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onSelectCourse(course, courseAnalysis)}
                className="transform hover:-translate-y-1 transition-transform duration-300"
                isRecommended={isRecommended}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">{t('favorites.emptyTitle')}</p>
          <p className="mt-2 text-gray-400 dark:text-gray-500">{t('favorites.emptyHint')}</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;