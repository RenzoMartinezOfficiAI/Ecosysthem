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
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-light-100">
                <ChevronLeftIcon className="w-5 h-5 text-secondary" />
            </button>
            <h2 className="text-2xl font-bold font-display text-dark-900">{house.name} Inventory</h2>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            Add New Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light-100">
              <tr>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Item Name</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Quantity</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Status</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Last Updated</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-light-200">
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
              {filteredItems.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-secondary">
                        <p className="font-semibold">No inventory items found for this house.</p>
                        <p className="text-sm">Click "Add New Item" to get started.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
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
