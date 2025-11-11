import { House, Member, WorkOrder, Appointment } from '../types';

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
    { id: 'wo-4', title: 'Paint common room', description: 'Common room walls are scuffed and need a fresh coat of paint.', houseId: 'house-3', status: 'open', priority: 'medium', createdBy: 'Susan Garcia', createdAt: new Date('2023-10-27T11:00:00Z').toISOString(), updatedAt: new Date('2023-10-27T11:00:00Z').toISOString() },
];

const getFutureDate = (days: number, hour: number, minute: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
}

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt-1', memberId: 'member-1', title: 'Annual Check-up', startDateTime: getFutureDate(3, 10, 0), endDateTime: getFutureDate(3, 11, 0), status: 'scheduled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-2', memberId: 'member-2', title: 'Dental Cleaning', startDateTime: getFutureDate(5, 14, 30), endDateTime: getFutureDate(5, 15, 30), status: 'scheduled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-3', memberId: 'member-3', title: 'Physical Therapy', startDateTime: getFutureDate(3, 10, 0), endDateTime: getFutureDate(3, 11, 0), status: 'completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-4', memberId: 'member-4', title: 'Follow-up', startDateTime: getFutureDate(10, 9, 0), endDateTime: getFutureDate(10, 9, 30), status: 'scheduled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'appt-5', memberId: 'member-1', title: 'Specialist Consultation', startDateTime: getFutureDate(12, 11, 0), endDateTime: getFutureDate(12, 12, 0), status: 'cancelled', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getHouses = async (): Promise<House[]> => {
  await delay(500);
  return MOCK_HOUSES;
};

export const getMembers = async (): Promise<Member[]> => {
  await delay(500);
  return MOCK_MEMBERS;
};

export const getWorkOrders = async (): Promise<WorkOrder[]> => {
    await delay(500);
    return MOCK_WORK_ORDERS;
};

export const getAppointments = async (): Promise<Appointment[]> => {
    await delay(500);
    return MOCK_APPOINTMENTS;
};