
import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { NavItem } from '../../types';
import { UsersIcon, ClipboardListIcon, CalendarDaysIcon, CubeIcon } from '../ui/Icon';

interface DashboardProps {
    setActiveView: (view: NavItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { members, workOrders, maintenanceTasks, inventoryItems, getHouseById, loading, error } = useData();

  const summaries = useMemo(() => {
    const activeMembers = members.filter(m => m.status === 'active');
    
    const urgentMaintenanceTasks = maintenanceTasks.filter(t => t.status === 'overdue' || t.status === 'due_today');
    const dueSoonMaintenanceTasks = maintenanceTasks.filter(t => t.status === 'due_soon');

    const openWorkOrders = workOrders.filter(wo => wo.status === 'open' || wo.status === 'in_progress');
    const highPriorityWorkOrders = openWorkOrders.filter(wo => wo.priority === 'high');

    const lowStockItems = inventoryItems.filter(i => i.status === 'low_stock');
    const outOfStockItems = inventoryItems.filter(i => i.status === 'out_of_stock');
    
    return {
      activeMembers,
      urgentMaintenanceTasks,
      dueSoonMaintenanceTasks,
      openWorkOrders,
      highPriorityWorkOrders,
      lowStockItems,
      outOfStockItems,
    };
  }, [members, workOrders, maintenanceTasks, inventoryItems]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const quickActionClasses = "text-center bg-white p-6 rounded-xl shadow-md border border-light-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-dark-900">Welcome back, Admin!</h1>
        <p className="text-secondary mt-1">Here's a quick overview of your Ecosysthem.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={quickActionClasses} onClick={() => setActiveView('members')}>
          <UsersIcon className="mx-auto h-10 w-10 text-primary" />
          <p className="text-4xl font-bold text-dark-900 mt-3">{summaries.activeMembers.length}</p>
          <p className="text-sm font-semibold text-secondary mt-1">Active Members</p>
        </div>
        <div className={quickActionClasses} onClick={() => setActiveView('maintenance')}>
          <CalendarDaysIcon className="mx-auto h-10 w-10 text-warning" />
          <p className="text-4xl font-bold text-dark-900 mt-3">{summaries.urgentMaintenanceTasks.length}</p>
          <p className="text-sm font-semibold text-secondary mt-1">Urgent Maintenance Tasks</p>
        </div>
        <div className={quickActionClasses} onClick={() => setActiveView('work_orders')}>
          <ClipboardListIcon className="mx-auto h-10 w-10 text-error" />
          <p className="text-4xl font-bold text-dark-900 mt-3">{summaries.openWorkOrders.length}</p>
          <p className="text-sm font-semibold text-secondary mt-1">Open Work Orders</p>
        </div>
        <div className={quickActionClasses} onClick={() => setActiveView('inventory')}>
          <CubeIcon className="mx-auto h-10 w-10 text-secondary" />
          <p className="text-4xl font-bold text-dark-900 mt-3">{summaries.outOfStockItems.length}</p>
          <p className="text-sm font-semibold text-secondary mt-1">Items Out of Stock</p>
        </div>
      </div>
      
      {/* Detailed Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Work Orders */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-light-300">
            <h3 className="font-bold text-lg text-dark-900 mb-4">High Priority Work Orders</h3>
            {summaries.highPriorityWorkOrders.length > 0 ? (
                <ul className="space-y-3">
                    {summaries.highPriorityWorkOrders.slice(0, 5).map(wo => (
                        <li key={wo.id} className="flex justify-between items-center text-sm p-3 bg-light-200 rounded-lg">
                            <div>
                                <p className="font-semibold text-dark-800">{wo.title}</p>
                                <p className="text-secondary">{getHouseById(wo.houseId)?.name}</p>
                            </div>
                            <span className="font-bold text-error">HIGH</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-secondary py-8">No high priority work orders.</p>
            )}
        </div>
        
        {/* Inventory Alerts */}
         <div className="bg-white p-6 rounded-xl shadow-md border border-light-300">
            <h3 className="font-bold text-lg text-dark-900 mb-4">Inventory Alerts</h3>
             {summaries.outOfStockItems.length > 0 || summaries.lowStockItems.length > 0 ? (
                <ul className="space-y-3">
                    {summaries.outOfStockItems.slice(0, 3).map(item => (
                         <li key={item.id} className="flex justify-between items-center text-sm p-3 bg-light-200 rounded-lg">
                            <div>
                                <p className="font-semibold text-dark-800">{item.name}</p>
                                <p className="text-secondary">{getHouseById(item.houseId)?.name}</p>
                            </div>
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-error">Out of Stock</span>
                        </li>
                    ))}
                     {summaries.lowStockItems.slice(0, 2).map(item => (
                         <li key={item.id} className="flex justify-between items-center text-sm p-3 bg-light-200 rounded-lg">
                            <div>
                                <p className="font-semibold text-dark-800">{item.name}</p>
                                <p className="text-secondary">{getHouseById(item.houseId)?.name}</p>
                            </div>
                             <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-warning">Low Stock</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-secondary py-8">Inventory levels look good.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;