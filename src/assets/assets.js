import quantum_save_brand from './quantum-save-brand.png';
import quantum_save_icon from './quantum-save-icon.png';
import quantum_save_logo from './quantum-save-logo.png';
import { Coins, FunnelPlus, LayoutDashboard, List, Wallet } from 'lucide-react';

export const assets = {
  quantum_save_brand,
  quantum_save_icon,
  quantum_save_logo,
};

export const SIDEBAR_DATA = [
  {
    id: '01',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: '02',
    label: 'Category',
    icon: List,
    path: '/category',
  },
  {
    id: '03',
    label: 'Income',
    icon: Wallet,
    path: '/income',
  },
  {
    id: '04',
    label: 'Expense',
    icon: Coins,
    path: '/expense',
  },
  {
    id: '05',
    label: 'Filters',
    icon: FunnelPlus,
    path: '/filter',
  },
];
