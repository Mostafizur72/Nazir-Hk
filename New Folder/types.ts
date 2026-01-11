
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  SUB_MANAGER = 'SUB_MANAGER',
  UJALA_MANAGER = 'UJALA_MANAGER',
  DRIVER = 'DRIVER'
}

export type SubManagerType = 'IMPORT' | 'EXPORT';

export enum MovementStatus {
  INPUT = 'Add Trip', 
  EXPORT = 'Export (Return)',
  LOCAL = 'Local'
}

export enum TripStatus {
  LOADING = 'Loading',
  RUNNING = 'Running',
  DELAYED = 'Delayed',
  UNLOADED = 'Unloaded',
  COMPLETED = 'Completed'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  photoUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  assignedManagerId?: string;
  address?: string; 
  subManagerType?: SubManagerType;
  // New Fields
  nidNumber?: string;
  licenseNumber?: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  driverId: string;
  ownerName: string;
  isActive: boolean;
  // New Expiry Fields
  taxTokenExpiry?: string;
  fitnessExpiry?: string;
  roadPermitExpiry?: string;
}

export interface TripRequest {
  id: string;
  vehicleId: string;
  subManagerId: string;
  loadingPoint: string;
  unloadingPoint: string;
  rentCompany: string;
  estimatedFare: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'declined';
  requestType: 'INPUT' | 'EXPORT';
}

export interface PaymentRequest {
  id: string;
  requesterId: string;
  managerId: string;
  payerType: 'উজালা' | 'বাহির';
  movementStatus: MovementStatus;
  vehicleId: string;
  tripIds: string[];
  amount: number;
  status: 'pending' | 'confirmed' | 'rejected';
  date: string;
  notes?: string;
}

export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  managerId: string;
  movementStatus: MovementStatus;
  rentCompany: string; 
  loadingPoint: string;
  unloadingPoint: string;
  tripType: 'Input' | 'Local'; 
  partyFare: number; 
  packageAmount: number; 
  partyAdvanceAmount: number; 
  companyAdvanceAmount: number; 
  totalAdvancePaid: number; 
  date: string;
  status: TripStatus;
  isExportSettled?: boolean; 
  relatedTripId?: string;
  unloadingDate?: string;
}

export interface Payment {
  id: string;
  paymentType: 'Single Trip' | 'Monthly' | 'Driver Settlement' | 'Salary' | 'Ujala Request';
  vehicleId?: string;
  tripIds?: string[];
  amount: number;
  remainingDue: number;
  date: string;
  notes?: string;
  requestId?: string;
}

export interface SalaryAdvance {
  id: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  driverId: string;
  month: string;
  baseSalary: number;
  bonus: number;
  advances: SalaryAdvance[];
  isSettled: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface AppSettings {
  appName: string;
  appIcon: string;
  featuresEnabled: {
    chat: boolean;
    reports: boolean;
    payments: boolean;
  };
}
