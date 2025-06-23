// --- FILE: client-admin/src/main.jsx (Verify This Is Correct) ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The single, top-level BrowserRouter wraps everything. */}
    <BrowserRouter>
      {/* The AuthProvider wraps the App to provide global auth state. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);