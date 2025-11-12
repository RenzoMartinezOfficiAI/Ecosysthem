
import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '../../types';
import { useData } from '../../hooks/useData';

interface AppointmentFormProps {
  initialData: Appointment | null;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onClose }) => {
  const { members, addAppointment, updateAppointment } = useData();
  const [formData, setFormData] = useState({
    memberId: '',
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    status: 'scheduled' as AppointmentStatus,
  });

  useEffect(() => {
    if (initialData) {
      const start = new Date(initialData.startDateTime);
      const end = new Date(initialData.endDateTime);
      setFormData({
        memberId: initialData.memberId,
        title: initialData.title,
        description: initialData.description || '',
        startDate: start.toISOString().split('T')[0],
        startTime: start.toTimeString().substring(0, 5),
        endDate: end.toISOString().split('T')[0],
        endTime: end.toTimeString().substring(0, 5),
        status: initialData.status,
      });
    } else {
      // Set default times for new appointments
      const now = new Date();
      const defaultStart = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000); // 1 hour later

      setFormData(prev => ({
        ...prev,
        startDate: defaultStart.toISOString().split('T')[0],
        startTime: defaultStart.toTimeString().substring(0, 5),
        endDate: defaultEnd.toISOString().split('T')[0],
        endTime: defaultEnd.toTimeString().substring(0, 5),
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId || !formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
        alert("Please fill all required fields.");
        return;
    }
    
    const appointmentData = {
        memberId: formData.memberId,
        title: formData.title,
        description: formData.description,
        startDateTime: new Date(`${formData.startDate}T${formData.startTime}`).toISOString(),
        endDateTime: new Date(`${formData.endDate}T${formData.endTime}`).toISOString(),
        status: formData.status,
    };

    if (initialData) {
      await updateAppointment({ ...initialData, ...appointmentData });
    } else {
      await addAppointment(appointmentData);
    }
    onClose();
  };
  
  const inputStyles = "mt-1 block w-full px-3 py-2 bg-light-200 border-2 border-transparent rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm";
  const statusOptions: AppointmentStatus[] = ['scheduled', 'completed', 'cancelled', 'no_show'];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-form-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-light-300">
          <h2 id="appointment-form-title" className="text-xl font-bold font-display text-dark-900">
            {initialData ? 'Edit Appointment' : 'Add Appointment'}
          </h2>
          <button onClick={onClose} className="text-secondary hover:text-dark-900 text-2xl font-bold leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6 max-h-[60vh] overflow-y-auto">
            <div>
                <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">Member</label>
                <select id="memberId" name="memberId" value={formData.memberId} onChange={handleChange} className={inputStyles} required>
                    <option value="" disabled>Select a member</option>
                    {members.filter(m => m.status === 'active').map(member => (
                        <option key={member.id} value={member.id}>{member.fullName}</option>
                    ))}
                </select>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyles} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className={inputStyles} required/>
                </div>
                 <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} className={inputStyles} required/>
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className={inputStyles} required/>
                </div>
                 <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} className={inputStyles} required/>
                </div>
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyles}>
                    {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Notes</label>
              <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleChange} className={inputStyles} />
            </div>
          </div>
          
          <div className="p-6 flex justify-end gap-3 bg-light-200 border-t border-light-300">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-dark-800 px-4 py-2 rounded-lg font-semibold hover:bg-light-300 transition-colors border border-light-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              {initialData ? 'Save Changes' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;