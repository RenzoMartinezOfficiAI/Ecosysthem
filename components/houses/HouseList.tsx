import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { House } from '../../types';
import HouseForm from './HouseEditForm';
import { PencilSquareIcon, MapPinIcon } from '../ui/Icon';

interface HouseListProps {
  searchTerm: string;
}

const HouseList: React.FC<HouseListProps> = ({ searchTerm }) => {
  const { houses, members, loading, error, addHouse, updateHouse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filteredHouses = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();

    return houses.filter(h => {
      const statusMatch = statusFilter === 'all' || h.status === statusFilter;
      
      const searchMatch = !searchTerm ||
        h.name.toLowerCase().includes(lowercasedTerm) ||
        h.address.street.toLowerCase().includes(lowercasedTerm) ||
        h.address.city.toLowerCase().includes(lowercasedTerm) ||
        h.address.zip.toLowerCase().includes(lowercasedTerm) ||
        h.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm));

      return statusMatch && searchMatch;
    });
  }, [houses, statusFilter, searchTerm]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const getMemberCount = (houseId: string) => {
    return members.filter(m => m.houseId === houseId).length;
  };

  const handleOpenEditModal = (house: House) => {
    setEditingHouse(house);
    setIsModalOpen(true);
  };
  
  const handleOpenCreateModal = () => {
    setEditingHouse(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHouse(null);
  };

  const handleSaveHouse = async (data: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingHouse) {
      await updateHouse({ ...editingHouse, ...data });
    } else {
      await addHouse(data);
    }
    handleCloseModal();
  };


  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-bold font-display text-dark-900">Houses</h2>
          <div className="flex items-center gap-4 flex-wrap bg-white p-3 rounded-xl shadow-sm border border-light-200">
             <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium text-secondary">Status:</label>
                <select 
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'archived')}
                    className="bg-light-100 border-transparent rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                </select>
             </div>
             <button
                onClick={() => setStatusFilter('all')}
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
             >
                Clear
             </button>
            <button 
              onClick={handleOpenCreateModal}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
              Add New House
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredHouses.map((house) => (
            <div key={house.id} className="bg-white rounded-xl shadow-md border border-light-200 flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1">
              {/* Card Header */}
              <div className="p-4 flex justify-between items-start border-b border-light-200">
                <div>
                  <h3 className="font-bold text-lg text-dark-900">{house.name}</h3>
                   <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                      house.status === 'active' ? 'bg-green-100 text-success' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {house.status}
                    </span>
                </div>
                <button onClick={() => handleOpenEditModal(house)} className="text-secondary hover:text-primary transition-colors p-1 rounded-md" aria-label={`Edit ${house.name}`}>
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Card Body */}
              <div className="p-4 space-y-4 flex-grow">
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                  <span>{`${house.address.street}, ${house.address.city}`}</span>
                </div>
                
                {/* Occupancy */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-semibold text-dark-800">Residents</span>
                    <span className="text-secondary">{getMemberCount(house.id)} / {house.capacity}</span>
                  </div>
                  <div className="w-full bg-light-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(getMemberCount(house.id) / house.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tags */}
                {house.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {house.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-primary-light text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredHouses.length === 0 && (
            <div className="text-center py-12 text-secondary bg-white rounded-xl shadow-sm">
                <p className="font-semibold">No houses found</p>
                <p className="text-sm">Try adjusting your filters or clearing your search.</p>
            </div>
        )}

      </div>
      {isModalOpen && (
        <HouseForm
          initialData={editingHouse}
          onSave={handleSaveHouse}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default HouseList;