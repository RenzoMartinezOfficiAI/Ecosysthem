

import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority, House } from '../../types';
import WorkOrderForm from './WorkOrderForm';

interface WorkOrderListProps {
  searchTerm: string;
}

const WorkOrderList: React.FC<WorkOrderListProps> = ({ searchTerm }) => {
  const { workOrders, houses, getHouseById, loading, error, addWorkOrder, updateWorkOrder } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'all'>('all');
  const [houseFilter, setHouseFilter] = useState<House['id'] | 'all'>('all');

  const filteredWorkOrders = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return workOrders.filter(wo => {
        const statusMatch = statusFilter === 'all' || wo.status === statusFilter;
        const priorityMatch = priorityFilter === 'all' || wo.priority === priorityFilter;
        const houseMatch = houseFilter === 'all' || wo.houseId === houseFilter;

        if (!searchTerm) {
          return statusMatch && priorityMatch && houseMatch;
        }
        
        const houseName = getHouseById(wo.houseId)?.name?.toLowerCase() || '';

        const searchMatch = 
          wo.title.toLowerCase().includes(lowercasedTerm) ||
          wo.description.toLowerCase().includes(lowercasedTerm) ||
          houseName.includes(lowercasedTerm) ||
          (wo.assignedTo && wo.assignedTo.toLowerCase().includes(lowercasedTerm)) ||
          wo.createdBy.toLowerCase().includes(lowercasedTerm);
        
        return statusMatch && priorityMatch && houseMatch && searchMatch;
    });
  }, [workOrders, statusFilter, priorityFilter, houseFilter, searchTerm, getHouseById]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  
  const clearFilters = () => {
    // Note: This does not clear the global search term, which is intentional.
    setStatusFilter('all');
    setPriorityFilter('all');
    setHouseFilter('all');
  };

  const handleOpenCreateModal = () => {
    setEditingWorkOrder(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (workOrder: WorkOrder) => {
    setEditingWorkOrder(workOrder);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWorkOrder(null);
  };

  const handleSave = async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingWorkOrder) {
        await updateWorkOrder({ ...editingWorkOrder, ...data });
    } else {
        await addWorkOrder(data);
    }
    handleCloseModal();
  };

  const statusColors: Record<WorkOrderStatus, string> = {
    open: 'bg-blue-100 text-primary',
    in_progress: 'bg-yellow-100 text-warning',
    completed: 'bg-green-100 text-success',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const priorityColors: Record<WorkOrderPriority, string> = {
    low: 'bg-gray-100 text-secondary',
    medium: 'bg-yellow-100 text-warning',
    high: 'bg-red-100 text-error',
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
  };

  const statusOptions: (WorkOrderStatus | 'all')[] = ['all', 'open', 'in_progress', 'completed', 'cancelled'];
  const priorityOptions: (WorkOrderPriority | 'all')[] = ['all', 'low', 'medium', 'high'];


  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-display text-dark-900">Work Orders</h2>
          <button onClick={handleOpenCreateModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
            Create Work Order
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-light-100 rounded-lg">
            <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium text-secondary">Status:</label>
                <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-white border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s === 'all' ? 'All' : s.replace('_', ' ')}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="priorityFilter" className="text-sm font-medium text-secondary">Priority:</label>
                <select id="priorityFilter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="bg-white border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {priorityOptions.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
            </div>
             <div className="flex items-center gap-2">
                <label htmlFor="houseFilter" className="text-sm font-medium text-secondary">House:</label>
                <select id="houseFilter" value={houseFilter} onChange={e => setHouseFilter(e.target.value)} className="bg-white border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="all">All Houses</option>
                    {houses.filter(h => h.status === 'active').map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
            </div>
            <button
                onClick={clearFilters}
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
                Clear Filters
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light-100">
              <tr>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Title</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">House</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Created By</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Priority</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Status</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Created On</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkOrders.map((wo) => (
                <tr key={wo.id} className="border-b border-light-200">
                  <td className="p-4 font-medium text-dark-800">{wo.title}</td>
                  <td className="p-4 text-secondary">{getHouseById(wo.houseId)?.name || 'N/A'}</td>
                  <td className="p-4 text-secondary">{wo.createdBy}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${priorityColors[wo.priority]}`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[wo.status]}`}>
                      {wo.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">{formatDate(wo.createdAt)}</td>
                  <td className="p-4">
                    <button onClick={() => handleOpenEditModal(wo)} className="text-primary hover:underline font-semibold">Edit</button>
                  </td>
                </tr>
              ))}
              {filteredWorkOrders.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-12 text-secondary">
                        <p className="font-semibold">No work orders found</p>
                        <p className="text-sm">Try adjusting your filters or clearing your search.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <WorkOrderForm
          workOrder={editingWorkOrder}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default WorkOrderList;