import React from 'react';
import Chatbot from '../components/Chatbot';
import ChatSidebar from '../components/ChatSidebar';
import type { Course } from '../types';

/**
 * Props for the HomePage component.
 */
interface HomePageProps {
  courses: Course[];
  onSelectCourse: (course: Course, analysis: string) => void;
}

/**
 * The main landing page of the application.
 * It displays a welcoming message and the interactive Chatbot component.
 */
const HomePage: React.FC<HomePageProps> = ({ courses, onSelectCourse }) => {
  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
      <div className="border-r border-gray-200 dark:border-gray-700">
        <ChatSidebar />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full p-4">
        <div className="w-full h-full max-w-none mx-auto">
          <Chatbot courses={courses} onSelectCourse={onSelectCourse} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
