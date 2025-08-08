import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ChatSession, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from './LanguageContext';

/**
 * The shape of the ChatContext.
 */
interface ChatContextType {
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  activeSession: ChatSession | null;
  createSession: () => void;
  deleteSession: (sessionId: string) => void;
  setActiveSessionId: (sessionId: string | null) => void;
  updateActiveSession: (messages: ChatMessage[]) => void;
  renameSession: (sessionId: string, newTitle: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * A provider component that wraps the application to make chat state available.
 */
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { t } = useLanguage();

  // Load chat sessions from local storage on initial render
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        setChatSessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error("Failed to load chat sessions from local storage", error);
    }
  }, []);

  // Save chat sessions to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    } catch (error) {
      console.error("Failed to save chat sessions to local storage", error);
    }
  }, [chatSessions]);

  const createSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: `Conversation ${chatSessions.length + 1}`,
      timestamp: Date.now(),
      messages: [{ sender: 'ai', text: t('chatbot.greeting') }],
    };
    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(chatSessions.length > 1 ? chatSessions[0].id : null);
    }
  };

  const updateActiveSession = (messages: ChatMessage[]) => {
    if (!activeSessionId) return;
    setChatSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId ? { ...session, messages, timestamp: Date.now() } : session
      )
    );
  };
  
  const renameSession = (sessionId: string, newTitle: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === sessionId ? { ...session, title: newTitle } : session
      )
    );
  };

  const activeSession = chatSessions.find(session => session.id === activeSessionId) || null;

  return (
    <ChatContext.Provider value={{ chatSessions, activeSessionId, activeSession, createSession, deleteSession, setActiveSessionId, updateActiveSession, renameSession }}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * A custom hook to easily access the ChatContext.
 * @returns The chat context.
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};