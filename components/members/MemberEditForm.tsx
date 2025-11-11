
import React, { useState, useEffect } from 'react';
import { Member, VeteranStatus, MemberLabel, BranchOfService, MemberStatus } from '../../types';

interface MemberFormProps {
  initialData: Member | null;
  onSave: (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
  onArchive?: (memberId: string) => void;
}

const DEFAULT_MEMBER_STATE: Omit<Member, 'id' | 'createdAt' | 'updatedAt'> = {
    fullName: '',
    dob: '',
    insuranceProvider: '',
    phone: '',
    email: '',
    status: 'active',
    veteranStatus: 'civilian',
    label: 'member',
    description: '',
    houseId: null,
    photoUrl: '',
    branchOfService: undefined,
};

const MemberEditForm: React.FC<MemberFormProps> = ({ initialData, onSave, onClose, onArchive }) => {
  const [formData, setFormData] = useState(DEFAULT_MEMBER_STATE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.photoUrl || null);

  const veteranStatusOptions: VeteranStatus[] = ['veteran', 'civilian'];
  const memberLabelOptions: MemberLabel[] = ['house_lead', 'member', 'staff', 'other'];
  const memberStatusOptions: MemberStatus[] = ['active', 'inactive', 'archived'];
  const branchOfServiceOptions: { value: BranchOfService; label: string }[] = [
    { value: 'army', label: 'Army' },
    { value: 'navy', label: 'Navy' },
    { value: 'air_force', label: 'Air Force' },
    { value: 'marine_corps', label: 'Marine Corps' },
    { value: 'coast_guard', label: 'Coast Guard' },
    { value: 'space_force', label: 'Space Force' },
  ];

  useEffect(() => {
    if (initialData) {
      const { id, createdAt, updatedAt, ...editableData } = initialData;
      setFormData(editableData);
      setPreviewUrl(initialData.photoUrl);
    } else {
        setFormData(DEFAULT_MEMBER_STATE);
        setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'veteranStatus' && value === 'civilian') {
      const { branchOfService, ...rest } = formData;
      setFormData({
        ...rest,
        veteranStatus: 'civilian',
        branchOfService: undefined,
      });
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let dataToSave = { ...formData };

    if (selectedFile) {
      console.log(`Simulating upload for: ${selectedFile.name}`);
      dataToSave.photoUrl = URL.createObjectURL(selectedFile);
    }
    
    onSave(dataToSave);
  };
  
  const handleArchive = () => {
    if (initialData && onArchive) {
      if (window.confirm(`Are you sure you want to archive ${initialData.fullName}? This will move them to an archived state and they can no longer be assigned to houses.`)) {
        onArchive(initialData.id);
        onClose();
      }
    }
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 border border-light-200 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const title = initialData ? `Edit ${initialData.fullName}` : 'Add New Member';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-member-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-light-200">
          <h2 id="edit-member-title" className="text-xl font-bold font-display text-dark-900">{title}</h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={previewUrl || 'https://via.placeholder.com/100'}
                alt="Member photo preview"
                className="w-20 h-20 rounded-full object-cover bg-light-200"
              />
              <div className="flex-1">
                <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
                  Member Photo
                </label>
                <input
                  type="file"
                  id="photoUrl"
                  name="photoUrl"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-light file:text-primary
                    hover:file:bg-blue-200 file:cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName || ''} onChange={handleChange} className={inputStyles} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} className={inputStyles} required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className={inputStyles} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob || ''} onChange={handleChange} className={inputStyles} />
                </div>
                <div>
                    <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                    <input type="text" id="insuranceProvider" name="insuranceProvider" value={formData.insuranceProvider || ''} onChange={handleChange} className={inputStyles} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="veteranStatus" className="block text-sm font-medium text-gray-700">Veteran Status</label>
                    <select id="veteranStatus" name="veteranStatus" value={formData.veteranStatus} onChange={handleChange} className={inputStyles}>
                        {veteranStatusOptions.map(status => (
                            <option key={status} value={status} className="capitalize">{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
                {formData.veteranStatus === 'veteran' && (
                  <div>
                    <label htmlFor="branchOfService" className="block text-sm font-medium text-gray-700">Branch of Service</label>
                    <select id="branchOfService" name="branchOfService" value={formData.branchOfService || ''} onChange={handleChange} className={inputStyles}>
                        <option value="" disabled>Select a branch</option>
                        {branchOfServiceOptions.map(branch => (
                            <option key={branch.value} value={branch.value}>{branch.label}</option>
                        ))}
                    </select>
                  </div>
                )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="label" className="block text-sm font-medium text-gray-700">Member Label</label>
                    <select id="label" name="label" value={formData.label} onChange={handleChange} className={inputStyles}>
                        {memberLabelOptions.map(label => (
                            <option key={label} value={label} className="capitalize">{label.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                {initialData && (
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                        {memberStatusOptions.map(status => (
                            <option key={status} value={status} className="capitalize">{status}</option>
                        ))}
                    </select>
                </div>
                )}
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description || ''}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            {initialData && onArchive && initialData.status !== 'archived' && (
                <button
                    type="button"
                    onClick={handleArchive}
                    className="mr-auto px-4 py-2 rounded-lg font-semibold text-error hover:bg-red-50 transition-colors"
                >
                    Archive Member
                </button>
            )}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberEditForm;