
import React, { useMemo, useState } from 'react';
import { useData } from '../../hooks/useData';
import { MaintenanceTask, MaintenanceTaskStatus, House } from '../../types';
import MaintenanceTaskForm from './MaintenanceTaskForm';
import { ChevronLeftIcon } from '../ui/Icon';
import { calculateNextDueDate } from '../../utils/dateUtils';

interface HouseMaintenanceViewProps {
  house: House;
  onBack: () => void;
  searchTerm: string;
}

const HouseMaintenanceView: React.FC<HouseMaintenanceViewProps> = ({ house, onBack, searchTerm }) => {
  const { maintenanceTasks, updateMaintenanceTask, addMaintenanceTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);

  const houseMaintenanceTasks = useMemo(() => {
    return maintenanceTasks.filter(item => item.houseId === house.id);
  }, [maintenanceTasks, house.id]);

  const filteredItems = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!searchTerm) return houseMaintenanceTasks;
    return houseMaintenanceTasks.filter(item => item.taskName.toLowerCase().includes(lowercasedTerm));
  }, [houseMaintenanceTasks, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (task: MaintenanceTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (data: Omit<MaintenanceTask, 'id' | 'nextDueDate' | 'status'>) => {
    if (editingTask) {
        const newNextDueDate = calculateNextDueDate(data.lastCompletedDate, data.frequency).toISOString();
        await updateMaintenanceTask({ ...editingTask, ...data, nextDueDate: newNextDueDate });
    } else {
        await addMaintenanceTask(data);
    }
    handleCloseModal();
  };

  const handleStatusChange = (task: MaintenanceTask, newStatus: MaintenanceTaskStatus) => {
    if (newStatus === 'completed') {
        const newLastCompletedDate = new Date().toISOString();
        const newNextDueDate = calculateNextDueDate(newLastCompletedDate, task.frequency).toISOString();
        updateMaintenanceTask({
            ...task,
            status: 'completed',
            lastCompletedDate: newLastCompletedDate,
            nextDueDate: newNextDueDate,
        });
    } else { 
        // Reverting from completed, just change status, it will be re-calculated on next load
        updateMaintenanceTask({ ...task, status: newStatus });
    }
  };

  const statusColors: Record<MaintenanceTaskStatus, string> = {
    overdue: 'bg-red-100 text-error',
    due_today: 'bg-yellow-100 text-warning',
    due_soon: 'bg-yellow-100 text-warning',
    upcoming: 'bg-blue-100 text-primary',
    completed: 'bg-green-100 text-success',
  };
  
  const statusDisplayNames: Record<MaintenanceTaskStatus, string> = {
    overdue: 'Overdue',
    due_today: 'Due Today',
    due_soon: 'Due Soon',
    upcoming: 'Upcoming',
    completed: 'Completed',
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-light-200 transition-colors">
                <ChevronLeftIcon className="w-5 h-5 text-secondary" />
            </button>
            <h2 className="text-2xl font-bold font-display text-dark-900">{house.name} Maintenance</h2>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            Add New Task
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-light-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-light-200">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Task</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Frequency</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Last Completed</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Next Due</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Status</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-300">
                  {filteredItems.map((task) => (
                    <tr key={task.id} className="hover:bg-light-200 transition-colors">
                      <td className="p-4 font-medium text-dark-800">{task.taskName}</td>
                      <td className="p-4 text-secondary capitalize">{task.frequency.replace('-',' ')}</td>
                      <td className="p-4 text-secondary">{formatDate(task.lastCompletedDate)}</td>
                      <td className="p-4 text-secondary font-medium">{formatDate(task.nextDueDate)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[task.status]}`}>
                          {statusDisplayNames[task.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-4 items-center">
                          <select
                            value={task.status === 'completed' ? 'completed' : 'pending'}
                            onChange={(e) => handleStatusChange(task, e.target.value as MaintenanceTaskStatus)}
                            className="bg-light-200 border-transparent rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                          >
                           {task.status === 'completed' ? (
                              <option value="completed">Completed</option>
                           ) : (
                              <option value="pending">Mark as...</option>
                           )}
                           <option value="completed">Completed</option>
                          </select>
                          <button 
                            onClick={() => handleOpenEditModal(task)}
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && (
                 <div className="text-center py-16 text-secondary">
                    <h3 className="text-lg font-semibold text-dark-800">No maintenance tasks found</h3>
                    <p className="text-sm mt-1">Click "Add New Task" to get started.</p>
                </div>
              )}
            </div>
        </div>
      </div>

      {isModalOpen && (
        <MaintenanceTaskForm
          initialData={editingTask}
          onSave={handleSaveTask}
          onClose={handleCloseModal}
          houseIdForNewTask={house.id}
        />
      )}
    </>
  );
};
export default HouseMaintenanceView;