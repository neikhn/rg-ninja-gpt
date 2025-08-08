import React from 'react';
import type { Course } from '../types';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { XIcon, CheckCircleIcon, BookOpenIcon, TagIcon, BriefcaseIcon, ClockIcon, LevelIcon, HeartIcon } from './icons/Icons';

/**
 * Props for the CourseModal component.
 */
interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | undefined;
  analysis?: string | undefined;
}

/**
 * A modal dialog to display detailed information about a course.
 * It also shows the AI's reasoning if the course was recommended.
 * It includes a button to add/remove the course from favorites.
 */
const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course, analysis }) => {
  const { favorites, toggleFavorite } = useAppSettings();
  const { locale, t } = useLanguage();

  if (!isOpen || !course) return null;
  
  const isFavorite = favorites.includes(course.id);

  const title = locale === 'vi' && course.title_vi ? course.title_vi : course.title;
  const longDescription = locale === 'vi' && course.longDescription_vi ? course.longDescription_vi : course.longDescription;
  const favoriteLabel = isFavorite ? t('course.removeFromFavorites', { title }) : t('course.addToFavorites', { title });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-4">
                <h2 id="course-modal-title" className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
                  aria-label={t('modal.close')}
                >
                  <XIcon />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><BriefcaseIcon /> <span className="font-medium">{course.provider}</span></div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><ClockIcon /> <span className="font-medium">{course.duration}</span></div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><LevelIcon /> <span className="font-medium">{t(`level.${course.level}`)}</span></div>
            </div>

            {analysis && (
              <div className="bg-primary-light dark:bg-primary/20 border-l-4 border-primary text-primary-dark dark:text-gray-200 p-4 rounded-r-lg mb-6">
                <div className="flex">
                  <div className="py-1 flex-shrink-0"><CheckCircleIcon className="fill-current text-primary h-6 w-6 mr-4"/></div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{t('modal.analysisTitle')}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{analysis}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2"><BookOpenIcon /> {t('modal.descriptionTitle')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{longDescription}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2 mb-2"><TagIcon /> {t('modal.topicsTitle')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {course.topics.map(topic => (
                            <span key={topic} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">{topic}</span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => toggleFavorite(course.id)}
                  aria-label={favoriteLabel}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'stroke-current'}`} />
                  <span>{isFavorite ? t('course.favorited') : t('course.favorite')}</span>
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                    {t('modal.close')}
                </button>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
            from {
                transform: scale(0.95);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        .animate-scale-in {
            animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CourseModal;
