import React, { useState, useMemo } from 'react';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { SearchIcon } from '../components/icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecommendations } from '../contexts/RecommendationContext';

/**
 * Props for the CoursesPage component.
 */
interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (course: Course, analysis?: string) => void;
}

/**
 * A page that displays the entire course catalog with search and filtering functionality.
 */
const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onSelectCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const { locale, t } = useLanguage();
  const { recommendations } = useRecommendations();

  const coursesPerPage = 9;

  const categories = useMemo(() => ['All', ...Array.from(new Set(courses.map(c => c.category)))], [courses]);
  const levels = useMemo(() => ['All', 'Beginner', 'Intermediate', 'Advanced'], []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const lowercasedFilter = searchTerm.toLowerCase();
      const title = locale === 'vi' && course.title_vi ? course.title_vi : course.title;
      const description = locale === 'vi' && course.description_vi ? course.description_vi : course.description;

      const matchesSearch = !searchTerm ||
        title.toLowerCase().includes(lowercasedFilter) ||
        description.toLowerCase().includes(lowercasedFilter) ||
        course.provider.toLowerCase().includes(lowercasedFilter) ||
        course.topics.some(topic => topic.toLowerCase().includes(lowercasedFilter));

      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchTerm, courses, locale, selectedLevel, selectedCategory]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">{t('courses.title')}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t('courses.subtitle')}</p>
      </div>

      <div className="mb-8 max-w-4xl mx-auto space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder={t('courses.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            aria-label={t('courses.searchPlaceholder')}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {levels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </div>

      {paginatedCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedCourses.map(course => {
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
              )
            })}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              {t('pagination.previous')}
            </button>
            <span className="px-4 py-2 mx-1">
              {t('pagination.page', { currentPage, totalPages })}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              {t('pagination.next')}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400">{t('courses.noResults')}</p>
          <p className="mt-2 text-gray-400 dark:text-gray-500">{t('courses.noResultsHint')}</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;