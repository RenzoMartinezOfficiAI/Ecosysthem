import React from 'react';
import { NavItem } from './types';
import { HomeIcon, UsersIcon, ClipboardListIcon, Squares2X2Icon, CalendarIcon, CalendarDaysIcon } from './components/ui/Icon';

export const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactElement }[] = [
  { id: 'houses', label: 'Houses', icon: <HomeIcon /> },
  { id: 'members', label: 'Members', icon: <UsersIcon /> },
  { id: 'assignments', label: 'Assignments', icon: <Squares2X2Icon /> },
  { id: 'work_orders', label: 'Work Orders', icon: <ClipboardListIcon /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
  { id: 'inventory', label: 'Maintenance', icon: <CalendarDaysIcon /> },
  // { id: 'audit_log', label: 'Audit Log', icon: <ShieldCheckIcon /> },
];