
import React from 'react';
import { useAppState } from '../../store';
import { UserRole } from '../../types';

const SubManagerDrivers: React.FC = () => {
  const { users } = useAppState();
  const drivers = users.filter(u => u.role === UserRole.DRIVER && u.isActive);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Driver Directory</h3>
        <p className="text-sm text-slate-500 font-medium">View-only list of available drivers for trip coordination.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-slate-400 overflow-hidden">
                {driver.photoUrl ? <img src={driver.photoUrl} alt="" className="w-full h-full object-cover" /> : driver.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-slate-900">{driver.name}</h4>
                <p className="text-xs font-bold text-slate-400">{driver.phone}</p>
              </div>
            </div>
            
            <a 
              href={`tel:${driver.phone}`} 
              className="w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-center font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition"
            >
              📞 Call Driver
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubManagerDrivers;
