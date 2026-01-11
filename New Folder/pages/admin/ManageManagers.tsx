
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { UserRole, User } from '../../types';
import { generateId } from '../../utils';

const ManageManagers: React.FC = () => {
  const { users, addUser, updateUser } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<User | null>(null);

  const managers = users.filter(u => u.role === UserRole.MANAGER);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingManager) {
      updateUser({ ...editingManager, ...formData });
    } else {
      addUser({
        id: generateId(),
        ...formData,
        role: UserRole.MANAGER
      });
    }
    closeModal();
  };

  const openModal = (mgr?: User) => {
    if (mgr) {
      setEditingManager(mgr);
      setFormData({
        name: mgr.name,
        email: mgr.email || '',
        phone: mgr.phone,
        password: mgr.password || '',
        address: mgr.address || '',
        isActive: mgr.isActive
      });
    } else {
      setEditingManager(null);
      setFormData({ name: '', email: '', phone: '', password: '', address: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">System Managers</h3>
          <p className="text-sm text-slate-500 font-medium">Administrative control over regional managers</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest text-sm"
        >
          + Create Manager
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Point</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Address</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {managers.map(mgr => (
                <tr key={mgr.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg border border-blue-50">
                        {mgr.name.charAt(0)}
                      </div>
                      <div className="ml-4 overflow-hidden">
                        <div className="text-sm font-black text-slate-900 truncate">{mgr.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">ID: {mgr.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-700">{mgr.email}</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">{mgr.phone}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-xs text-slate-500 font-medium max-w-[200px] truncate">{mgr.address || 'Not set'}</div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest ${mgr.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {mgr.isActive ? 'Authorized' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(mgr)} className="text-blue-600 hover:text-blue-900 font-black text-xs uppercase tracking-widest active:scale-95 transition-transform">Configure</button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">No regional managers have been added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-1 text-slate-900">{editingManager ? 'Update Manager' : 'Add New Manager'}</h3>
            <p className="text-xs text-slate-500 font-medium mb-8">System administrators can manage fleets and payments.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manager Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address / Location</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-sm" placeholder="e.g. Dhanialapara, Chittagong" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Login Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-2xl border-slate-200 py-3.5 px-5 border focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-sm" />
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-5 w-5 text-blue-600 rounded-lg border-slate-300" />
                <label className="text-sm font-bold text-slate-700">Account Active & Authorized</label>
              </div>
              <div className="flex justify-end space-x-3 pt-6 border-t mt-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-slate-400 font-black uppercase text-xs">Discard</button>
                <button type="submit" className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-transform uppercase tracking-widest text-sm">Deploy Manager</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageManagers;
