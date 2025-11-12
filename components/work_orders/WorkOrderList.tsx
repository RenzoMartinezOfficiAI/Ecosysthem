
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
    cancelled: 'bg-gray-200 text-secondary',
  };

  const priorityColors: Record<WorkOrderPriority, string> = {
    low: 'bg-gray-200 text-secondary',
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
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-2xl font-bold font-display text-dark-900">Work Orders</h2>
            <button onClick={handleOpenCreateModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm">
                Create Work Order
            </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-xl shadow-sm border border-light-300">
            <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium text-secondary">Status:</label>
                <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-light-200 border-transparent rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light">
                    {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="priorityFilter" className="text-sm font-medium text-secondary">Priority:</label>
                <select id="priorityFilter" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="bg-light-200 border-transparent rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light">
                    {priorityOptions.map(p => <option key={p} value={p} className="capitalize">{p === 'all' ? 'All Priorities' : p}</option>)}
                </select>
            </div>
             <div className="flex items-center gap-2">
                <label htmlFor="houseFilter" className="text-sm font-medium text-secondary">House:</label>
                <select id="houseFilter" value={houseFilter} onChange={e => setHouseFilter(e.target.value)} className="bg-light-200 border-transparent rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light">
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

        <div className="bg-white rounded-xl shadow-md border border-light-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-light-200">
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
                <tbody className="divide-y divide-light-300">
                  {filteredWorkOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-light-200 transition-colors">
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
                </tbody>
              </table>
               {filteredWorkOrders.length === 0 && (
                    <div className="text-center py-16 text-secondary">
                        <h3 className="text-lg font-semibold text-dark-800">No work orders found</h3>
                        <p className="text-sm mt-1">Try adjusting your filters or clearing your search.</p>
                    </div>
                )}
            </div>
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