
import React from 'react';
import { NAV_ITEMS } from '../../constants';
import { NavItem } from '../../types';
import { BuildingOfficeIcon } from '../ui/Icon';

interface SidebarProps {
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen }) => {
  return (
    <aside className={`w-64 flex-col bg-white border-r border-light-300 ${isSidebarOpen ? 'hidden md:flex' : 'hidden'}`}>
      <div className="h-16 flex items-center justify-center border-b border-light-300">
        <div className="flex items-center gap-2 text-primary">
            <BuildingOfficeIcon />
            <h1 className="text-xl font-bold font-display text-dark-900">Ecosysthem</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
              ${
                activeView === item.id
                  ? 'bg-primary-light text-primary'
                  : 'text-secondary hover:bg-light-200 hover:text-dark-900'
              }
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-light-300">
        {/* User profile section */}
      </div>
    </aside>
  );
};

export default Sidebar;