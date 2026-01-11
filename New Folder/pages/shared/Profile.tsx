
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { UserRole } from '../../types';
import { formatCurrency, calculateDriverPending } from '../../utils';
import { COMPANY_INFO } from '../../constants';

const UnifiedProfile: React.FC = () => {
  const { currentUser, updateUser, vehicles, trips, users } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    address: currentUser?.address || '',
    phone: currentUser?.phone || '',
    nidNumber: currentUser?.nidNumber || '',
    licenseNumber: currentUser?.licenseNumber || ''
  });

  const stats = useMemo(() => {
    if (!currentUser) return null;
    
    if (currentUser.role === UserRole.DRIVER) {
      const myTrips = trips.filter(t => t.driverId === currentUser.id);
      const myVehicle = vehicles.find(v => v.driverId === currentUser.id);
      const totalDue = myTrips.reduce((sum, t) => sum + calculateDriverPending(t), 0);
      return {
        tripsCount: myTrips.length,
        vehicleNo: myVehicle?.vehicleNumber || 'Not Assigned',
        pendingDue: totalDue
      };
    }

    if (currentUser.role === UserRole.MANAGER) {
      const myDrivers = users.filter(u => u.assignedManagerId === currentUser.id && u.role === UserRole.DRIVER);
      const myFleet = vehicles.filter(v => users.find(u => u.id === v.driverId)?.assignedManagerId === currentUser.id);
      return {
        driversCount: myDrivers.length,
        fleetSize: myFleet.length,
        activeTrips: trips.filter(t => t.managerId === currentUser.id && t.status !== 'Completed').length
      };
    }

    return null;
  }, [currentUser, trips, vehicles, users]);

  const handlePhotoUpdate = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'photo') {
          updateUser({ ...currentUser, photoUrl: reader.result as string });
        } else {
          updateUser({ ...currentUser, coverPhotoUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (currentUser) {
      updateUser({ ...currentUser, ...editData });
      setIsEditing(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in duration-700">
      {/* Cover Section */}
      <div className="relative group">
        <div className="h-48 md:h-64 w-full rounded-[2.5rem] bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden shadow-2xl">
          {currentUser.coverPhotoUrl ? (
            <img src={currentUser.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <span className="text-8xl">🚚</span>
            </div>
          )}
        </div>
        <label className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border border-white/30 active:scale-95">
          Change Cover
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpdate(e, 'cover')} />
        </label>

        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-[6px] border-white bg-slate-100 shadow-2xl overflow-hidden">
              <img 
                src={currentUser.photoUrl || `https://picsum.photos/seed/${currentUser.id}/400/400`} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-xl cursor-pointer hover:bg-blue-700 transition active:scale-90 border-4 border-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpdate(e, 'photo')} />
            </label>
          </div>
          <div className="pb-4 hidden xs:block">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none drop-shadow-sm">{currentUser.name}</h2>
            <div className="flex items-center space-x-2 mt-2">
               <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{currentUser.role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">About & Documents</h3>
                <button onClick={() => setIsEditing(!isEditing)} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">{isEditing ? 'Cancel' : 'Edit Info'}</button>
             </div>
             
             {isEditing ? (
               <div className="space-y-4 animate-in slide-in-from-top-2">
                 <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-bold" placeholder="Full Name" />
                 <textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-bold h-20" placeholder="Short Bio" />
                 
                 {currentUser.role === UserRole.DRIVER && (
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={editData.nidNumber} onChange={e => setEditData({...editData, nidNumber: e.target.value})} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-bold" placeholder="NID Number" />
                      <input type="text" value={editData.licenseNumber} onChange={e => setEditData({...editData, licenseNumber: e.target.value})} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-bold" placeholder="Driving License" />
                   </div>
                 )}
                 
                 <input type="text" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} className="w-full bg-slate-50 rounded-2xl py-3 px-5 text-sm font-bold" placeholder="Address" />
                 <button onClick={handleSave} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition">Save Profile Updates</button>
               </div>
             ) : (
               <div className="space-y-6">
                  <p className="text-sm text-slate-600 font-medium italic">
                    {currentUser.bio || "ব্যক্তিগত তথ্য এখনো আপডেট করা হয়নি।"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                     {currentUser.role === UserRole.DRIVER && (
                       <>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">NID Number</p>
                            <p className="text-sm font-black text-slate-800">{currentUser.nidNumber || 'Not Saved'}</p>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Driving License</p>
                            <p className="text-sm font-black text-slate-800">{currentUser.licenseNumber || 'Not Saved'}</p>
                         </div>
                       </>
                     )}
                     <div className="flex items-center space-x-3 px-2">
                        <span className="text-xl">📞</span>
                        <div>
                           <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Phone</p>
                           <p className="text-sm font-black text-slate-800">{currentUser.phone}</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentUser.role === UserRole.DRIVER && (
                <>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Trips</p>
                    <p className="text-2xl font-black text-slate-900">{stats?.tripsCount || 0}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Due</p>
                    <p className="text-2xl font-black text-red-500">{formatCurrency(stats?.pendingDue || 0)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
                    <p className="text-sm font-black text-blue-600 truncate">{stats?.vehicleNo}</p>
                  </div>
                </>
              )}
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2">Organization</p>
              <h4 className="text-lg font-black leading-tight mb-6">{COMPANY_INFO.name}</h4>
              <p className="text-sm font-black text-white">{COMPANY_INFO.tel}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProfile;
