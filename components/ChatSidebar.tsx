import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PlusIcon, TrashIcon, ChatBubbleLeftIcon, PencilIcon } from './icons/Icons';

/**
 * A sidebar component to display and manage chat sessions.
 */
const ChatSidebar: React.FC = () => {
    const { chatSessions, activeSessionId, createSession, deleteSession, setActiveSessionId, renameSession } = useChat();
    const { t } = useLanguage();
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const handleDelete = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (window.confirm(t('sidebar.deleteConfirmation'))) {
            deleteSession(sessionId);
        }
    };

    const handleRename = (sessionId: string, currentTitle: string) => {
        setEditingSessionId(sessionId);
        setNewTitle(currentTitle);
    };

    const handleSaveRename = (sessionId: string) => {
        if (newTitle.trim()) {
            renameSession(sessionId, newTitle.trim());
        }
        setEditingSessionId(null);
        setNewTitle('');
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{t('sidebar.title')}</h2>
                <button
                    onClick={createSession}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    <PlusIcon className="w-5 h-5" />
                    {t('sidebar.newConversation')}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {chatSessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => setActiveSessionId(session.id)}
                        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer mb-2 transition-colors ${activeSessionId === session.id ? 'bg-primary-light dark:bg-primary/30' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            {editingSessionId === session.id ? (
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    onBlur={() => handleSaveRename(session.id)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                                    className="text-sm font-medium bg-transparent border-b border-primary w-full focus:outline-none text-gray-800 dark:text-gray-200"
                                    autoFocus
                                />
                            ) : (
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{session.title}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleRename(session.id, session.title)} className="text-gray-500 hover:text-primary dark:hover:text-white p-1 rounded">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDelete(e, session.id)} className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSidebar;