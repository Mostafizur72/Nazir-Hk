
import { Trip, MovementStatus } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-BD', { 
    style: 'currency', 
    currency: 'BDT',
    maximumFractionDigits: 0 
  }).format(amount);
};

// Party Due: Party Fare - Party Advance
export const calculatePartyDue = (trip: Trip) => {
  return trip.partyFare - trip.partyAdvanceAmount;
};

// Driver Pending calculation based on tripType
export const calculateDriverPending = (trip: Trip) => {
  if (trip.tripType === 'Local') {
    return (trip.partyFare || 0) - (trip.partyAdvanceAmount + trip.companyAdvanceAmount);
  }
  return (trip.packageAmount || 0) - (trip.partyAdvanceAmount + trip.companyAdvanceAmount);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
};
