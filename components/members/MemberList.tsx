
import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { Member, MemberStatus, VeteranStatus, MemberLabel } from '../../types';
import MemberEditForm from './MemberEditForm';
import { ShieldCheckIcon } from '../ui/Icon';

interface MemberListProps {
  searchTerm: string;
}

const MemberList: React.FC<MemberListProps> = ({ searchTerm }) => {
  const { members, getHouseById, loading, error, addMember, updateMember, archiveMember } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [veteranFilter, setVeteranFilter] = useState<VeteranStatus | 'all'>('all');
  
  const filteredMembers = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return members.filter(m => {
        const statusMatch = statusFilter === 'all' || m.status === statusFilter;
        const veteranMatch = veteranFilter === 'all' || m.veteranStatus === veteranFilter;
        
        if (!searchTerm) {
          return statusMatch && veteranMatch;
        }

        const searchMatch = 
          m.fullName.toLowerCase().includes(lowercasedTerm) ||
          m.email.toLowerCase().includes(lowercasedTerm) ||
          m.phone.toLowerCase().includes(lowercasedTerm) ||
          (getHouseById(m.houseId || '')?.name.toLowerCase().includes(lowercasedTerm));
        
        return statusMatch && veteranMatch && searchMatch;
    });
  }, [members, statusFilter, veteranFilter, searchTerm, getHouseById]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  
  const clearFilters = () => {
    setStatusFilter('all');
    setVeteranFilter('all');
  };

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };
  
  const handleSaveMember = async (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMember) {
      await updateMember({ ...editingMember, ...data });
    } else {
      await addMember(data);
    }
    handleCloseModal();
  };

  const statusColors: Record<MemberStatus, string> = {
    active: 'bg-green-100 text-success',
    inactive: 'bg-yellow-100 text-warning',
    archived: 'bg-gray-100 text-gray-500',
  };

  const labelColors: Record<MemberLabel, string> = {
    house_lead: 'bg-indigo-100 text-indigo-800',
    member: 'bg-blue-100 text-blue-800',
    staff: 'bg-gray-100 text-gray-800',
    other: 'bg-green-100 text-green-800',
  };

  const statusOptions: (MemberStatus | 'all')[] = ['all', 'active', 'inactive', 'archived'];
  const veteranOptions: (VeteranStatus | 'all')[] = ['all', 'veteran', 'civilian'];
  
  const formatLabel = (label: string) => label.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-display text-dark-900">Members</h2>
          <button onClick={handleOpenCreateModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">
            Add Member
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-light-100 rounded-lg">
            <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium text-secondary">Status:</label>
                <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="bg-white border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="veteranFilter" className="text-sm font-medium text-secondary">Veteran:</label>
                <select id="veteranFilter" value={veteranFilter} onChange={e => setVeteranFilter(e.target.value as any)} className="bg-white border-light-200 rounded-md shadow-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    {veteranOptions.map(v => <option key={v} value={v} className="capitalize">{v}</option>)}
                </select>
            </div>
            <button
                onClick={clearFilters}
                className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
                Clear Filters
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-light-100">
              <tr>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Member</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Contact</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">House</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Label</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Status</th>
                <th className="p-4 font-semibold text-sm text-secondary uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-light-200">
                  <td className="p-4">
                     <div className="flex items-center gap-3">
                        <img src={member.photoUrl} alt={member.fullName} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <p className="font-medium text-dark-800 flex items-center gap-1.5">
                                {member.fullName}
                                {member.veteranStatus === 'veteran' && (
                                    <span title="Veteran"><ShieldCheckIcon className="w-4 h-4 text-primary"/></span>
                                )}
                            </p>
                        </div>
                     </div>
                  </td>
                  <td className="p-4 text-secondary">
                    <p className="text-sm">{member.email}</p>
                    <p className="text-sm">{member.phone}</p>
                  </td>
                  <td className="p-4 text-secondary">{getHouseById(member.houseId || '')?.name || <span className="italic">Unassigned</span>}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${labelColors[member.label]}`}>
                      {formatLabel(member.label)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[member.status]}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-4">
                        <button onClick={() => handleOpenEditModal(member)} className="text-primary hover:underline font-semibold text-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-12 text-secondary">
                        <p className="font-semibold">No members found</p>
                        <p className="text-sm">Try adjusting your filters or clearing your search.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <MemberEditForm
          initialData={editingMember}
          onSave={handleSaveMember}
          onClose={handleCloseModal}
          onArchive={archiveMember}
        />
      )}
    </>
  );
};

export default MemberList;