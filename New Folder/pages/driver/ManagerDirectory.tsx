
import React from 'react';
import { useAppState } from '../../store';
import { UserRole } from '../../types';

const ManagerDirectory: React.FC = () => {
  const { users, currentUser } = useAppState();

  // Logic: Find the Main Manager assigned to this driver
  const mainManager = users.find(u => u.id === currentUser?.assignedManagerId && u.role === UserRole.MANAGER);
  
  // Logic: Find all Sub-Managers (Trip Managers) that belong to the same Main Manager
  const tripManagers = users.filter(u => 
    u.role === UserRole.SUB_MANAGER && 
    u.assignedManagerId === currentUser?.assignedManagerId && 
    u.isActive
  );

  const allContacts = [
    ...(mainManager ? [{ ...mainManager, label: 'Main Manager (প্রধান)' }] : []),
    ...tripManagers.map(tm => ({ ...tm, label: 'Trip Manager (এসিস্ট্যান্ট)' }))
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="px-4 pt-4">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">ম্যানেজার ডিরেক্টরি</h3>
        <p className="text-sm text-slate-500 font-medium">যেকোনো ম্যানেজারের সাথে সরাসরি যোগাযোগ করতে ফোন বা মেসেজ দিন।</p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4">
        {allContacts.map(mgr => (
          <div key={mgr.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 ${mgr.role === UserRole.MANAGER ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'} rounded-2xl flex items-center justify-center text-xl font-black border border-blue-100 shadow-inner`}>
                {mgr.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-lg font-black text-slate-900 truncate">{mgr.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{mgr.label}</p>
              </div>
              {mgr.isActive && (
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200"></div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-start space-x-3">
                <span className="text-lg">📍</span>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">অফিস এড্রেস / Location</p>
                  <p className="text-sm font-bold text-slate-700 leading-snug">{mgr.address || 'তথ্য নেই'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <span className="text-lg">📞</span>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">ফোন নাম্বার (কল দিন)</p>
                  <a href={`tel:${mgr.phone}`} className="text-sm font-black text-[#0B72E7] hover:underline transition-all">
                    {mgr.phone}
                  </a>
                </div>
                
                <div className="flex gap-2">
                   <a 
                    href={`tel:${mgr.phone}`} 
                    className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 active:scale-90 transition-transform"
                    title="Call Now"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-2xl flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-400 uppercase">ইন-অ্যাপ মেসেঞ্জার</span>
               <button 
                className="text-xs font-black text-blue-600 uppercase tracking-widest px-3 py-1 bg-white border border-blue-100 rounded-lg shadow-sm"
                onClick={() => alert('চ্যাট ট্যাবে গিয়ে এই ম্যানেজারের সাথে কথা বলতে পারবেন।')}
               >
                 Go to Chat
               </button>
            </div>
          </div>
        ))}
        
        {allContacts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold">কোনো ম্যানেজারের তথ্য পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDirectory;
