
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { UserRole, User } from '../../types';
import { generateId } from '../../utils';

const ManageDrivers: React.FC = () => {
  const { users, currentUser, addUser, updateUser } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<User | null>(null);

  const drivers = users.filter(u => u.role === UserRole.DRIVER && u.assignedManagerId === currentUser?.id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    isActive: true,
    nidNumber: '',
    licenseNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      updateUser({ ...editingDriver, ...formData });
    } else {
      addUser({
        id: generateId(),
        ...formData,
        role: UserRole.DRIVER,
        assignedManagerId: currentUser?.id
      });
    }
    closeModal();
  };

  const openModal = (driver?: User) => {
    if (driver) {
      setEditingDriver(driver);
      setFormData({
        name: driver.name,
        phone: driver.phone,
        password: driver.password || '',
        isActive: driver.isActive,
        nidNumber: driver.nidNumber || '',
        licenseNumber: driver.licenseNumber || ''
      });
    } else {
      setEditingDriver(null);
      setFormData({ name: '', phone: '', password: '', isActive: true, nidNumber: '', licenseNumber: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Driver Management</h3>
          <p className="text-sm text-slate-500 font-medium">ড্রাইভারের এনআইডি ও লাইসেন্স তথ্য সংরক্ষণ করুন।</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition uppercase tracking-widest text-sm"
        >
          + Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 overflow-hidden">
                {driver.photoUrl ? <img src={driver.photoUrl} alt="" className="w-full h-full object-cover" /> : driver.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-black text-slate-900 truncate">{driver.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Contact: {driver.phone}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
               <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">NID Info</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">{driver.nidNumber || 'Not Given'}</p>
               </div>
               <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">License</p>
                  <p className="text-[10px] font-bold text-slate-700 truncate">{driver.licenseNumber || 'Not Given'}</p>
               </div>
            </div>

            <button onClick={() => openModal(driver)} className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black rounded-xl uppercase tracking-widest transition">Edit Driver Details</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-6 text-slate-900">ড্রাইভার প্রোফাইল (Driver Profile)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3 px-5 border bg-slate-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone (Login ID)</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3 px-5 border bg-slate-50/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NID Number (ঐচ্ছিক)</label>
                  <input type="text" value={formData.nidNumber} onChange={e => setFormData({...formData, nidNumber: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3 px-5 border bg-white" placeholder="324XXXXXXXXXX" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driving License (ঐচ্ছিক)</label>
                  <input type="text" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3 px-5 border bg-white" placeholder="DL-XXXXXXX" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3 px-5 border bg-slate-50/50" />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-400 font-black uppercase text-xs">Cancel</button>
                <button type="submit" className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 uppercase tracking-widest text-sm">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDrivers;
