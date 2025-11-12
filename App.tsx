import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import MembersBoard from './components/members/MembersBoard';
import HouseList from './components/houses/HouseList';
import WorkOrderList from './components/work_orders/WorkOrderList';
import { DataProvider } from './hooks/useData';
import { NavItem, User } from './types';
import MemberList from './components/members/MemberList';
import CalendarView from './components/calendar/CalendarView';
import MaintenanceSchedule from './components/maintenance/MaintenanceSchedule';
import InventoryList from './components/inventory/InventoryList';
import Dashboard from './components/dashboard/Dashboard';
import SmartReportGenerator from './components/reports/SmartReportGenerator';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginScreen from './components/auth/LoginScreen';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItem>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'houses':
        return <HouseList searchTerm={searchTerm} />;
      case 'members':
        return <MemberList searchTerm={searchTerm} />;
      case 'assignments':
        return <MembersBoard searchTerm={searchTerm} />;
      case 'work_orders':
        return <WorkOrderList searchTerm={searchTerm} />;
      case 'calendar':
        return <CalendarView searchTerm={searchTerm} />;
      case 'inventory':
        return <InventoryList searchTerm={searchTerm} />;
      case 'maintenance':
        return <MaintenanceSchedule searchTerm={searchTerm} />;
      case 'reporting':
        return <SmartReportGenerator />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <DataProvider>
      <DashboardLayout 
        activeView={activeView} 
        setActiveView={setActiveView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      >
        {renderActiveView()}
      </DashboardLayout>
    </DataProvider>
  );
};

const App: React.FC = () => {
    const { isAuthenticated, user, login, logout } = useAuth();

    return isAuthenticated ? <AppContent /> : <LoginScreen onLogin={login} />;
}

const AppWrapper: React.FC = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default AppWrapper;