import { MaintenanceTaskFrequency, MaintenanceTaskStatus } from "../types";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const getMonthYear = (date: Date) => {
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return { monthName, year };
};

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

  const days: CalendarDay[] = [];

  // Days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({ date, isCurrentMonth: false, isToday: false });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    });
  }

  // Days from next month
  const totalDays = days.length;
  const remainingDays = 7 - (totalDays % 7);
  if (remainingDays < 7) {
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }
  }

  return days;
};

export const calculateNextDueDate = (lastCompleted: string, frequency: MaintenanceTaskFrequency): Date => {
    const lastDate = new Date(lastCompleted);
    switch (frequency) {
        case 'weekly':
            return new Date(lastDate.setDate(lastDate.getDate() + 7));
        case 'monthly':
            return new Date(lastDate.setMonth(lastDate.getMonth() + 1));
        case 'quarterly':
            return new Date(lastDate.setMonth(lastDate.getMonth() + 3));
        case 'semi-annually':
            return new Date(lastDate.setMonth(lastDate.getMonth() + 6));
        case 'annually':
            return new Date(lastDate.setFullYear(lastDate.getFullYear() + 1));
        default:
            return new Date();
    }
};

export const getCalculatedTaskStatus = (nextDueDate: string): Exclude<MaintenanceTaskStatus, 'completed'> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff < 0) return 'overdue';
    if (daysDiff === 0) return 'due_today';
    if (daysDiff <= 7) return 'due_soon';
    return 'upcoming';
};