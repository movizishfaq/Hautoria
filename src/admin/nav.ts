export type AdminNavItem = {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
      { to: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
      { to: '/admin/system-health', label: 'System Health', icon: 'Activity' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: 'ShoppingBag' },
      { to: '/admin/products', label: 'Products', icon: 'Package' },
      { to: '/admin/categories', label: 'Categories', icon: 'Folders' },
      { to: '/admin/brands', label: 'Brands', icon: 'Award' },
      { to: '/admin/inventory', label: 'Inventory', icon: 'Warehouse' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { to: '/admin/customers', label: 'Customers', icon: 'Users' },
      { to: '/admin/support', label: 'Support Tickets', icon: 'LifeBuoy' },
    ],
  },
  {
    label: 'Finance & Marketing',
    items: [
      { to: '/admin/payments', label: 'Payments', icon: 'CreditCard' },
      { to: '/admin/coupons', label: 'Coupons', icon: 'Ticket' },
    ],
  },
  {
    label: 'Team & System',
    items: [
      { to: '/admin/team', label: 'Team Members', icon: 'UserCog' },
      { to: '/admin/activity', label: 'Activity Logs', icon: 'History' },
      { to: '/admin/settings', label: 'Settings', icon: 'Settings' },
    ],
  },
];
