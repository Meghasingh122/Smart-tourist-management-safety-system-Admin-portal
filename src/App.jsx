import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './context/AppProviders';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </AppProviders>
    </BrowserRouter>
  );
}
