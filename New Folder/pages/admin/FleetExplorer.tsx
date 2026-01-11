
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { UserRole, TripStatus } from '../../types';
import { formatCurrency, calculateDriverPending, calculatePartyDue } from '../../utils';

const FleetExplorer: React.FC = () => {
  const { users, vehicles, trips } = useAppState();
  const [activeTab, setActiveTab] = useState<'managers' | 'drivers' | 'vehicles'>('managers');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'managers') {
      return users.filter(u => u.role === UserRole.MANAGER && u.name.toLowerCase().includes(term));
    } else if (activeTab === 'drivers') {
      return users.filter(u => u.role === UserRole.DRIVER && u.name.toLowerCase().includes(term));
    } else {
      return vehicles.filter(v => v.vehicleNumber.toLowerCase().includes(term));
    }
  }, [users, vehicles, activeTab, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Search and Tabs Bar */}
      <div className="sticky top-16 z-20 bg-slate-50/80 backdrop-blur-md pt-4 pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
              {(['managers', 'drivers', 'vehicles'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="relative flex-1 w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold placeholder:text-slate-300 outline-none"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'managers' && filteredItems.map((mgr: any) => {
          const mgrDrivers = users.filter(u => u.assignedManagerId === mgr.id && u.role === UserRole.DRIVER).length;
          const mgrVehicles = vehicles.filter(v => users.find(u => u.id === v.driverId)?.assignedManagerId === mgr.id).length;
          return (
            <div key={mgr.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black group-hover:scale-110 transition-transform">
                    {mgr.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-none">{mgr.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Administrator</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl text-center">
                     <p className="text-xl font-black text-slate-800">{mgrDrivers}</p>
                     <p className="text-[9px] text-slate-400 font-bold uppercase">Drivers</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-center">
                     <p className="text-xl font-black text-slate-800">{mgrVehicles}</p>
                     <p className="text-[9px] text-slate-400 font-bold uppercase">Fleet</p>
                  </div>
               </div>
               <div className="space-y-2 border-t pt-6">
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-2">📞 {mgr.phone}</p>
                  <p className="text-xs font-bold text-slate-600 flex items-center gap-2">🏢 {mgr.address || 'Central Office'}</p>
               </div>
            </div>
          );
        })}

        {activeTab === 'drivers' && filteredItems.map((driver: any) => {
          const driverTrips = trips.filter(t => t.driverId === driver.id);
          const totalDue = driverTrips.reduce((sum, t) => sum + calculateDriverPending(t), 0);
          return (
            <div key={driver.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
               <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 overflow-hidden shadow-inner">
                     <img src={driver.photoUrl || `https://picsum.photos/seed/${driver.id}/200/200`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-none">{driver.name}</h4>
                    <p className="text-[10px] text-emerald-500 font-black uppercase mt-2 tracking-widest">Carrier</p>
                  </div>
               </div>
               <div className="bg-blue-600 p-5 rounded-3xl text-white mb-6 shadow-lg shadow-blue-100">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[9px] font-black uppercase opacity-60">Pending Settlement</span>
                     <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-lg">Live Due</span>
                  </div>
                  <p className="text-2xl font-black">{formatCurrency(totalDue)}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-[9px] text-slate-400 font-black uppercase">NID Number</p>
                     <p className="text-xs font-black text-slate-700">{driver.nidNumber || 'Not Set'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] text-slate-400 font-black uppercase">Driving Lic.</p>
                     <p className="text-xs font-black text-slate-700">{driver.licenseNumber || 'Not Set'}</p>
                  </div>
               </div>
            </div>
          );
        })}

        {activeTab === 'vehicles' && filteredItems.map((v: any) => {
          const isExpired = (date: string) => date && new Date(date) < new Date();
          return (
            <div key={v.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Vehicle Plate</p>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter">{v.vehicleNumber}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${v.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {v.isActive ? 'Active' : 'Offline'}
                  </span>
               </div>
               <div className="space-y-4">
                  <ExpiryItem label="Tax Token" date={v.taxTokenExpiry} isAlert={isExpired(v.taxTokenExpiry)} />
                  <ExpiryItem label="Fitness Cert" date={v.fitnessExpiry} isAlert={isExpired(v.fitnessExpiry)} />
                  <ExpiryItem label="Road Permit" date={v.roadPermitExpiry} isAlert={isExpired(v.roadPermitExpiry)} />
               </div>
               <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-black uppercase">Owner: {v.ownerName}</span>
                  <div className="flex items-center -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                       <img src={`https://picsum.photos/seed/${v.id}/50/50`} className="w-full h-full object-cover" />
                    </div>
                  </div>
               </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-40 text-center">
             <span className="text-6xl block mb-6 opacity-10">🌍</span>
             <h4 className="text-xl font-black text-slate-300 uppercase">No Data Found</h4>
             <p className="text-sm font-medium text-slate-300 mt-2">আপনার সার্চের সাথে মেলে এমন কিছু পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpiryItem = ({ label, date, isAlert }: any) => (
  <div className={`flex justify-between items-center p-3 rounded-2xl border ${isAlert ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-black">{date || 'N/A'}</span>
  </div>
);

export default FleetExplorer;
