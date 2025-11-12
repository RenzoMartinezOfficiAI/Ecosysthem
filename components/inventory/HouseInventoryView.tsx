
import React, { useMemo, useState } from 'react';
import { useData } from '../../hooks/useData';
import { InventoryItem, InventoryItemStatus, House } from '../../types';
import InventoryItemForm from './InventoryItemForm';
import { ChevronLeftIcon } from '../ui/Icon';

interface HouseInventoryViewProps {
  house: House;
  onBack: () => void;
  searchTerm: string;
}

const HouseInventoryView: React.FC<HouseInventoryViewProps> = ({ house, onBack, searchTerm }) => {
  const { inventoryItems, addInventoryItem, updateInventoryItem } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const houseInventoryItems = useMemo(() => {
    return inventoryItems.filter(item => item.houseId === house.id);
  }, [inventoryItems, house.id]);

  const filteredItems = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!searchTerm) return houseInventoryItems;
    return houseInventoryItems.filter(item => item.name.toLowerCase().includes(lowercasedTerm));
  }, [houseInventoryItems, searchTerm]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      await updateInventoryItem({ ...editingItem, ...data });
    } else {
      await addInventoryItem(data);
    }
    handleCloseModal();
  };


  const statusColors: Record<InventoryItemStatus, string> = {
    in_stock: 'bg-green-100 text-success',
    low_stock: 'bg-yellow-100 text-warning',
    out_of_stock: 'bg-red-100 text-error',
  };
  
  const formatDate = (dateString: string) => {
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
            <h2 className="text-2xl font-bold font-display text-dark-900">{house.name} Inventory</h2>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            Add New Item
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-light-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-light-200">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Item Name</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Quantity</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Status</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Last Updated</th>
                    <th className="p-4 font-semibold text-sm text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-300">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-light-200 transition-colors">
                      <td className="p-4 font-medium text-dark-800">{item.name}</td>
                      <td className="p-4 text-secondary">{item.quantity}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[item.status]}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-secondary">{formatDate(item.lastUpdated)}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleOpenEditModal(item)}
                          className="text-primary hover:underline font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {filteredItems.length === 0 && (
                 <div className="text-center py-16 text-secondary">
                    <h3 className="text-lg font-semibold text-dark-800">No inventory items found</h3>
                    <p className="text-sm mt-1">Click "Add New Item" to get started.</p>
                </div>
              )}
            </div>
        </div>
      </div>

      {isModalOpen && (
        <InventoryItemForm
          initialData={editingItem}
          onSave={handleSaveItem}
          onClose={handleCloseModal}
          houseIdForNewItem={!editingItem ? house.id : undefined}
        />
      )}
    </>
  );
};
export default HouseInventoryView;