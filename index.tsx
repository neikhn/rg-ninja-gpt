import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { RecommendationProvider } from './contexts/RecommendationContext';
import { ChatProvider } from './contexts/ChatContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AppSettingsProvider>
        <RecommendationProvider>
          <ChatProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </ChatProvider>
        </RecommendationProvider>
      </AppSettingsProvider>
    </LanguageProvider>
  </React.StrictMode>
);