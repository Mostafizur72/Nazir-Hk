
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { MovementStatus, TripStatus, Trip, TripRequest, ChatMessage, UserRole } from '../../types';
import { PACKAGE_AMOUNTS, RENT_COMPANY_OPTIONS } from '../../constants';
import { generateId, formatCurrency, calculateDriverPending, calculatePartyDue } from '../../utils';

const ManageTrips: React.FC = () => {
  const { trips, vehicles, users, currentUser, tripRequests, salaries, addTrip, updateTrip, deleteTrip, updateTripRequest, addMessage, updateSalary } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModal, setIsExportModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  
  const initialFormState = {
    vehicleId: '',
    selectedRentCompany: RENT_COMPANY_OPTIONS[0].value, 
    customRentCompany: '', 
    movementStatus: MovementStatus.INPUT,
    tripType: 'Input' as 'Input' | 'Local',
    loadingPoint: '',
    unloadingPoint: '',
    partyFare: 0,
    packageAmount: PACKAGE_AMOUNTS[0],
    partyAdvanceAmount: 0,
    companyAdvanceAmount: 0,
    date: new Date().toISOString().split('T')[0],
    status: TripStatus.LOADING
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedExportTripId, setSelectedExportTripId] = useState('');

  const isMainManager = currentUser?.role === UserRole.MANAGER || currentUser?.role === UserRole.SUPER_ADMIN;

  const handleTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAdvance = Number(formData.partyAdvanceAmount) + Number(formData.companyAdvanceAmount);
    const finalRentCompany = (formData.selectedRentCompany === 'বাহির' || formData.selectedRentCompany === 'নিজ')
      ? formData.customRentCompany || formData.selectedRentCompany
      : formData.selectedRentCompany;

    const driverId = vehicles.find(v => v.id === formData.vehicleId)?.driverId || '';

    if (editingTrip) {
      updateTrip({
        ...editingTrip,
        ...formData,
        rentCompany: finalRentCompany,
        totalAdvancePaid: totalAdvance,
        driverId
      });
    } else {
      const newTrip: Trip = {
        id: generateId(),
        tripNumber: `TRP-${Date.now()}`,
        ...formData,
        rentCompany: finalRentCompany,
        totalAdvancePaid: totalAdvance,
        driverId,
        managerId: currentUser?.id || ''
      };
      addTrip(newTrip);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ট্রিপটি ডিলিট করতে চান?')) {
      deleteTrip(id);
    }
  };

  const openEdit = (trip: Trip) => {
    setEditingTrip(trip);
    const isStandard = RENT_COMPANY_OPTIONS.some(o => o.value === trip.rentCompany);
    setFormData({
      vehicleId: trip.vehicleId,
      selectedRentCompany: isStandard ? trip.rentCompany : 'বাহির',
      customRentCompany: isStandard ? '' : trip.rentCompany,
      movementStatus: trip.movementStatus,
      tripType: trip.tripType,
      loadingPoint: trip.loadingPoint,
      unloadingPoint: trip.unloadingPoint,
      partyFare: trip.partyFare,
      packageAmount: trip.packageAmount,
      partyAdvanceAmount: trip.partyAdvanceAmount,
      companyAdvanceAmount: trip.companyAdvanceAmount,
      date: trip.date,
      status: trip.status
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingTrip(null);
  };

  const pendingRequests = useMemo(() => tripRequests.filter(r => r.status === 'pending'), [tripRequests]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Trip Management</h3>
          <p className="text-sm text-slate-500 font-medium tracking-tight">মেইন ম্যানেজার ট্রিপ এডিট ও ডিলিট করতে পারবেন।</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => { setIsExportModal(true); resetForm(); }} className="flex-1 sm:flex-none bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-emerald-700 transition uppercase">Direct Export</button>
          <button onClick={() => { setIsModalOpen(true); resetForm(); }} className="flex-1 sm:flex-none bg-[#0B72E7] text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-blue-700 transition uppercase">Add Input Trip</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-slate-100 whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Leg</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Route & Company</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle / Driver</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Status</th>
              {isMainManager && <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {trips.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(trip => (
              <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="text-xs font-black text-slate-900">{trip.date}</p>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${trip.movementStatus === MovementStatus.INPUT ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {trip.movementStatus}
                  </span>
                </td>
                <td className="px-6 py-5">
                   <p className="text-xs font-bold text-slate-700">{trip.loadingPoint} ➟ {trip.unloadingPoint}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{trip.rentCompany}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-xs font-black text-slate-900">{vehicles.find(v => v.id === trip.vehicleId)?.vehicleNumber}</p>
                   <p className="text-[10px] text-slate-400 font-medium uppercase">{users.find(u => u.id === trip.driverId)?.name}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-[10px] font-black text-red-600">P: {formatCurrency(calculatePartyDue(trip))}</p>
                   <p className="text-[10px] font-black text-emerald-600">D: {formatCurrency(calculateDriverPending(trip))}</p>
                </td>
                {isMainManager && (
                  <td className="px-6 py-5 text-right space-x-2">
                    <button onClick={() => openEdit(trip)} className="text-blue-600 text-[10px] font-black uppercase hover:underline">Edit</button>
                    <button onClick={() => handleDelete(trip.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh] scrollbar-hide">
            <h3 className="text-2xl font-black mb-6 text-slate-900">{editingTrip ? 'Edit Trip Details' : 'Add New Input Trip'}</h3>
            <form onSubmit={handleTripSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rent Company</label>
                <div className="grid grid-cols-3 gap-2">
                   {RENT_COMPANY_OPTIONS.map(opt => (
                     <button key={opt.value} type="button" onClick={() => setFormData({...formData, selectedRentCompany: opt.value})} className={`py-3 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${formData.selectedRentCompany === opt.value ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>{opt.label}</button>
                   ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle</label>
                <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border bg-slate-50/50 text-sm font-bold">
                  <option value="">Select vehicle...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Party Fare</label>
                <input type="number" required value={formData.partyFare} onChange={e => setFormData({...formData, partyFare: Number(e.target.value)})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm font-black text-blue-600" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Point</label>
                <input type="text" required value={formData.loadingPoint} onChange={e => setFormData({...formData, loadingPoint: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Unloading Point</label>
                <input type="text" required value={formData.unloadingPoint} onChange={e => setFormData({...formData, unloadingPoint: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm" />
              </div>
              <div className="flex justify-end space-x-3 md:col-span-2 pt-6 border-t mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-400 font-black uppercase text-xs">Cancel</button>
                <button type="submit" className="px-10 py-4 bg-[#0B72E7] text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 uppercase tracking-widest text-sm">{editingTrip ? 'Update Trip' : 'Save Trip'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrips;
