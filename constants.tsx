import React from 'react';
import { NavItem } from './types';
import { HomeIcon, UsersIcon, ClipboardListIcon, Squares2X2Icon, CalendarIcon, CalendarDaysIcon, CubeIcon, ChartBarIcon, DocumentTextIcon } from './components/ui/Icon';

export const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactElement }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
  { id: 'houses', label: 'Houses', icon: <HomeIcon /> },
  { id: 'members', label: 'Members', icon: <UsersIcon /> },
  { id: 'assignments', label: 'Assignments', icon: <Squares2X2Icon /> },
  { id: 'work_orders', label: 'Work Orders', icon: <ClipboardListIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
  { id: 'inventory', label: 'Inventory', icon: <CubeIcon /> },
  { id: 'maintenance', label: 'Maintenance', icon: <CalendarDaysIcon /> },
  { id: 'reporting', label: 'Reporting', icon: <DocumentTextIcon /> },
  // { id: 'audit_log', label: 'Audit Log', icon: <ShieldCheckIcon /> },
];