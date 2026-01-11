
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Vehicle, Trip, Payment, ChatMessage, AppSettings, UserRole, SalaryRecord, TripRequest, PaymentRequest } from './types';
import { INITIAL_APP_SETTINGS, SUPER_ADMIN_CREDENTIALS } from './constants';

interface AppState {
  currentUser: User | null;
  users: User[];
  vehicles: Vehicle[];
  trips: Trip[];
  tripRequests: TripRequest[];
  paymentRequests: PaymentRequest[];
  payments: Payment[];
  messages: ChatMessage[];
  salaries: SalaryRecord[];
  settings: AppSettings;
  login: (id: string, password?: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addTripRequest: (req: TripRequest) => void;
  updateTripRequest: (req: TripRequest) => void;
  deleteTripRequest: (id: string) => void;
  addPaymentRequest: (req: PaymentRequest) => void;
  updatePaymentRequest: (req: PaymentRequest) => void;
  addPayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  addMessage: (msg: ChatMessage) => void;
  updateSettings: (s: AppSettings) => void;
  updateSalary: (record: SalaryRecord) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tms_users');
    if (saved) return JSON.parse(saved);
    return [{ id: 'super-admin-1', name: 'Super Admin', email: SUPER_ADMIN_CREDENTIALS.email, phone: '0123456789', password: SUPER_ADMIN_CREDENTIALS.password, role: UserRole.SUPER_ADMIN, isActive: true }];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => JSON.parse(localStorage.getItem('tms_vehicles') || '[]'));
  const [trips, setTrips] = useState<Trip[]>(() => JSON.parse(localStorage.getItem('tms_trips') || '[]'));
  const [tripRequests, setTripRequests] = useState<TripRequest[]>(() => JSON.parse(localStorage.getItem('tms_trip_requests') || '[]'));
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => JSON.parse(localStorage.getItem('tms_payment_requests') || '[]'));
  const [payments, setPayments] = useState<Payment[]>(() => JSON.parse(localStorage.getItem('tms_payments') || '[]'));
  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => JSON.parse(localStorage.getItem('tms_salaries') || '[]'));
  const [messages, setMessages] = useState<ChatMessage[]>(() => JSON.parse(localStorage.getItem('tms_messages') || '[]'));
  const [settings, setSettings] = useState<AppSettings>(() => JSON.parse(localStorage.getItem('tms_settings') || JSON.stringify(INITIAL_APP_SETTINGS)));

  useEffect(() => {
    localStorage.setItem('tms_users', JSON.stringify(users));
    localStorage.setItem('tms_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('tms_trips', JSON.stringify(trips));
    localStorage.setItem('tms_trip_requests', JSON.stringify(tripRequests));
    localStorage.setItem('tms_payment_requests', JSON.stringify(paymentRequests));
    localStorage.setItem('tms_payments', JSON.stringify(payments));
    localStorage.setItem('tms_salaries', JSON.stringify(salaries));
    localStorage.setItem('tms_messages', JSON.stringify(messages));
    localStorage.setItem('tms_settings', JSON.stringify(settings));
    localStorage.setItem('tms_current_user', JSON.stringify(currentUser));
  }, [users, vehicles, trips, tripRequests, paymentRequests, payments, salaries, messages, settings, currentUser]);

  const login = (id: string, password?: string) => {
    const user = users.find(u => (u.email === id || u.phone === id) && u.password === password);
    if (user && user.isActive) { setCurrentUser(user); return true; }
    return false;
  };

  const logout = () => setCurrentUser(null);
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const updateUser = (user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  
  const addVehicle = (v: Vehicle) => setVehicles(prev => [...prev, v]);
  const updateVehicle = (v: Vehicle) => setVehicles(prev => prev.map(x => x.id === v.id ? v : x));
  const deleteVehicle = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id));

  const addTrip = (t: Trip) => setTrips(prev => [...prev, t]);
  const updateTrip = (t: Trip) => setTrips(prev => prev.map(x => x.id === t.id ? t : x));
  const deleteTrip = (id: string) => setTrips(prev => prev.filter(t => t.id !== id));

  const addTripRequest = (req: TripRequest) => setTripRequests(prev => [...prev, req]);
  const updateTripRequest = (req: TripRequest) => setTripRequests(prev => prev.map(r => r.id === req.id ? req : r));
  const deleteTripRequest = (id: string) => setTripRequests(prev => prev.filter(r => r.id !== id));

  const addPaymentRequest = (req: PaymentRequest) => setPaymentRequests(prev => [...prev, req]);
  const updatePaymentRequest = (req: PaymentRequest) => setPaymentRequests(prev => prev.map(r => r.id === req.id ? req : r));
  
  const addPayment = (p: Payment) => setPayments(prev => [...prev, p]);
  const deletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

  const addMessage = (m: ChatMessage) => setMessages(prev => [...prev, m]);
  const updateSettings = (s: AppSettings) => setSettings(s);
  const updateSalary = (s: SalaryRecord) => setSalaries(prev => {
    const exists = prev.find(x => x.driverId === s.driverId && x.month === s.month);
    if (exists) return prev.map(x => (x.driverId === s.driverId && x.month === s.month) ? s : x);
    return [...prev, s];
  });

  return (
    <AppContext.Provider value={{
      currentUser, users, vehicles, trips, tripRequests, paymentRequests, payments, messages, settings, salaries,
      login, logout, addUser, updateUser, deleteUser, addVehicle, updateVehicle, deleteVehicle, addTrip, updateTrip, deleteTrip, addTripRequest, updateTripRequest, deleteTripRequest, addPaymentRequest, updatePaymentRequest, addPayment, deletePayment, addMessage, updateSettings, updateSalary
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
};
