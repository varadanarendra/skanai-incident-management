import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './app/App';
import './locales/i18n';
import './styles/globals.css';
import { ToastProvider } from './core/toast/ToastProvider';

/**
 * Application entry point
 * Sets up Redux Provider and i18n
 */

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </React.StrictMode>
);

