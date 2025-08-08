import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { GeminiRecommendation } from '../services/geminiService';

/**
 * Defines the shape of the recommendation context.
 */
interface RecommendationContextType {
  recommendations: GeminiRecommendation[];
  setRecommendations: (recs: GeminiRecommendation[]) => void;
}

/**
 * React context for managing AI-generated course recommendations.
 */
const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

/**
 * Provider component that makes AI recommendations available to all child components.
 * It holds the recommendations in state for the duration of the user session.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 */
export const RecommendationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<GeminiRecommendation[]>([]);

  return (
    <RecommendationContext.Provider value={{ recommendations, setRecommendations }}>
      {children}
    </RecommendationContext.Provider>
  );
};

/**
 * Custom hook to easily access the recommendation context.
 * Throws an error if used outside of a RecommendationProvider.
 * @returns The recommendation context.
 */
export const useRecommendations = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};