import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext } from
'react';
import type {
  AppNotification,
  CartItem,
  Order,
  Product,
  User,
  WishlistItem } from
'../types/domain';
import { isApiEnabled } from '../services/api';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { usePersistedState } from './usePersistedState';
type Toast = {
  id: string;
  message: string;
  tone?: 'success' | 'error' | 'info';
};
type AppState = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  compare: string[];
  recentlyViewed: string[];
  user: User | null;
  orders: Order[];
  notifications: AppNotification[];
  theme: 'light' | 'dark';
  toasts: Toast[];
  authReady: boolean;
  cartOpen: boolean;
  wishlistOpen: boolean;
  searchOpen: boolean;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  updateQuantity: (
  productId: string,
  variantId: string,
  quantity: number)
  => void;
  removeFromCart: (productId: string, variantId: string) => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  viewProduct: (productId: string) => void;
  setUser: (user: User | null) => void;
  addOrder: (order: Order) => void;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  notify: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: string) => void;
  toggleTheme: () => void;
};
const Context = createContext<AppState | undefined>(undefined);
export function AppStateProvider({ children }: {children: React.ReactNode;}) {
  const [cart, setCart] = usePersistedState<CartItem[]>('hautoria_cart', []);
  const [wishlist, setWishlist] = usePersistedState<WishlistItem[]>(
    'hautoria_wishlist',
    []
  );
  const [compare, setCompare] = usePersistedState<string[]>(
    'hautoria_compare',
    []
  );
  const [recentlyViewed, setRecentlyViewed] = usePersistedState<string[]>(
    'hautoria_recent',
    []
  );
  const [user, setUser] = usePersistedState<User | null>('hautoria_user', null);
  const [orders, setOrders] = usePersistedState<Order[]>('hautoria_orders', []);
  const [authReady, setAuthReady] = useState(!isApiEnabled());
  const [notifications, setNotifications] = usePersistedState<AppNotification[]>(
    'hautoria_notifications',
    []
  );
  const [theme, setTheme] = usePersistedState<'light' | 'dark'>(
    'hautoria_theme',
    'light'
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Purge old demo identities left in localStorage from earlier builds.
  useEffect(() => {
    const isDemoUser =
      user &&
      (user.id === 'usr_demo' ||
        user.email?.endsWith('@example.com') ||
        user.email?.endsWith('@hautoria.demo') ||
        user.name === 'Amara Laurent' ||
        user.name === 'Camille Laurent');
    if (isDemoUser) setUser(null);
  }, [user, setUser]);

  useEffect(() => {
    if (!isApiEnabled()) {
      setAuthReady(true);
      return;
    }
    let active = true;
    (async () => {
      try {
        const me = await authService.getMe();
        if (!active) return;
        if (me) setUser(me);
        else setUser(null);
        const remoteOrders = await userService.getOrders().catch(() => []);
        if (active) setOrders(remoteOrders);
        const remoteNotes = await userService.getNotifications().catch(() => []);
        if (active) setNotifications(remoteNotes);
      } finally {
        if (active) setAuthReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [setUser, setOrders, setNotifications]);
  const notify = (message: string, tone: Toast['tone'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((list) => [
    ...list,
    {
      id,
      message,
      tone
    }]
    );
    window.setTimeout(
      () => setToasts((list) => list.filter((toast) => toast.id !== id)),
      3600
    );
  };
  const value = useMemo<AppState>(
    () => ({
      cart,
      wishlist,
      compare,
      recentlyViewed,
      user,
      orders,
      notifications,
      theme,
      toasts,
      authReady,
      cartOpen,
      wishlistOpen,
      searchOpen,
      addToCart: (
      product,
      variantId = product.variants[0].id,
      quantity = 1) =>
      {
        setCart((items) => {
          const current = items.find(
            (item) =>
            item.productId === product.id && item.variantId === variantId
          );
          return current ?
          items.map((item) =>
          item === current ?
          {
            ...item,
            quantity: Math.min(
              item.quantity + quantity,
              product.stock
            )
          } :
          item
          ) :
          [
          ...items,
          {
            productId: product.id,
            variantId,
            quantity
          }];

        });
        setCartOpen(true);
        notify(`${product.name} added to your bag`);
      },
      updateQuantity: (productId, variantId, quantity) =>
      setCart((items) =>
      quantity < 1 ?
      items.filter(
        (item) =>
        !(
        item.productId === productId && item.variantId === variantId)

      ) :
      items.map((item) =>
      item.productId === productId && item.variantId === variantId ?
      {
        ...item,
        quantity
      } :
      item
      )
      ),
      removeFromCart: (productId, variantId) => {
        setCart((items) =>
        items.filter(
          (item) =>
          !(item.productId === productId && item.variantId === variantId)
        )
        );
        notify('Removed from your bag', 'info');
      },
      toggleWishlist: (productId) =>
      setWishlist((items) =>
      items.some((item) => item.productId === productId) ?
      items.filter((item) => item.productId !== productId) :
      [
      ...items,
      {
        productId,
        createdAt: new Date().toISOString()
      }]

      ),
      toggleCompare: (productId) =>
      setCompare((items) =>
      items.includes(productId) ?
      items.filter((id) => id !== productId) :
      items.length >= 3 ?
      items :
      [...items, productId]
      ),
      viewProduct: (productId) =>
      setRecentlyViewed((items) =>
      [productId, ...items.filter((id) => id !== productId)].slice(0, 6)
      ),
      setUser,
      addOrder: (order) => {
        // Memory only — Mongo is the source of truth for fulfillment status.
        setOrders((items) => [order, ...items.filter((o) => o.id !== order.id)]);
      },
      setCartOpen,
      setWishlistOpen,
      setSearchOpen,
      notify,
      dismissToast: (id) =>
      setToasts((items) => items.filter((toast) => toast.id !== id)),
      toggleTheme: () =>
      setTheme((value) => value === 'light' ? 'dark' : 'light')
    }),
    [
    cart,
    wishlist,
    compare,
    recentlyViewed,
    user,
    orders,
    notifications,
    theme,
    toasts,
    authReady,
    cartOpen,
    wishlistOpen,
    searchOpen]

  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppState() {
  const value = useContext(Context);
  if (!value)
  throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}