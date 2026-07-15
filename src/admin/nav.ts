import { adminPath } from './paths';

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
      { to: adminPath.home, label: 'Dashboard', icon: 'LayoutDashboard', end: true },
      { to: adminPath.analytics, label: 'Analytics', icon: 'BarChart3' },
      { to: adminPath.systemHealth, label: 'System Health', icon: 'Activity' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: adminPath.orders, label: 'Orders', icon: 'ShoppingBag' },
      { to: adminPath.products, label: 'Products', icon: 'Package' },
      { to: adminPath.categories, label: 'Categories', icon: 'Folders' },
      { to: adminPath.brands, label: 'Brands', icon: 'Award' },
      { to: adminPath.inventory, label: 'Inventory', icon: 'Warehouse' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { to: adminPath.customers, label: 'Customers', icon: 'Users' },
      { to: adminPath.support, label: 'Support Tickets', icon: 'LifeBuoy' },
    ],
  },
  {
    label: 'Finance & Marketing',
    items: [
      { to: adminPath.payments, label: 'Payments', icon: 'CreditCard' },
      { to: adminPath.coupons, label: 'Coupons', icon: 'Ticket' },
    ],
  },
  {
    label: 'Team & System',
    items: [
      { to: adminPath.team, label: 'Team Members', icon: 'UserCog' },
      { to: adminPath.activity, label: 'Activity Logs', icon: 'History' },
      { to: adminPath.settings, label: 'Settings', icon: 'Settings' },
    ],
  },
];
