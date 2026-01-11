
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { UserRole, Vehicle } from '../../types';
import { generateId } from '../../utils';

const ManageVehicles: React.FC = () => {
  const { vehicles, users, addVehicle, updateVehicle, deleteVehicle, currentUser } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driverId: '',
    ownerName: '',
    isActive: true,
    taxTokenExpiry: '',
    fitnessExpiry: '',
    roadPermitExpiry: ''
  });

  const isMainManager = currentUser?.role === UserRole.MANAGER || currentUser?.role === UserRole.SUPER_ADMIN;
  const drivers = users.filter(u => u.role === UserRole.DRIVER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      updateVehicle({ ...editingVehicle, ...formData });
    } else {
      addVehicle({
        id: generateId(),
        ...formData
      });
    }
    resetForm();
    setIsModalOpen(false);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      vehicleNumber: v.vehicleNumber,
      driverId: v.driverId,
      ownerName: v.ownerName,
      isActive: v.isActive,
      taxTokenExpiry: v.taxTokenExpiry || '',
      fitnessExpiry: v.fitnessExpiry || '',
      roadPermitExpiry: v.roadPermitExpiry || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('গাড়িটি সিস্টেম থেকে ডিলিট করতে চান?')) {
      deleteVehicle(id);
    }
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({ vehicleNumber: '', driverId: '', ownerName: '', isActive: true, taxTokenExpiry: '', fitnessExpiry: '', roadPermitExpiry: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800">Fleet Management</h3>
          <p className="text-sm text-slate-500 font-medium">মেইন ম্যানেজার ফ্লিট এডিট ও ডিলিট করতে পারবেন।</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition text-sm uppercase">+ Add Vehicle</button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-slate-100 whitespace-nowrap">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Plate Number</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                {isMainManager && <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vehicles.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 whitespace-nowrap font-black text-slate-900 text-sm tracking-tight">{v.vehicleNumber}</td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500 font-medium">{v.ownerName}</td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-slate-600">{users.find(u => u.id === v.driverId)?.name}</td>
                  {isMainManager && (
                    <td className="px-8 py-6 whitespace-nowrap text-right space-x-3">
                      <button onClick={() => openEdit(v)} className="text-blue-600 text-[10px] font-black uppercase hover:underline">Edit</button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageVehicles;
