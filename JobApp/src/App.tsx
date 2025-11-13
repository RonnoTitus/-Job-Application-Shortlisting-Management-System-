import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppRouter } from './AppRouter';
import { Toaster } from 'sonner';
export function App() {
  return <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <AppRouter />
        <Toaster position="top-right" />
      </div>
    </Provider>;
}