import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import MembersBoard from './components/members/MembersBoard';
import HouseList from './components/houses/HouseList';
import WorkOrderList from './components/work_orders/WorkOrderList';
import { DataProvider } from './hooks/useData';
import { NavItem } from './types';
import MemberList from './components/members/MemberList';
import CalendarView from './components/calendar/CalendarView';
import MaintenanceSchedule from './components/maintenance/MaintenanceSchedule';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItem>('members');
  const [searchTerm, setSearchTerm] = useState('');

  const renderActiveView = () => {
    switch (activeView) {
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
        return <MaintenanceSchedule searchTerm={searchTerm} />;
      default:
        return <MemberList searchTerm={searchTerm} />;
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

export default App;