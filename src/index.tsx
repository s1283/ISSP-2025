import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext'; // Import AudioPlayerProvider

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AudioPlayerProvider> {/* Wrap App with AudioPlayerProvider */}
        <App />
      </AudioPlayerProvider>
    </AuthProvider>
  </React.StrictMode>
);