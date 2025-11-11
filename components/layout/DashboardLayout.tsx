import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { NavItem } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeView, setActiveView, searchTerm, setSearchTerm }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  
  return (
    <div className="flex h-screen bg-light-100 font-sans text-dark-800">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          activeView={activeView}
          setActiveView={setActiveView}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-100 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;