import React, { useState } from 'react';
import { BellIcon, SearchIcon, MenuIcon, BuildingOfficeIcon } from '../ui/Icon';
import { NavItem } from '../../types';
import { NAV_ITEMS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm, activeView, setActiveView, toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleNavClick = (view: NavItem) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-10 bg-white border-b border-light-300 shadow-sm">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Hamburger on mobile, page title/breadcrumbs on desktop */}
        <div className="flex items-center gap-4">
          <button
            className="hidden md:block text-secondary hover:text-dark-900"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <button
            className="md:hidden text-secondary hover:text-dark-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          {/* Desktop page title placeholder */}
          <div className="hidden md:block">
            {/* Can add breadcrumbs or page title here */}
          </div>
        </div>
        
        {/* Center: Logo on mobile */}
        <div className="md:hidden flex items-center gap-2 text-primary">
          <BuildingOfficeIcon />
          <h1 className="text-lg font-bold font-display text-dark-900">Ecosysthem</h1>
        </div>

        {/* Right side: Search, Bell, Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-32 sm:w-64 rounded-lg bg-light-200 border-2 border-transparent focus:bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button className="text-secondary hover:text-dark-900 p-1">
            <BellIcon />
          </button>
          <div className="relative">
            <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="w-10 h-10 rounded-full bg-secondary overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <img src={user?.avatarUrl} alt="Admin user" className="w-full h-full object-cover"/>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-dark-900">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-secondary truncate">{user?.email}</p>
                </div>
                <div className="border-t border-light-300"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-dark-800 hover:bg-light-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-white border-t border-light-300 shadow-lg">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors
                  ${
                    activeView === item.id
                      ? 'bg-primary-light text-primary'
                      : 'text-secondary hover:bg-light-200'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;