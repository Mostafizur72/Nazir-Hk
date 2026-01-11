
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { MovementStatus, TripStatus, UserRole, Payment } from '../../types';
import { formatCurrency, calculateDriverPending, calculatePartyDue, formatDate, generateId } from '../../utils';

const ExportSheet: React.FC = () => {
  const { trips, vehicles, users, currentUser, updateTrip, addPayment } = useAppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const exportTrips = useMemo(() => {
    let list = trips.filter(t => t.movementStatus === MovementStatus.EXPORT);
    if (currentUser?.role === UserRole.DRIVER) list = list.filter(t => t.driverId === currentUser.id);

    return list.filter(t => {
      const vNum = vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber.toLowerCase() || '';
      const dName = users.find(u => u.id === t.driverId)?.name.toLowerCase() || '';
      const matchesSearch = vNum.includes(searchTerm.toLowerCase()) || dName.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [trips, currentUser, vehicles, users, searchTerm, statusFilter]);

  const handleSettleDriver = (trip: any) => {
    const pending = calculateDriverPending(trip);
    if (pending <= 0) return alert("No pending amount to settle.");

    if (window.confirm(`Confirm final payment of ${formatCurrency(pending)} to driver?`)) {
      const newPayment: Payment = {
        id: generateId(),
        paymentType: 'Driver Settlement',
        vehicleId: trip.vehicleId,
        tripIds: [trip.id, trip.relatedTripId].filter(Boolean) as string[],
        amount: pending,
        remainingDue: 0,
        date: new Date().toISOString().split('T')[0],
        notes: `Final settlement for ${trip.tripNumber}`
      };
      
      addPayment(newPayment);
      updateTrip({ ...trip, status: TripStatus.COMPLETED });
      if (trip.relatedTripId) {
        const inputTrip = trips.find(t => t.id === trip.relatedTripId);
        if (inputTrip) updateTrip({ ...inputTrip, status: TripStatus.COMPLETED });
      }
      setSelectedTrip(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Export (Return) Sheet</h2>
          <p className="text-sm text-slate-500 font-medium">Manage final trip settlements</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
            <option value="all">All Status</option>
            {Object.values(TripStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-slate-100 whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Trip Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nazir Adv</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Rent Co Adv</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver Due</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Party Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {exportTrips.map(trip => (
              <tr key={trip.id} onClick={() => setSelectedTrip(trip)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                <td className="px-6 py-5">
                   <p className="text-sm font-black text-slate-900">{formatDate(trip.date)}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{trip.tripNumber}</p>
                </td>
                <td className="px-6 py-5">
                   <p className="text-sm font-bold text-slate-700">{vehicles.find(v => v.id === trip.vehicleId)?.vehicleNumber}</p>
                   <p className="text-[10px] text-slate-400 font-medium uppercase">{users.find(u => u.id === trip.driverId)?.name}</p>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-blue-600">{formatCurrency(trip.companyAdvanceAmount)}</td>
                <td className="px-6 py-5 text-sm font-bold text-amber-600">{formatCurrency(trip.partyAdvanceAmount)}</td>
                <td className="px-6 py-5 text-sm font-black text-emerald-600">{formatCurrency(calculateDriverPending(trip))}</td>
                <td className="px-6 py-5 text-sm font-black text-red-600">{formatCurrency(calculatePartyDue(trip))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Trip Breakdown</h3>
               <button onClick={() => setSelectedTrip(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">✕</button>
            </div>

            <div className="space-y-4">
               <div className="bg-blue-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between">
                     <span className="text-xs font-bold text-blue-600">Driver Package</span>
                     <span className="text-sm font-black text-slate-900">{formatCurrency(selectedTrip.packageAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-y border-blue-200/50">
                     <span className="text-xs font-bold text-blue-600">Total Adv (Co + Party)</span>
                     <span className="text-sm font-black text-slate-900">-{formatCurrency(selectedTrip.partyAdvanceAmount + selectedTrip.companyAdvanceAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                     <span className="text-sm font-black text-blue-600">Driver Balance</span>
                     <span className="text-xl font-black text-emerald-600">{formatCurrency(calculateDriverPending(selectedTrip))}</span>
                  </div>
               </div>

               <div className="bg-red-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between">
                     <span className="text-xs font-bold text-red-600">Party Rent (ভাড়া)</span>
                     <span className="text-sm font-black text-slate-900">{formatCurrency(selectedTrip.partyFare)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-y border-red-200/50">
                     <span className="text-xs font-bold text-red-600">Party Adv Paid</span>
                     <span className="text-sm font-black text-slate-900">-{formatCurrency(selectedTrip.partyAdvanceAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                     <span className="text-sm font-black text-red-600">Party Balance</span>
                     <span className="text-xl font-black text-red-600">{formatCurrency(calculatePartyDue(selectedTrip))}</span>
                  </div>
               </div>

               {selectedTrip.status !== TripStatus.COMPLETED && (
                  <button onClick={() => handleSettleDriver(selectedTrip)} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition uppercase tracking-widest text-sm">💸 ড্রাইভার সেটেলমেন্ট (Settle Now)</button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportSheet;
