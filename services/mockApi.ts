// FIX: Added InventoryItem to imports to support the new inventory feature.
import { House, Member, WorkOrder, Appointment, MaintenanceTask, InventoryItem } from '../types';
import { getCalculatedTaskStatus } from '../utils/dateUtils';

const MOCK_HOUSES: House[] = [
  { id: 'house-1', name: 'Oakwood Residence', address: { street: '123 Oak Ave', city: 'Metropolis', state: 'NY', zip: '10001' }, capacity: 8, status: 'active', tags: ['Sober Living', 'Male'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'house-2', name: 'Maple Creek Manor', address: { street: '456 Maple Dr', city: 'Metropolis', state: 'NY', zip: '10002' }, capacity: 6, status: 'active', tags: ['Transitional', 'Female'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'house-3', name: 'Pine Ridge Place', address: { street: '789 Pine St', city: 'Metropolis', state: 'NY', zip: '10003' }, capacity: 10, status: 'active', tags: ['Veteran', 'Male'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'house-4', name: 'Willow Creek Cottage', address: { street: '101 Willow Ln', city: 'Metropolis', state: 'NY', zip: '10004' }, capacity: 4, status: 'archived', tags: ['Sober Living'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_MEMBERS: Member[] = [
  { id: 'member-1', fullName: 'John Doe', dob: '1985-05-15', insuranceProvider: 'Blue Cross', phone: '555-0101', email: 'john.doe@email.com', status: 'active', veteranStatus: 'veteran', branchOfService: 'army', label: 'house_lead', description: 'Lead at Oakwood.', houseId: 'house-1', photoUrl: 'https://picsum.photos/seed/member-1/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), monthlyBedspaceFee: 750, incomeAmount: 1200, incomeSource: 'VA Disability', paymentType: 'self_pay', emergencyContactName: 'Sarah Doe', emergencyContactPhone: '555-0111', mediaReleaseCompleted: true, onMedication: true, medications: 'Lisinopril 10mg, Metformin 500mg' },
  { id: 'member-2', fullName: 'Jane Smith', dob: '1990-08-22', insuranceProvider: 'Aetna', phone: '555-0102', email: 'jane.smith@email.com', status: 'active', veteranStatus: 'civilian', label: 'member', description: 'New resident.', houseId: 'house-2', photoUrl: 'https://picsum.photos/seed/member-2/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), monthlyBedspaceFee: 700, incomeAmount: 800, incomeSource: 'Part-time job', paymentType: 'sponsored', sponsorName: 'Local Charity Foundation', sponsorshipLength: '6 months', emergencyContactName: 'Robert Smith', emergencyContactPhone: '555-0112', mediaReleaseCompleted: false, onMedication: false },
  { id: 'member-3', fullName: 'Peter Jones', dob: '1978-11-30', insuranceProvider: 'Cigna', phone: '555-0103', email: 'peter.jones@email.com', status: 'active', veteranStatus: 'veteran', branchOfService: 'marine_corps', label: 'member', description: '', houseId: 'house-1', photoUrl: 'https://picsum.photos/seed/member-3/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mediaReleaseCompleted: true, onMedication: true, medications: 'Aspirin 81mg daily' },
  { id: 'member-4', fullName: 'Mary Williams', dob: '1992-02-10', insuranceProvider: 'UnitedHealth', phone: '555-0104', email: 'mary.w@email.com', status: 'active', veteranStatus: 'civilian', label: 'member', description: '', houseId: 'house-2', photoUrl: 'https://picsum.photos/seed/member-4/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mediaReleaseCompleted: false, onMedication: false },
  { id: 'member-5', fullName: 'David Brown', dob: '1988-07-19', insuranceProvider: 'Humana', phone: '555-0105', email: 'david.b@email.com', status: 'active', veteranStatus: 'veteran', branchOfService: 'air_force', label: 'member', description: '', houseId: 'house-3', photoUrl: 'https://picsum.photos/seed/member-5/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mediaReleaseCompleted: true, onMedication: true, medications: 'Ibuprofen as needed' },
  { id: 'member-6', fullName: 'Susan Garcia', dob: '1995-01-05', insuranceProvider: 'Kaiser', phone: '555-0106', email: 'susan.g@email.com', status: 'inactive', veteranStatus: 'civilian', label: 'staff', description: 'On leave.', houseId: 'house-3', photoUrl: 'https://picsum.photos/seed/member-6/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mediaReleaseCompleted: false, onMedication: false },
  { id: 'member-7', fullName: 'Unassigned Patient', dob: '2000-01-01', insuranceProvider: 'None', phone: '555-0107', email: 'unassigned@email.com', status: 'active', veteranStatus: 'civilian', label: 'patient', description: 'Waiting for assignment.', houseId: null, photoUrl: 'https://picsum.photos/seed/member-7/100', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), mediaReleaseCompleted: true, onMedication: false },
];

const MOCK_WORK_ORDERS: WorkOrder[] = [
    { id: 'wo-1', title: 'Fix leaky faucet in kitchen', description: 'The main kitchen sink has a constant drip.', houseId: 'house-1', status: 'open', priority: 'high', createdBy: 'John Doe', createdAt: new Date('2023-10-26T10:00:00Z').toISOString(), updatedAt: new Date('2023-10-26T10:00:00Z').toISOString() },
    { id: 'wo-2', title: 'Replace porch lightbulb', description: '', houseId: 'house-2', status: 'in_progress', priority: 'low', createdBy: 'Susan Garcia', assignedTo: 'John Doe', createdAt: new Date('2023-10-25T14:30:00Z').toISOString(), updatedAt: new Date('2023-10-26T11:00:00Z').toISOString() },
    { id: 'wo-3', title: 'Mow the lawn', description: 'Front and back yards need mowing.', houseId: 'house-1', status: 'completed', priority: 'medium', createdBy: 'John Doe', assignedTo: 'Peter Jones', createdAt: new Date('2023-10-24T09:00:00Z').toISOString(), updatedAt: new Date('2023-10-25T16:00:00Z').toISOString() },
    { id: 'wo-4', title: 'Test smoke detectors', description: 'Test all smoke and CO detectors in the house.', houseId: 'house-3', status: 'cancelled', priority: 'medium', createdBy: 'David Brown', createdAt: new Date('2023-10-23T11:00:00Z').toISOString(), updatedAt: new Date('2023-10-23T12:00:00Z').toISOString() },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt-1', memberId: 'member-1', title: 'Therapy Session', startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), endDateTime: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000) + (60 * 60 * 1000)).toISOString(), status: 'scheduled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-2', memberId: 'member-2', title: 'Doctor\'s Appointment', startDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), endDateTime: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) + (45 * 60 * 1000)).toISOString(), status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-3', memberId: 'member-3', title: 'VA Follow-up', startDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), endDateTime: new Date(new Date().setDate(new Date().getDate() + 1) + 60*60000).toISOString(), status: 'scheduled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const MOCK_MAINTENANCE_TASKS_DATA: Omit<MaintenanceTask, 'status'>[] = [
  { id: 'mt-1', houseId: 'house-1', taskName: 'HVAC Filter Replacement', frequency: 'quarterly', lastCompletedDate: '2024-07-01T10:00:00Z', nextDueDate: '2024-10-01T10:00:00Z' },
  { id: 'mt-2', houseId: 'house-1', taskName: 'Smoke Detector Test', frequency: 'monthly', lastCompletedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), nextDueDate: new Date().toISOString() }, // Due Today
  { id: 'mt-3', houseId: 'house-2', taskName: 'Gutter Cleaning', frequency: 'semi-annually', lastCompletedDate: '2024-03-20T10:00:00Z', nextDueDate: '2024-09-20T10:00:00Z' },
  { id: 'mt-4', houseId: 'house-2', taskName: 'Fire Extinguisher Check', frequency: 'annually', lastCompletedDate: '2024-01-10T10:00:00Z', nextDueDate: '2025-01-10T10:00:00Z' },
  { id: 'mt-5', houseId: 'house-3', taskName: 'Yard Pest Control', frequency: 'quarterly', lastCompletedDate: '2024-05-01T10:00:00Z', nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() }, // Due Soon
  { id: 'mt-6', houseId: 'house-1', taskName: 'Plumbing Inspection', frequency: 'annually', lastCompletedDate: '2023-05-01T10:00:00Z', nextDueDate: '2024-05-01T10:00:00Z' }, // Overdue
];

const MOCK_MAINTENANCE_TASKS: MaintenanceTask[] = MOCK_MAINTENANCE_TASKS_DATA.map(task => ({
  ...task,
  status: getCalculatedTaskStatus(task.nextDueDate),
}));


// FIX: Added mock data for inventory items.
const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv-1', houseId: 'house-1', name: 'Paper Towels', quantity: 10, status: 'in_stock', lastUpdated: new Date().toISOString() },
  { id: 'inv-2', houseId: 'house-1', name: 'Toilet Paper', quantity: 2, status: 'low_stock', lastUpdated: new Date().toISOString() },
  { id: 'inv-3', houseId: 'house-2', name: 'Cleaning Spray', quantity: 5, status: 'in_stock', lastUpdated: new Date().toISOString() },
  { id: 'inv-4', houseId: 'house-2', name: 'Trash Bags', quantity: 0, status: 'out_of_stock', lastUpdated: new Date().toISOString() },
  { id: 'inv-5', houseId: 'house-3', name: 'Light Bulbs', quantity: 20, status: 'in_stock', lastUpdated: new Date().toISOString() },
];


// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getHouses = async (): Promise<House[]> => {
  await apiDelay(300);
  return MOCK_HOUSES;
};

export const getMembers = async (): Promise<Member[]> => {
  await apiDelay(300);
  return MOCK_MEMBERS;
};

export const getWorkOrders = async (): Promise<WorkOrder[]> => {
    await apiDelay(300);
    return MOCK_WORK_ORDERS;
};

export const getAppointments = async (): Promise<Appointment[]> => {
    await apiDelay(300);
    return MOCK_APPOINTMENTS;
};

export const getMaintenanceTasks = async (): Promise<MaintenanceTask[]> => {
  await apiDelay(300);
  return MOCK_MAINTENANCE_TASKS;
}

// FIX: Added function to fetch mock inventory items.
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  await apiDelay(300);
  return MOCK_INVENTORY_ITEMS;
}