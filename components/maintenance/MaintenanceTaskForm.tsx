import React, { useState, useEffect } from 'react';
import { MaintenanceTask, MaintenanceTaskFrequency } from '../../types';
import { useData } from '../../hooks/useData';

interface MaintenanceTaskFormProps {
  initialData: MaintenanceTask | null;
  onSave: (data: Omit<MaintenanceTask, 'id' | 'nextDueDate' | 'status'>) => void;
  onClose: () => void;
  houseIdForNewTask: string;
}

const DEFAULT_TASK_STATE: Omit<MaintenanceTask, 'id' | 'nextDueDate' | 'status'> = {
  taskName: '',
  houseId: '',
  description: '',
  frequency: 'monthly',
  lastCompletedDate: new Date().toISOString().split('T')[0],
};

const MaintenanceTaskForm: React.FC<MaintenanceTaskFormProps> = ({ initialData, onSave, onClose, houseIdForNewTask }) => {
  const [formData, setFormData] = useState(DEFAULT_TASK_STATE);

  useEffect(() => {
    if (initialData) {
      const { id, nextDueDate, status, ...editableData } = initialData;
      setFormData({
        ...editableData,
        lastCompletedDate: new Date(editableData.lastCompletedDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        ...DEFAULT_TASK_STATE,
        houseId: houseIdForNewTask,
        lastCompletedDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, houseIdForNewTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskName || !formData.houseId || !formData.lastCompletedDate) {
      alert("Please provide a task name, house, and last completed date.");
      return;
    }
    const dataToSave = {
        ...formData,
        lastCompletedDate: new Date(formData.lastCompletedDate).toISOString(),
    };
    onSave(dataToSave);
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 border border-light-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const frequencyOptions: MaintenanceTaskFrequency[] = ['weekly', 'monthly', 'quarterly', 'semi-annually', 'annually'];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="maintenance-task-form-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-light-200">
          <h2 id="maintenance-task-form-title" className="text-xl font-bold font-display text-dark-900">
            {initialData ? 'Edit Maintenance Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
              <input type="text" id="taskName" name="taskName" value={formData.taskName} onChange={handleChange} className={inputStyles} required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className={inputStyles} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  {frequencyOptions.map(f => <option key={f} value={f} className="capitalize">{f.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="lastCompletedDate" className="block text-sm font-medium text-gray-700">Last Completed On</label>
                <input type="date" id="lastCompletedDate" name="lastCompletedDate" value={formData.lastCompletedDate} onChange={handleChange} className={inputStyles} required/>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-light-100 text-dark-800 px-4 py-2 rounded-lg font-semibold hover:bg-light-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceTaskForm;