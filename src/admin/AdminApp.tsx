import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminThemeProvider } from './AdminThemeProvider';
import { AdminShell } from './components/AdminShell';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminInventoryPage } from './pages/AdminInventoryPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminCouponsPage } from './pages/AdminCouponsPage';
import { AdminActivityPage } from './pages/AdminActivityPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminModulePage } from './pages/AdminModulePage';
import { adminPath } from './paths';

function AdminFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
    </div>
  );
}

export function AdminApp() {
  return (
    <AdminThemeProvider>
      <AdminAuthProvider>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="login" element={<AdminLoginPage />} />
            <Route element={<AdminShell />}>
              <Route index element={<AdminDashboardPage />} />
              <Route
                path="analytics"
                element={
                  <AdminModulePage
                    title="Analytics"
                    description="Revenue trends, conversion funnels, and visitor insights connected to MongoDB."
                  />
                }
              />
              <Route
                path="system-health"
                element={
                  <AdminModulePage
                    title="System Health"
                    description="API uptime, MongoDB status, and integration health checks."
                  />
                }
              />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route
                path="categories"
                element={
                  <AdminModulePage
                    title="Categories"
                    description="Manage serum, moisturizer, cleanser, and treatment categories."
                  />
                }
              />
              <Route
                path="brands"
                element={
                  <AdminModulePage
                    title="Brands"
                    description="MAC, CeraVe, COSRX, La Roche-Posay and more."
                  />
                }
              />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route
                path="support"
                element={
                  <AdminModulePage
                    title="Support Tickets"
                    description="Customer tickets, WhatsApp escalations, and live chat queue."
                  />
                }
              />
              <Route
                path="payments"
                element={
                  <AdminModulePage
                    title="Payments"
                    description="Stripe, PayPal, COD, bank transfer, JazzCash, and EasyPaisa verification."
                  />
                }
              />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route
                path="team"
                element={
                  <AdminModulePage
                    title="Team Members"
                    description="Admin, manager, sales, and support roles with permissions."
                  />
                }
              />
              <Route path="activity" element={<AdminActivityPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to={adminPath.home} replace />} />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </AdminThemeProvider>
  );
}
