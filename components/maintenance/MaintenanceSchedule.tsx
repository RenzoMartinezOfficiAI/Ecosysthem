import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { House, MaintenanceTask } from '../../types';
import HouseMaintenanceView from './HouseMaintenanceView';
import { CalendarDaysIcon } from '../ui/Icon';

interface MaintenanceScheduleProps {
  searchTerm: string;
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ searchTerm }) => {
  const { houses, maintenanceTasks, loading, error } = useData();
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const activeHouses = useMemo(() => houses.filter(h => h.status === 'active'), [houses]);

  const filteredHouses = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return activeHouses.filter(h => 
      !searchTerm || h.name.toLowerCase().includes(lowercasedTerm)
    );
  }, [activeHouses, searchTerm]);

  const getMaintenanceSummary = (houseId: string) => {
    const tasks = maintenanceTasks.filter(task => task.houseId === houseId);
    const totalTasks = tasks.length;
    let overdueOrDueCount = 0;
    
    tasks.forEach(task => {
        if (task.status === 'overdue' || task.status === 'due_today' || task.status === 'due_soon') {
            overdueOrDueCount++;
        }
    });

    return { totalTasks, overdueOrDueCount };
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (selectedHouse) {
    return <HouseMaintenanceView house={selectedHouse} onBack={() => setSelectedHouse(null)} searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display text-dark-900">Maintenance Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHouses.map(house => {
          const { totalTasks, overdueOrDueCount } = getMaintenanceSummary(house.id);
          return (
            <div 
              key={house.id} 
              onClick={() => setSelectedHouse(house)}
              className="bg-white rounded-xl shadow-md border border-light-200 flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
            >
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-dark-900">{house.name}</h3>
                  <p className="text-sm text-secondary">{totalTasks} scheduled task{totalTasks !== 1 ? 's' : ''}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-lg">
                  <CalendarDaysIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="p-4 border-t border-light-200">
                {overdueOrDueCount > 0 ? (
                  <p className="text-sm font-semibold text-warning">{overdueOrDueCount} task{overdueOrDueCount !== 1 ? 's' : ''} due or overdue</p>
                ) : (
                  <p className="text-sm font-semibold text-success">All tasks are up to date</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
       {filteredHouses.length === 0 && (
            <div className="text-center py-12 text-secondary bg-white rounded-xl shadow-sm">
                <p className="font-semibold">No houses found</p>
                <p className="text-sm">Try clearing your search.</p>
            </div>
        )}
    </div>
  );
};

export default MaintenanceSchedule;