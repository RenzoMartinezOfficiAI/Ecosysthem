import React, { useState, useEffect } from 'react';
import { House } from '../../types';

interface HouseFormProps {
  initialData?: House | null;
  onSave: (data: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const DEFAULT_HOUSE_STATE: Omit<House, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    address: { street: '', city: '', state: '', zip: '' },
    geo: { lat: 0, lng: 0},
    capacity: 0,
    status: 'active',
    tags: [],
};


const HouseForm: React.FC<HouseFormProps> = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(DEFAULT_HOUSE_STATE);

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...editableData } = initialData;
      setFormData(editableData);
    } else {
      setFormData(DEFAULT_HOUSE_STATE);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name === 'tags') {
      setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (name === 'capacity') {
      setFormData(prev => ({ ...prev, capacity: parseInt(value, 10) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value as any }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 border border-light-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="house-form-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl m-4 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-light-200">
          <h2 id="house-form-title" className="text-xl font-bold font-display text-dark-900">
            {initialData ? `Edit ${initialData.name}` : 'Add New House'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">House Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyles} required />
            </div>

            <fieldset className="border p-4 rounded-md">
                <legend className="text-sm font-medium text-gray-700 px-2">Address</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street</label>
                        <input type="text" id="address.street" name="address.street" value={formData.address.street} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" id="address.city" name="address.city" value={formData.address.city} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">State</label>
                        <input type="text" id="address.state" name="address.state" value={formData.address.state} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700">Zip Code</label>
                        <input type="text" id="address.zip" name="address.zip" value={formData.address.zip} onChange={handleChange} className={inputStyles} />
                    </div>
                </div>
            </fieldset>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} className={inputStyles} />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleChange} className={inputStyles} />
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
              {initialData ? 'Save Changes' : 'Create House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseForm;