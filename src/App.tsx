import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation } from
'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SmoothScroll } from './components/SmoothScroll';
import { Cursor } from './components/Cursor';
import { ScrollProgress } from './components/ScrollProgress';
import { PremiumNav } from './components/premium/PremiumNav';
import { SearchOverlay } from './components/premium/SearchOverlay';
import { WishlistDrawer } from './components/premium/WishlistDrawer';
import { MobileBottomNav } from './components/premium/MobileBottomNav';
import { PageTransition } from './components/premium/PageTransition';
import { CartDrawer } from './features/cart/CartDrawer';
import { ToastRegion } from './components/ui/ToastRegion';
import { LivePurchaseNotice } from './components/LivePurchaseNotice';
import { Footer } from './sections/Footer';
import { AppStateProvider } from './hooks/useAppState';
import { CatalogProvider } from './context/CatalogContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { appConfig } from './lib/config';

const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductPage = lazy(() => import('./pages/ProductPage').then((m) => ({ default: m.ProductPage })));
const CartPage = lazy(() => import('./pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderPage = lazy(() => import('./pages/OrderPage').then((m) => ({ default: m.OrderPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const AccountLayout = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountLayout })));
const AccountOverview = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountOverview })));
const AccountSection = lazy(() => import('./pages/AccountPage').then((m) => ({ default: m.AccountSection })));
const SupportPage = lazy(() => import('./pages/SupportPage').then((m) => ({ default: m.SupportPage })));

function AdminRedirect() {
  const target = appConfig.adminUrl;
  React.useEffect(() => {
    if (target) window.location.replace(target);
  }, [target]);
  if (target) {
    return (
      <div className="grid min-h-screen place-items-center bg-ivory text-charcoal/60">
        Opening Hautoria Admin…
      </div>
    );
  }
  return (
    <main className="mx-auto max-w-lg px-6 py-28 text-center">
      <h1 className="font-serif text-4xl">Admin moved</h1>
      <p className="mt-4 text-charcoal/60">
        The Command Center is a separate app. Deploy it with{' '}
        <code className="text-sm">npm run build:admin</code> and set{' '}
        <code className="text-sm">VITE_ADMIN_URL</code> on the store project.
      </p>
      <p className="mt-2 text-sm text-charcoal/50">See admin-app/README.md</p>
    </main>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

function Shell() {
  const location = useLocation();
  const minimal = location.pathname.startsWith('/auth');
  return (
    <SmoothScroll>
      <div className="relative min-h-full w-full bg-ivory pb-20 font-sans text-charcoal transition-colors dark:bg-graphite dark:text-ivory lg:pb-0">
        <Cursor />
        {!minimal &&
        <>
            <ScrollProgress />
            <PremiumNav />
          </>
        }
        <PageTransition>
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/search" element={<ShopPage />} />
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/checkout/success/:orderId"
                element={<OrderPage success />}
              />
              <Route
                path="/checkout/payment-failed"
                element={
                <main className="mx-auto max-w-3xl px-6 py-28 text-center">
                    <h1 className="font-serif text-5xl">
                      Payment needs another moment.
                    </h1>
                    <p className="mt-4 text-charcoal/60 dark:text-ivory/60">
                      Please review your payment details and try again when ready.
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
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
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
              <Route path="/admin/*" element={<AdminRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PageTransition>
        {!minimal &&
        <>
            <CartDrawer />
            <WishlistDrawer />
            <SearchOverlay />
            <ToastRegion />
            <LivePurchaseNotice />
            <MobileBottomNav />
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
        <CatalogProvider>
          <Shell />
          <Analytics />
        </CatalogProvider>
      </AppStateProvider>
    </BrowserRouter>
  );
}
