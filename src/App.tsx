import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation } from
'react-router-dom';
import { SmoothScroll } from './components/SmoothScroll';
import { Cursor } from './components/Cursor';
import { ScrollProgress } from './components/ScrollProgress';
import { AppHeader } from './components/AppHeader';
import { CartDrawer } from './features/cart/CartDrawer';
import { ToastRegion } from './components/ui/ToastRegion';
import { LivePurchaseNotice } from './components/LivePurchaseNotice';
import { Footer } from './sections/Footer';
import { AppStateProvider } from './hooks/useAppState';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderPage } from './pages/OrderPage';
import { AuthPage } from './pages/AuthPage';
import {
  AccountLayout,
  AccountOverview,
  AccountSection } from
'./pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { SupportPage } from './pages/SupportPage';
function Shell() {
  const location = useLocation();
  const minimal =
  location.pathname.startsWith('/auth') ||
  location.pathname.startsWith('/admin');
  return (
    <SmoothScroll>
      <div className="relative min-h-full w-full bg-ivory font-sans text-charcoal transition-colors dark:bg-[#181818] dark:text-ivory">
        <Cursor />
        {!minimal &&
        <>
            <ScrollProgress />
            <AppHeader />
          </>
        }
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/search" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/checkout/success/:orderId"
            element={<OrderPage success />} />
          
          <Route
            path="/checkout/payment-failed"
            element={
            <main className="mx-auto max-w-3xl px-6 py-28 text-center">
                <h1 className="font-serif text-5xl">
                  Payment needs another moment.
                </h1>
                <p className="mt-4 text-charcoal/60 dark:text-ivory/60">
                  No payment was attempted in this demo. Review your details and
                  retry when ready.
                </p>
                <a
                href="/checkout"
                className="mt-7 inline-block rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
                
                  Return to checkout
                </a>
              </main>
            } />
          
          <Route path="/orders/:orderId" element={<OrderPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="profile" element={<AccountSection />} />
            <Route path="orders" element={<AccountSection />} />
            <Route path="wishlist" element={<AccountSection />} />
            <Route path="addresses" element={<AccountSection />} />
            <Route path="payment-methods" element={<AccountSection />} />
            <Route path="loyalty" element={<AccountSection />} />
            <Route path="notifications" element={<AccountSection />} />
            <Route path="settings" element={<AccountSection />} />
          </Route>
          <Route path="/help" element={<SupportPage />} />
          <Route path="/legal/privacy" element={<SupportPage />} />
          <Route path="/legal/terms" element={<SupportPage />} />
          <Route path="/legal/shipping" element={<SupportPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!minimal &&
        <>
            <CartDrawer />
            <ToastRegion />
            <LivePurchaseNotice />
            {location.pathname === '/' && <Footer />}
          </>
        }
      </div>
    </SmoothScroll>);

}
export function App() {
  return (
    <BrowserRouter>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </BrowserRouter>);

}