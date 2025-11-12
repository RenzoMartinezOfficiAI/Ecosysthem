
import React, { useState, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../types';
import { useData } from '../../hooks/useData';

interface WorkOrderFormProps {
  workOrder: WorkOrder | null;
  onSave: (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ workOrder, onSave, onClose }) => {
  const { houses, members } = useData();
  
  const staffAndLeads = members.filter(m => m.label === 'staff' || m.label === 'house_lead');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    houseId: houses.find(h => h.status === 'active')?.id || '',
    priority: 'medium' as WorkOrderPriority,
    status: 'open' as WorkOrderStatus,
    createdBy: staffAndLeads[0]?.fullName || '', 
  });

  useEffect(() => {
    if (workOrder) {
      setFormData({
        title: workOrder.title,
        description: workOrder.description,
        houseId: workOrder.houseId,
        priority: workOrder.priority,
        status: workOrder.status,
        createdBy: workOrder.createdBy,
      });
    }
  }, [workOrder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.houseId || !formData.createdBy) {
        alert("Please fill in the title, select a house, and specify the creator.");
        return;
    }
    onSave(formData);
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 bg-light-200 border-2 border-transparent rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const statusOptions: WorkOrderStatus[] = ['open', 'in_progress', 'completed', 'cancelled'];
  const priorityOptions: WorkOrderPriority[] = ['low', 'medium', 'high'];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-order-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-light-300">
          <h2 id="work-order-title" className="text-xl font-bold font-display text-dark-900">
            {workOrder ? 'Edit Work Order' : 'Create Work Order'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyles} required />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className={inputStyles} />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="houseId" className="block text-sm font-medium text-gray-700">House</label>
                    <select id="houseId" name="houseId" value={formData.houseId} onChange={handleChange} className={inputStyles} required>
                        <option value="" disabled>Select a house</option>
                        {houses.filter(h => h.status === 'active').map(house => (
                            <option key={house.id} value={house.id}>{house.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputStyles}>
                        {priorityOptions.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                      {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                  </select>
              </div>
              <div>
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">Created By</label>
                <select id="createdBy" name="createdBy" value={formData.createdBy} onChange={handleChange} className={inputStyles} required>
                    <option value="" disabled>Select creator</option>
                    {staffAndLeads.map(member => (
                      <option key={member.id} value={member.fullName}>{member.fullName}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex justify-end gap-3 bg-light-200 border-t border-light-300">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-dark-800 px-4 py-2 rounded-lg font-semibold hover:bg-light-300 transition-colors border border-light-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              {workOrder ? 'Save Changes' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkOrderForm;