
import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import Spinner from '../ui/Spinner';
import { Appointment } from '../../types';
import { generateCalendarDays, getMonthYear } from '../../utils/dateUtils';
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icon';
import AppointmentForm from './AppointmentForm';

interface CalendarViewProps {
  searchTerm: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ searchTerm }) => {
  const { appointments, getMemberById, loading, error } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const calendarDays = useMemo(() => generateCalendarDays(currentDate), [currentDate]);
  const { monthName, year } = getMonthYear(currentDate);
  
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const member = getMemberById(appt.memberId);
      const lowercasedTerm = searchTerm.toLowerCase();
      
      return !searchTerm || 
        appt.title.toLowerCase().includes(lowercasedTerm) ||
        (appt.description && appt.description.toLowerCase().includes(lowercasedTerm)) ||
        (member && member.fullName.toLowerCase().includes(lowercasedTerm));
    });
  }, [appointments, searchTerm, getMemberById]);

  const appointmentsByDay = useMemo(() => {
    const grouped: { [key: string]: Appointment[] } = {};
    filteredAppointments.forEach(appt => {
      const dateKey = new Date(appt.startDateTime).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appt);
    });
    return grouped;
  }, [filteredAppointments]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());
  
  const handleOpenCreateModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const statusColors: Record<Appointment['status'], string> = {
    scheduled: 'bg-primary-light text-primary border-primary',
    completed: 'bg-green-100 text-success border-success',
    cancelled: 'bg-gray-200 text-secondary border-secondary',
    no_show: 'bg-yellow-100 text-warning border-warning',
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md border border-light-300 flex flex-col h-full">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-display text-dark-900">{`${monthName} ${year}`}</h2>
            <div className="flex items-center gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-full hover:bg-light-200 text-secondary transition-colors"><ChevronLeftIcon /></button>
              <button onClick={handleNextMonth} className="p-1.5 rounded-full hover:bg-light-200 text-secondary transition-colors"><ChevronRightIcon /></button>
            </div>
            <button onClick={handleToday} className="px-3 py-1.5 text-sm font-semibold border border-light-300 rounded-md hover:bg-light-200 transition-colors shadow-sm">Today</button>
          </div>
          <button onClick={handleOpenCreateModal} className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm">
            Add Appointment
          </button>
        </header>

        <div className="grid grid-cols-7 text-center font-semibold text-secondary text-sm">
          {weekDays.map(day => <div key={day} className="py-2 border-b-2 border-light-300">{day}</div>)}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 flex-grow gap-px bg-light-300 border-l border-r border-b border-light-300 rounded-b-lg overflow-hidden">
          {calendarDays.map((day, index) => (
            <div key={index} className={`p-2 bg-white flex flex-col ${day.isCurrentMonth ? '' : 'bg-light-200 text-secondary'}`}>
              <span className={`self-start text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${day.isToday ? 'bg-primary text-white' : ''}`}>
                {day.date.getDate()}
              </span>
              <div className="mt-1 space-y-1.5 overflow-y-auto">
                {(appointmentsByDay[day.date.toDateString()] || []).map(appt => {
                  const member = getMemberById(appt.memberId);
                  return (
                    <button key={appt.id} onClick={() => handleOpenEditModal(appt)} className={`w-full text-left text-xs p-1.5 rounded border-l-4 ${statusColors[appt.status]} transition-transform hover:scale-105`}>
                      <p className="font-semibold truncate">{new Date(appt.startDateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                      <p className="truncate">{member?.fullName}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <AppointmentForm
          initialData={selectedAppointment}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CalendarView;