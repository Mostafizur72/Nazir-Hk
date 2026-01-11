
import React from 'react';
import { useAppState } from '../../store';
import { TripStatus, Trip, MovementStatus } from '../../types';
import { formatCurrency, calculateDriverPending } from '../../utils';

const DriverTrips: React.FC = () => {
  const { trips, currentUser, updateTrip } = useAppState();

  const myTrips = trips.filter(t => t.driverId === currentUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const activeTrip = myTrips.find(t => 
    t.status === TripStatus.LOADING || 
    t.status === TripStatus.RUNNING || 
    t.status === TripStatus.DELAYED || 
    t.status === TripStatus.UNLOADED
  );

  const handleStatusUpdate = (status: TripStatus) => {
    if (!activeTrip) return;
    const updatedTrip: Trip = {
      ...activeTrip,
      status,
      // Fixed: unloadingDate property added to Trip type in types.ts
      unloadingDate: status === TripStatus.UNLOADED ? new Date().toISOString() : activeTrip.unloadingDate
    };
    updateTrip(updatedTrip);
  };

  const renderActionButtons = () => {
    if (!activeTrip) return null;

    if (activeTrip.status === TripStatus.LOADING) {
      return (
        <button 
          onClick={() => handleStatusUpdate(TripStatus.RUNNING)} 
          className="w-full bg-white text-blue-700 py-6 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center space-x-3 border-4 border-blue-100"
        >
          <span className="text-2xl">📦</span>
          <span>মাল লোড হয়েছে (Confirm Load)</span>
        </button>
      );
    }

    if (activeTrip.status === TripStatus.RUNNING || activeTrip.status === TripStatus.DELAYED) {
      return (
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => handleStatusUpdate(TripStatus.UNLOADED)} 
            className="w-full bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center space-x-3 border-4 border-emerald-400"
          >
            <span className="text-2xl">🏗️</span>
            <span>মাল আনলোড হয়েছে (Confirm Unload)</span>
          </button>
          <button 
            onClick={() => handleStatusUpdate(TripStatus.DELAYED)} 
            className="w-full bg-white/20 text-white border border-white/30 py-4 rounded-[2rem] font-black text-sm shadow-lg active:scale-95 transition-all uppercase tracking-widest backdrop-blur-md"
          >
            Report Delay / জ্যাম বা বিলম্ব
          </button>
        </div>
      );
    }

    return (
      <div className="text-center bg-white/10 p-6 rounded-[2rem] border border-white/20 backdrop-blur-md">
        <p className="text-base font-black text-white uppercase tracking-widest">ধন্যবাদ! অপেক্ষা করুন।</p>
        <p className="text-[11px] text-white/60 mt-2 uppercase font-bold tracking-widest">Waiting for Manager Settlement</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto p-4 animate-in fade-in duration-500">
      {activeTrip ? (
        <div className={`p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden transition-all duration-500 ${
          activeTrip.status === TripStatus.LOADING ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' :
          activeTrip.status === TripStatus.UNLOADED ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' :
          'bg-gradient-to-br from-[#0B72E7] to-blue-800'
        }`}>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
                    {/* Fixed: Comparison with MovementStatus.INPUT instead of literal string */}
                    {activeTrip.movementStatus === MovementStatus.INPUT ? 'Going Leg (যাওয়ার ট্রিপ)' : 'Return Leg (আসা ট্রিপ)'}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight">{activeTrip.tripNumber}</h3>
                  <p className="text-sm text-white font-bold bg-black/20 inline-block px-3 py-1 rounded-lg mt-2 tracking-tighter">
                    {activeTrip.loadingPoint} ➟ {activeTrip.unloadingPoint}
                  </p>
               </div>
               <span className="bg-white/20 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest backdrop-blur-md ring-1 ring-white/30">
                 {activeTrip.status}
               </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/10">
                  <p className="text-[9px] text-white/60 uppercase font-black tracking-widest mb-1">
                    {activeTrip.tripType === 'Local' ? 'Local Fare' : 'Total Package'}
                  </p>
                  <p className="text-xl font-black">{formatCurrency(activeTrip.tripType === 'Local' ? activeTrip.partyFare : activeTrip.packageAmount)}</p>
               </div>
               <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/10">
                  <p className="text-[9px] text-white/60 uppercase font-black tracking-widest mb-1">Adv Received</p>
                  <p className="text-xl font-black">{formatCurrency(activeTrip.totalAdvancePaid)}</p>
               </div>
            </div>

            {renderActionButtons()}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[3rem] text-center border-2 border-dashed border-slate-100 shadow-sm">
           <span className="text-6xl block mb-6 grayscale opacity-20">🚚</span>
           <h3 className="text-xl font-black text-slate-800">No Active Journey</h3>
           <p className="text-sm text-slate-400 font-bold mt-2">ম্যানেজার ট্রিপ এন্ট্রি দিলে এখানে দেখতে পাবেন।</p>
        </div>
      )}

      <div className="px-1 flex items-center space-x-3">
        <div className="h-px bg-slate-100 flex-1"></div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
        <div className="h-px bg-slate-100 flex-1"></div>
      </div>
      
      <div className="space-y-4">
        {myTrips.map(trip => {
          const pending = calculateDriverPending(trip);
          return (
            <div key={trip.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest ${
                  // Fixed: Comparison with MovementStatus.INPUT instead of literal string
                  trip.movementStatus === MovementStatus.INPUT ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {trip.movementStatus}
                </span>
                <p className="text-[11px] text-slate-400 font-bold">{trip.date}</p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">{trip.loadingPoint} ➟ {trip.unloadingPoint}</p>
              <div className="flex justify-between items-end border-t border-slate-50 pt-4 mt-2">
                 <div>
                   <p className="text-[9px] text-slate-400 font-black uppercase">Outstanding</p>
                   <p className={`text-lg font-black ${pending > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                     {pending > 0 ? formatCurrency(pending) : 'Settled'}
                   </p>
                 </div>
                 <div className="text-right">
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     trip.status === 'Completed' ? 'text-slate-400' : 'text-blue-600 animate-pulse'
                   }`}>
                     {trip.status}
                   </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriverTrips;