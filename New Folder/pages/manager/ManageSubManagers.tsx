
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { UserRole, User, SubManagerType } from '../../types';
import { generateId } from '../../utils';

const ManageSubManagers: React.FC = () => {
  const { users, currentUser, addUser, updateUser } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<User | null>(null);

  const subManagers = users.filter(u => 
    (u.role === UserRole.SUB_MANAGER || u.role === UserRole.UJALA_MANAGER) && 
    u.assignedManagerId === currentUser?.id
  );

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    role: UserRole.SUB_MANAGER,
    subManagerType: 'IMPORT' as SubManagerType,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSub) {
      updateUser({ ...editingSub, ...formData });
    } else {
      addUser({
        id: generateId(),
        ...formData,
        assignedManagerId: currentUser?.id,
        isActive: true
      });
    }
    closeModal();
  };

  const openModal = (sub?: User) => {
    if (sub) {
      setEditingSub(sub);
      setFormData({
        name: sub.name,
        phone: sub.phone,
        email: sub.email || '',
        address: sub.address || '',
        password: sub.password || '',
        role: sub.role,
        subManagerType: sub.subManagerType || 'IMPORT',
        isActive: sub.isActive
      });
    } else {
      setEditingSub(null);
      setFormData({ name: '', phone: '', email: '', address: '', password: '', role: UserRole.SUB_MANAGER, subManagerType: 'IMPORT', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSub(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Staff Management (সহকারী ও উজালা ম্যানেজার)</h3>
          <p className="text-sm text-slate-500 font-medium">নিচে আপনার নিয়োগকৃত ট্রিপ ম্যানেজার এবং উজালা ম্যানেজারদের তালিকা দেখুন।</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-[#0B72E7] text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest text-sm"
        >
          + নিয়োগ দিন (Add Staff)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subManagers.map(sub => (
          <div key={sub.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`h-14 w-14 ${sub.role === UserRole.UJALA_MANAGER ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'} rounded-2xl flex items-center justify-center text-xl font-black border`}>
                  {sub.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-900 truncate">{sub.name}</h4>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${sub.role === UserRole.UJALA_MANAGER ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {sub.role === UserRole.UJALA_MANAGER ? 'Ujala Manager' : `${sub.subManagerType} Manager`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Contact</span>
                  <span className="text-xs font-bold text-slate-700">{sub.phone}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Office Address</p>
                  <p className="text-xs font-bold text-slate-600 line-clamp-2">{sub.address || 'তথ্য নেই'}</p>
                </div>
              </div>
            </div>
            <button onClick={() => openModal(sub)} className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black rounded-xl transition uppercase tracking-widest">Edit Account</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-1 text-slate-900">{editingSub ? 'Update Staff' : 'নিয়োগ দিন (New Staff)'}</h3>
            <p className="text-xs text-slate-500 font-medium mb-8">পদবি এবং কাজের ধরন সঠিকভাবে নির্বাচন করুন।</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role (পদবি)</label>
                <div className="grid grid-cols-2 gap-3">
                   <button type="button" onClick={() => setFormData({...formData, role: UserRole.SUB_MANAGER})} className={`py-3 rounded-2xl text-xs font-black uppercase border-2 transition-all ${formData.role === UserRole.SUB_MANAGER ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>Trip Manager</button>
                   <button type="button" onClick={() => setFormData({...formData, role: UserRole.UJALA_MANAGER})} className={`py-3 rounded-2xl text-xs font-black uppercase border-2 transition-all ${formData.role === UserRole.UJALA_MANAGER ? 'border-amber-600 bg-amber-50 text-amber-600' : 'border-slate-100 text-slate-400'}`}>Ujala Manager</button>
                </div>
              </div>

              {formData.role === UserRole.SUB_MANAGER && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type (ধরনের)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setFormData({...formData, subManagerType: 'IMPORT'})} className={`py-3 rounded-2xl text-xs font-black uppercase border-2 transition-all ${formData.subManagerType === 'IMPORT' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Import</button>
                    <button type="button" onClick={() => setFormData({...formData, subManagerType: 'EXPORT'})} className={`py-3 rounded-2xl text-xs font-black uppercase border-2 transition-all ${formData.subManagerType === 'EXPORT' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400'}`}>Export</button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm" placeholder="নাম লিখুন" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm" placeholder="017XXXXXXXX" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border text-sm" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-6 border-t mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-400 font-black uppercase text-xs">Cancel</button>
                <button type="submit" className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 uppercase tracking-widest text-sm">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Added default export
export default ManageSubManagers;