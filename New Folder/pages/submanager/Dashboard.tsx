
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { TripStatus, TripRequest, MovementStatus } from '../../types';
import { generateId } from '../../utils';
import { RENT_COMPANY_OPTIONS } from '../../constants';

const SubManagerDashboard: React.FC = () => {
  const { vehicles, trips, addTripRequest, currentUser, users } = useAppState();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  
  const [formData, setFormData] = useState({
    loadingPoint: '',
    unloadingPoint: '',
    selectedRentCompany: RENT_COMPANY_OPTIONS[0].value,
    customRentCompany: '',
    estimatedFare: 0
  });

  const isExportManager = currentUser?.subManagerType === 'EXPORT';

  const fleetStatus = useMemo(() => {
    return vehicles.map(v => {
      const vTrips = trips.filter(t => t.vehicleId === v.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastTrip = vTrips[0];
      const driver = users.find(u => u.id === v.driverId);
      
      return {
        ...v,
        driver,
        lastTripStatus: lastTrip?.status || TripStatus.COMPLETED,
        lastTripMovement: lastTrip?.movementStatus || MovementStatus.INPUT,
        currentLocation: lastTrip?.unloadingPoint || 'Base'
      };
    }).sort((a, b) => {
       // Primary Sort: Unloaded first
       if (a.lastTripStatus === TripStatus.UNLOADED && b.lastTripStatus !== TripStatus.UNLOADED) return -1;
       if (a.lastTripStatus !== TripStatus.UNLOADED && b.lastTripStatus === TripStatus.UNLOADED) return 1;
       // Secondary Sort: Alphabetical vehicle number
       return a.vehicleNumber.localeCompare(b.vehicleNumber);
    });
  }, [vehicles, trips, users]);

  const unloadedCount = fleetStatus.filter(v => v.lastTripStatus === TripStatus.UNLOADED).length;

  const handleOpenRequest = (vId: string) => {
    setSelectedVehicleId(vId);
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRentCompany = (formData.selectedRentCompany === 'বাহির' || formData.selectedRentCompany === 'নিজ')
      ? formData.customRentCompany || formData.selectedRentCompany
      : formData.selectedRentCompany;

    const newRequest: TripRequest = {
      id: generateId(),
      vehicleId: selectedVehicleId,
      subManagerId: currentUser?.id || '',
      loadingPoint: formData.loadingPoint,
      unloadingPoint: formData.unloadingPoint,
      rentCompany: finalRentCompany,
      estimatedFare: formData.estimatedFare,
      timestamp: new Date().toISOString(),
      status: 'pending',
      requestType: isExportManager ? 'EXPORT' : 'INPUT'
    };

    addTripRequest(newRequest);
    setIsRequestModalOpen(false);
    alert('ট্রিপ রিকোয়েস্ট পাঠানো হয়েছে।');
    setFormData({
      loadingPoint: '',
      unloadingPoint: '',
      selectedRentCompany: RENT_COMPANY_OPTIONS[0].value,
      customRentCompany: '',
      estimatedFare: 0
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 px-2">
      <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-xl flex flex-col sm:flex-row justify-between items-center overflow-hidden relative gap-6">
        <div className="relative z-10 text-center sm:text-left">
          <h2 className="text-2xl font-black uppercase tracking-tight">Fleet Operations</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 tracking-tighter">গাড়ির লোকেশন এবং রিকোয়েস্ট ম্যানেজমেন্ট</p>
        </div>
        <div className="bg-emerald-500/20 px-8 py-4 rounded-3xl backdrop-blur-md border border-emerald-500/30 text-center relative z-10">
           <p className="text-[10px] font-black text-emerald-300 uppercase mb-1">Unloaded Ready</p>
           <p className="text-3xl font-black text-emerald-400">{unloadedCount}</p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
      </div>

      {/* Unloaded/Priority Section */}
      <section className="space-y-4">
         <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 ml-4">
           <span className="w-2 h-5 bg-emerald-500 rounded-full"></span> আনলোড অবস্থায় আছে (Priority List)
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleetStatus.filter(v => v.lastTripStatus === TripStatus.UNLOADED).map(v => (
              <div key={v.id} className="bg-emerald-50 p-6 rounded-[2.5rem] border-2 border-emerald-200 shadow-lg relative group overflow-hidden">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-none">{v.vehicleNumber}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">Driver: {v.driver?.name}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse">Ready</span>
                 </div>
                 <div className="bg-white/80 p-4 rounded-2xl mb-6 border border-emerald-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Location</p>
                    <p className="text-sm font-black text-slate-900">{v.currentLocation}</p>
                 </div>
                 <button onClick={() => handleOpenRequest(v.id)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition active:scale-95 shadow-xl">Request Return Trip</button>
                 <div className="absolute -bottom-4 -right-4 text-6xl opacity-10 grayscale group-hover:opacity-20 transition-opacity">🚚</div>
              </div>
            ))}
            {unloadedCount === 0 && (
              <div className="col-span-full py-10 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">বর্তমানে কোনো গাড়ি আনলোড অবস্থায় বসে নেই</p>
              </div>
            )}
         </div>
      </section>

      {/* Regular Fleet Section */}
      <section className="space-y-4 pt-4">
         <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-4">ফ্লিট স্ট্যাটাস (Regular Fleet)</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fleetStatus.filter(v => v.lastTripStatus !== TripStatus.UNLOADED).map(v => (
              <div key={v.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="text-sm font-black text-slate-900">{v.vehicleNumber}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${v.lastTripStatus === 'Running' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                      {v.lastTripStatus}
                    </span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-medium mb-4 truncate">📍 {v.currentLocation}</p>
                 <button onClick={() => handleOpenRequest(v.id)} className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition">Create Request</button>
              </div>
            ))}
         </div>
      </section>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-8">
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">নতুন ট্রিপ রিকোয়েস্ট</h3>
                 <button onClick={() => setIsRequestModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">✕</button>
              </div>
              <form onSubmit={handleRequestSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loading Point</label>
                      <input type="text" required value={formData.loadingPoint} onChange={e => setFormData({...formData, loadingPoint: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-6 border bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unloading Point</label>
                      <input type="text" required value={formData.unloadingPoint} onChange={e => setFormData({...formData, unloadingPoint: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-6 border bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Fare</label>
                       <input type="number" required value={formData.estimatedFare} onChange={e => setFormData({...formData, estimatedFare: Number(e.target.value)})} className="w-full rounded-2xl border-slate-200 py-3.5 px-6 border bg-slate-50/50 text-sm font-black text-blue-600 focus:bg-white outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rent Company</label>
                       <select value={formData.selectedRentCompany} onChange={e => setFormData({...formData, selectedRentCompany: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-4 border bg-slate-50/50 text-[11px] font-black outline-none">
                          {RENT_COMPANY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                       </select>
                    </div>
                 </div>
                 {(formData.selectedRentCompany === 'বাহির' || formData.selectedRentCompany === 'নিজ') && (
                    <div className="space-y-1 animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Company Name</label>
                      <input type="text" value={formData.customRentCompany} onChange={e => setFormData({...formData, customRentCompany: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-6 border bg-slate-50/50 text-sm font-bold" placeholder="কোম্পানির নাম লিখুন" />
                    </div>
                 )}
                 <div className="pt-4">
                    <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-[2rem] shadow-xl hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest text-sm">Send Request</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default SubManagerDashboard;
