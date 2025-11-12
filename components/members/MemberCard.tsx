
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Member } from '../../types';
import { ShieldCheckIcon } from '../ui/Icon';

interface MemberCardProps {
  member: Member;
  isDragging?: boolean;
  onEdit: (member: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, isDragging = false, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: member.id,
    disabled: member.status === 'archived',
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const labelColors: { [key in Member['label']]: string } = {
    house_lead: 'bg-indigo-100 text-indigo-800',
    member: 'bg-blue-100 text-blue-800',
    staff: 'bg-gray-200 text-gray-800',
    patient: 'bg-teal-100 text-teal-800',
    other: 'bg-green-100 text-green-800',
  };
  
  const formattedLabel = member.label.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white p-4 rounded-lg shadow-sm border border-light-300 transition-all duration-200 ease-in-out flex flex-col ${isDragging ? 'shadow-2xl scale-105 z-10' : 'hover:shadow-lg hover:scale-[1.03]'}`}
    >
      <div 
        {...listeners} 
        {...attributes} 
        className="flex items-start gap-4 cursor-grab flex-grow"
        aria-label={`Drag ${member.fullName}`}
      >
        <img src={member.photoUrl} alt={member.fullName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-dark-900 truncate" title={member.fullName}>{member.fullName}</h4>
            {member.veteranStatus === 'veteran' && (
              <span className="flex-shrink-0" title="Veteran status">
                <ShieldCheckIcon className="w-4 h-4 text-primary" />
              </span>
            )}
          </div>
          <p className="text-sm text-secondary truncate" title={member.description || 'No description'}>{member.description || 'No description'}</p>
          <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${labelColors[member.label]}`}>
            {formattedLabel}
          </span>
        </div>
      </div>
       <div className="mt-4 pt-3 border-t border-light-300 flex justify-end gap-4">
          <button 
              onClick={() => onEdit(member)}
              className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              aria-label={`Edit ${member.fullName}`}
          >
              View / Edit
          </button>
      </div>
    </div>
  );
};

export default MemberCard;