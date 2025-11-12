import React, { useState, useEffect } from 'react';
import { InventoryItem, InventoryItemStatus } from '../../types';
import { useData } from '../../hooks/useData';

interface InventoryItemFormProps {
  initialData: InventoryItem | null;
  onSave: (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  onClose: () => void;
  houseIdForNewItem?: string;
}

const DEFAULT_ITEM_STATE: Omit<InventoryItem, 'id' | 'lastUpdated'> = {
  name: '',
  houseId: '',
  quantity: 0,
  status: 'in_stock',
};

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({ initialData, onSave, onClose, houseIdForNewItem }) => {
  const { houses } = useData();
  const [formData, setFormData] = useState(DEFAULT_ITEM_STATE);

  useEffect(() => {
    if (initialData) {
      const { id, lastUpdated, ...editableData } = initialData;
      setFormData(editableData);
    } else {
      setFormData({
        ...DEFAULT_ITEM_STATE,
        houseId: houseIdForNewItem || houses.find(h => h.status === 'active')?.id || '',
      });
    }
  }, [initialData, houses, houseIdForNewItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.houseId) {
      alert("Please provide an item name and select a house.");
      return;
    }
    onSave(formData);
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 border border-light-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const statusOptions: InventoryItemStatus[] = ['in_stock', 'low_stock', 'out_of_stock'];
  const isCreatingForSpecificHouse = !initialData && !!houseIdForNewItem;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-item-form-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-light-200">
          <h2 id="inventory-item-form-title" className="text-xl font-bold font-display text-dark-900">
            {initialData ? 'Edit Inventory Item' : 'Add New Item'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="houseId" className="block text-sm font-medium text-gray-700">House</label>
                <select
                  id="houseId"
                  name="houseId"
                  value={formData.houseId}
                  onChange={handleChange}
                  className={`${inputStyles} ${isCreatingForSpecificHouse ? 'bg-light-100' : ''}`}
                  required
                  disabled={isCreatingForSpecificHouse}
                >
                  <option value="" disabled>Select a house</option>
                  {houses.filter(h => h.status === 'active').map(house => (
                      <option key={house.id} value={house.id}>{house.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className={inputStyles} min="0" />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
              </select>
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
              {initialData ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryItemForm;
