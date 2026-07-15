import '../src/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminApp } from '../src/admin/AdminApp';
import { AppStateProvider } from '../src/hooks/useAppState';
import { CatalogProvider } from '../src/context/CatalogContext';
import { ToastRegion } from '../src/components/ui/ToastRegion';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <BrowserRouter>
      <AppStateProvider>
        <CatalogProvider>
          <AdminApp />
          <ToastRegion />
        </CatalogProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
}
