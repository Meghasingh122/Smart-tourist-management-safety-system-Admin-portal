import React from 'react';
import ThemeModeProvider from './ThemeContext';
import AuthProvider from './AuthContext';
import SocketProvider from './SocketContext';

export function AppProviders({ children }) {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
