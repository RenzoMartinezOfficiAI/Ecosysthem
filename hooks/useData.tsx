import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { House, Member, WorkOrder, Appointment } from '../types';
import { getHouses, getMembers, getWorkOrders, getAppointments } from '../services/mockApi';

interface DataContextType {
  houses: House[];
  members: Member[];
  workOrders: WorkOrder[];
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  moveMember: (memberId: string, newHouseId: string | null) => Promise<void>;
  addMember: (newMemberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMember: (updatedMember: Member) => Promise<void>;
  archiveMember: (memberId: string) => Promise<void>;
  addWorkOrder: (newWorkOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkOrder: (updatedWorkOrder: WorkOrder) => Promise<void>;
  addHouse: (newHouse: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHouse: (updatedHouse: House) => Promise<void>;
  getHouseById: (houseId: string) => House | undefined;
  getMemberById: (memberId: string) => Member | undefined;
  addAppointment: (newAppointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (updatedAppointment: Appointment) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [housesData, membersData, workOrdersData, appointmentsData] = await Promise.all([
        getHouses(), 
        getMembers(),
        getWorkOrders(),
        getAppointments(),
      ]);
      setHouses(housesData);
      setMembers(membersData);
      setWorkOrders(workOrdersData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const moveMember = async (memberId: string, newHouseId: string | null) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === memberId ? { ...member, houseId: newHouseId } : member
      )
    );
    console.log(`Moved member ${memberId} to house ${newHouseId}. An audit log should be created.`);
  };
  
  const addMember = async (newMemberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMember: Member = {
        ...newMemberData,
        id: `member-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
    console.log(`Created member ${newMember.id}. An audit log should be created.`);
  };

  const updateMember = async (updatedMember: Member) => {
    setMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === updatedMember.id ? { ...updatedMember, updatedAt: new Date().toISOString() } : member
      )
    );
    console.log(`Updated member ${updatedMember.id}. An audit log should be created.`);
  };

  const archiveMember = async (memberId: string) => {
    setMembers(prevMembers =>
        prevMembers.map(member =>
            member.id === memberId ? { ...member, status: 'archived', houseId: null } : member
        )
    );
    console.log(`Archived member ${memberId}. An audit log should be created.`);
  };

  const addWorkOrder = async (newWorkOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const workOrder: WorkOrder = {
        ...newWorkOrder,
        id: `wo-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setWorkOrders(prev => [...prev, workOrder]);
    console.log(`Created work order ${workOrder.id} for house ${workOrder.houseId}.`);
  };

  const updateWorkOrder = async (updatedWorkOrder: WorkOrder) => {
    setWorkOrders(prev =>
        prev.map(wo =>
            wo.id === updatedWorkOrder.id ? { ...updatedWorkOrder, updatedAt: new Date().toISOString() } : wo
        )
    );
    console.log(`Updated work order ${updatedWorkOrder.id}.`);
  };

  const addHouse = async (newHouseData: Omit<House, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHouse: House = {
        ...newHouseData,
        id: `house-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setHouses(prev => [...prev, newHouse]);
    console.log(`Created house ${newHouse.id}. An audit log should be created.`);
  };

  const updateHouse = async (updatedHouse: House) => {
    setHouses(prevHouses =>
      prevHouses.map(house =>
        house.id === updatedHouse.id ? { ...updatedHouse, updatedAt: new Date().toISOString() } : house
      )
    );
    console.log(`Updated house ${updatedHouse.id}. An audit log should be created.`);
  };

  const addAppointment = async (newAppointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: `appt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    console.log(`Created appointment ${newAppointment.id} for member ${newAppointment.memberId}.`);
  };

  const updateAppointment = async (updatedAppointment: Appointment) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.id === updatedAppointment.id ? { ...updatedAppointment, updatedAt: new Date().toISOString() } : appt
      )
    );
    console.log(`Updated appointment ${updatedAppointment.id}.`);
  };

  const getHouseById = useCallback((houseId: string) => {
    return houses.find(h => h.id === houseId);
  }, [houses]);

  const getMemberById = useCallback((memberId: string) => {
    return members.find(m => m.id === memberId);
  }, [members]);

  const value = { houses, members, workOrders, appointments, loading, error, moveMember, addMember, updateMember, archiveMember, addWorkOrder, updateWorkOrder, addHouse, updateHouse, getHouseById, getMemberById, addAppointment, updateAppointment };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};