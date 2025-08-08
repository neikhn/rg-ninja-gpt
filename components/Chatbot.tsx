import React, { useState, useEffect, useRef } from 'react';
import type { Course, ChatMessage } from '../types';
import { getAiResponse, GeminiResponse } from '../services/geminiService';
import CourseCard from './CourseCard';
import { SendIcon, UserIcon, BotIcon } from './icons/Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useRecommendations } from '../contexts/RecommendationContext';
import { useChat } from '../contexts/ChatContext';

/**
 * Props for the Chatbot component.
 */
interface ChatbotProps {
  courses: Course[];
  onSelectCourse: (course: Course, analysis: string) => void;
}

/**
 * An interactive chatbot that has a natural conversation with the user
 * to provide personalized course recommendations using the Gemini API.
 */
const Chatbot: React.FC<ChatbotProps> = ({ courses, onSelectCourse }) => {
  const { locale, t } = useLanguage();
  const { setRecommendations } = useRecommendations();
  const { activeSession, updateActiveSession, createSession } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSession) {
      createSession();
    }
  }, [activeSession, createSession]);
  
  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);


  /**
   * Handles sending a user message, processing the answer, and getting the next AI response.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !activeSession) return;

    const userMessage: ChatMessage = { sender: 'user', text: inputValue };
    const newMessages = [...activeSession.messages, userMessage];
    
    updateActiveSession(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get the AI's response based on the conversation history
      const result: GeminiResponse = await getAiResponse(newMessages, courses, locale);
      
      const recommendedCoursesWithDetails = result.recommendations
        ?.map(rec => {
          const course = courses.find(c => c.id === rec.courseId);
          return course ? { course, reasoning: rec.reasoning } : null;
        })
        .filter((c): c is { course: Course; reasoning: string } => c !== null);
      
      if (result.recommendations) {
        // Persist recommendations to context
        setRecommendations(result.recommendations);
      }

      const aiResponseMessage: ChatMessage = {
        sender: 'ai',
        text: result.chatResponse,
        recommendedCourses: recommendedCoursesWithDetails,
      };

      updateActiveSession([...newMessages, aiResponseMessage]);
      
    } catch (error) {
      console.error(error);
      const errorText = locale === 'vi' ? 'Xin lỗi, tôi đã gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.' : 'Sorry, I encountered an error while processing your request. Please try again.';
      updateActiveSession([...newMessages, { sender: 'ai', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeSession) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Select a chat or start a new one.</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full w-full">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {activeSession.messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center"><BotIcon className="w-5 h-5 text-primary dark:text-gray-200"/></div>}
             <div className={`w-full max-w-lg flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.text && (
                   <div className={`px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-user-bubble text-white rounded-br-none' : 'bg-ai-bubble dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-none'}`}>
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                   </div>
                )}
                {msg.recommendedCourses && (
                  <div className="grid grid-cols-1 gap-4 mt-2 w-full">
                    {msg.recommendedCourses.map(({ course, reasoning }) => (
                      <CourseCard key={course.id} course={course} onClick={() => onSelectCourse(course, reasoning)} className="cursor-pointer hover:shadow-lg transition-shadow" isRecommended />
                    ))}
                  </div>
                )}
             </div>
             {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-200"/></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center"><BotIcon className="w-5 h-5 text-primary dark:text-gray-200"/></div>
            <div className={`px-4 py-3 rounded-2xl bg-ai-bubble dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-none`}>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('chatbot.inputPlaceholder')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200"
            aria-label={t('chatbot.inputPlaceholder')}
          />
          <button
            type="submit"
            aria-label={t('chatbot.send')}
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0 bg-primary text-white rounded-full p-3 hover:bg-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;