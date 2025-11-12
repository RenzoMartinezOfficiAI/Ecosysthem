
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { House, Member } from '../../types';
import { useData } from '../../hooks/useData';
import { PlusCircleIcon } from '../ui/Icon';

interface HouseColumnProps {
  house?: House;
  children: React.ReactNode;
}

const HouseColumn: React.FC<HouseColumnProps> = ({ house, children }) => {
  const { members } = useData();
  const id = house?.id || 'unassigned-droppable';
  const { isOver, setNodeRef } = useDroppable({ id });

  const getMemberCount = () => {
    if (!house) {
        const unassignedMembers = members.filter(m => !m.houseId && m.status !== 'archived');
        return unassignedMembers.length;
    }
    return members.filter(m => m.houseId === house.id && m.status !== 'archived').length;
  };
  
  const memberCount = getMemberCount();

  return (
    <div
      ref={setNodeRef}
      className={`w-80 flex-shrink-0 h-full bg-light-200 rounded-xl flex flex-col transition-colors duration-300 ${isOver ? 'bg-primary-light' : ''}`}
    >
      <div className="p-4 border-b-2 border-light-300">
        <h3 className="font-bold text-lg text-dark-900">{house?.name || 'Unassigned'}</h3>
        <p className="text-sm text-secondary">
          {house ? `${memberCount} / ${house.capacity} Residents` : `${memberCount} Members`}
        </p>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {children}
        {React.Children.count(children) === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-sm text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-4">
                <PlusCircleIcon className="w-8 h-8 text-gray-300 mb-2"/>
                <p>Drop members here</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HouseColumn;