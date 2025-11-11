
import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useData } from '../../hooks/useData';
import HouseColumn from './HouseColumn';
import MemberCard from './MemberCard';
import Spinner from '../ui/Spinner';
import { Member, MemberLabel, VeteranStatus } from '../../types';
import MemberEditForm from './MemberEditForm';

interface MembersBoardProps {
  searchTerm: string;
}

const MembersBoard: React.FC<MembersBoardProps> = ({ searchTerm }) => {
  const { houses, members, loading, error, moveMember, updateMember, archiveMember } = useData();
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  // Filter state
  const [labelFilter, setLabelFilter] = useState<MemberLabel | 'all'>('all');
  const [veteranStatusFilter, setVeteranStatusFilter] = useState<VeteranStatus | 'all'>('all');


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const filteredMembers = useMemo(() => {
    const activeMembers = members.filter(m => m.status !== 'archived');
    const lowercasedTerm = searchTerm.toLowerCase();

    return activeMembers.filter(member => {
      const labelMatch = labelFilter === 'all' || member.label === labelFilter;
      const veteranMatch = veteranStatusFilter === 'all' || member.veteranStatus === veteranStatusFilter;
      
      const searchMatch = !searchTerm ||
        member.fullName.toLowerCase().includes(lowercasedTerm) ||
        member.email.toLowerCase().includes(lowercasedTerm) ||
        member.phone.toLowerCase().includes(lowercasedTerm) ||
        member.description.toLowerCase().includes(lowercasedTerm);

      return searchMatch && labelMatch && veteranMatch;
    });
  }, [members, searchTerm, labelFilter, veteranStatusFilter]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const activeHouses = houses.filter(h => h.status === 'active');
  const unassignedMembers = filteredMembers.filter(m => !m.houseId);
  
  const clearFilters = () => {
    setLabelFilter('all');
    setVeteranStatusFilter('all');
  }

  const handleDragStart = (event: any) => {
    const { active } = event;
    const member = members.find(m => m.id === active.id);
    if (member) {
        setActiveMember(member);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveMember(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
        const newHouseId = over.id === 'unassigned-droppable' ? null : String(over.id);
        const currentHouseId = members.find(m => m.id === active.id)?.houseId ?? null;
        
        if(newHouseId !== currentHouseId) {
             moveMember(String(active.id), newHouseId);
        }
    }
  };
  
  const handleSaveMember = async (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMember) {
        await updateMember({ ...editingMember, ...data });
    }
    setEditingMember(null);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6 px-1">
            <h2 className="text-2xl font-bold font-display text-dark-900">Member Assignments</h2>
            <div className="flex items-center gap-4 flex-wrap">
                 <select
                    value={labelFilter}
                    onChange={(e) => setLabelFilter(e.target.value as MemberLabel | 'all')}
                    className="bg-light-100 border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="all">All Labels</option>
                    <option value="house_lead">House Lead</option>
                    <option value="member">Member</option>
                    <option value="staff">Staff</option>
                    <option value="other">Other</option>
                </select>
                <select
                    value={veteranStatusFilter}
                    onChange={(e) => setVeteranStatusFilter(e.target.value as VeteranStatus | 'all')}
                    className="bg-light-100 border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="all">All Statuses</option>
                    <option value="veteran">Veteran</option>
                    <option value="civilian">Civilian</option>
                </select>
                <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                    Clear Filters
                </button>
            </div>
        </div>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
            {activeHouses.map((house) => (
              <HouseColumn key={house.id} house={house}>
                {filteredMembers
                  .filter((member) => member.houseId === house.id)
                  .map((member) => (
                    <MemberCard key={member.id} member={member} onEdit={setEditingMember} />
                  ))}
              </HouseColumn>
            ))}

            <HouseColumn>
                {unassignedMembers.map((member) => (
                    <MemberCard key={member.id} member={member} onEdit={setEditingMember} />
                ))}
            </HouseColumn>

          </div>
          <DragOverlay>
            {activeMember ? <MemberCard member={activeMember} isDragging onEdit={() => {}} /> : null}
          </DragOverlay>
        </DndContext>

        {editingMember && (
            <MemberEditForm
                initialData={editingMember}
                onSave={handleSaveMember}
                onClose={() => setEditingMember(null)}
                onArchive={archiveMember}
            />
        )}
    </div>
  );
};

export default MembersBoard;