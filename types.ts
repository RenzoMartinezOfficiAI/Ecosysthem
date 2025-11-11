export type UserRole = 'admin' | 'staff';

export interface House {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  geo?: {
    lat: number;
    lng: number;
  };
  capacity: number;
  status: 'active' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type VeteranStatus = 'veteran' | 'civilian';
export type MemberLabel = 'house_lead' | 'member' | 'staff' | 'patient' | 'other';
export type MemberStatus = 'active' | 'inactive' | 'archived';
export type BranchOfService = 'army' | 'navy' | 'air_force' | 'marine_corps' | 'coast_guard' | 'space_force';

export interface Member {
  id: string;
  fullName: string;
  dob: string;
  insuranceProvider: string;
  phone: string;
  email: string;
  status: MemberStatus;
  veteranStatus: VeteranStatus;
  branchOfService?: BranchOfService;
  label: MemberLabel;
  description: string;
  houseId: string | null;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;

  // New financial and contact fields
  monthlyBedspaceFee?: number;
  incomeAmount?: number;
  incomeSource?: string;
  paymentType?: 'self_pay' | 'sponsored';
  sponsorName?: string;
  sponsorshipLength?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  mediaReleaseCompleted?: boolean;

  // New medication fields
  onMedication?: boolean;
  medications?: string;
}

export type WorkOrderStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  houseId: string;
  status: WorkOrderStatus;
  // FIX: Changed type from WorkOrderStatus to WorkOrderPriority to match expected values.
  priority: WorkOrderPriority;
  createdBy: string; // For simplicity, using a name. In a real app, this would be a user ID.
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  memberId: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}


export type NavItem = 'dashboard' | 'houses' | 'members' | 'assignments' | 'inventory' | 'work_orders' | 'audit_log' | 'calendar';