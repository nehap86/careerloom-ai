import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1B4F72',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 20px',
            },
            success: {
              style: { background: '#059669' },
              iconTheme: { primary: '#fff', secondary: '#059669' },
            },
            error: {
              style: { background: '#DC2626' },
              iconTheme: { primary: '#fff', secondary: '#DC2626' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
