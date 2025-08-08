/**
 * Defines the available themes for the application.
 */
export type Theme = 'light' | 'dark';

/**
 * Defines the available languages for the application.
 */
export type Locale = 'vi' | 'en';

/**
 * Represents a single course in the catalog.
 */
export interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  longDescription: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  category: string;
  title_vi?: string;
  description_vi?: string;
  longDescription_vi?: string;
}

/**
 * Represents a single message in the chat interface.
 */
export interface ChatMessage {
    sender: 'user' | 'ai';
    text?: string;
    recommendedCourses?: { course: Course; reasoning: string }[];
}

/**
 * Represents a full chat conversation session.
 */
export interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: ChatMessage[];
}

/**
 * Represents a course that has been selected, including the AI's analysis.
 */
export interface CourseRecommendation {
    course: Course;
    analysis?: string;
}
