
import React, { useMemo } from 'react';
import { useAppState } from '../../store';
import { UserRole, MovementStatus } from '../../types';
import { formatCurrency, calculatePartyDue } from '../../utils';

const AdminDashboard: React.FC = () => {
  const { users, vehicles, trips, payments } = useAppState();

  const stats = useMemo(() => ({
    managers: users.filter(u => u.role === UserRole.MANAGER).length,
    drivers: users.filter(u => u.role === UserRole.DRIVER).length,
    vehicles: vehicles.length,
    totalDues: trips.reduce((sum, t) => sum + calculatePartyDue(t), 0)
  }), [users, vehicles, trips]);

  // Read-only Floating Activity
  const recentTrips = useMemo(() => trips.slice(-8).reverse(), [trips]);
  const recentPayments = useMemo(() => payments.slice(-8).reverse(), [payments]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Owner's Overview</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nazir Hossain & Son - Live Fleet Control</p>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlobalStatCard title="Total Managers" value={stats.managers} icon="👥" color="bg-blue-600" />
        <GlobalStatCard title="Total Drivers" value={stats.drivers} icon="🚛" color="bg-indigo-600" />
        <GlobalStatCard title="Live Fleet" value={stats.vehicles} icon="🚜" color="bg-slate-900" />
        <GlobalStatCard title="Total Dues" value={formatCurrency(stats.totalDues)} icon="💰" color="bg-red-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Floating Recent Trips Dashboard - READ ONLY */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="p-2 bg-blue-50 rounded-2xl">⚡</span> সর্বশেষ ট্রিপসমূহ (Read Only)
          </h3>
          
          <div className="space-y-4">
            {recentTrips.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-[2rem] bg-slate-50/50 border border-slate-100">
                 <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${t.movementStatus === MovementStatus.INPUT ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {t.movementStatus === MovementStatus.INPUT ? 'IN' : 'EX'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{t.loadingPoint} ➟ {t.unloadingPoint}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-800">{formatCurrency(t.partyFare)}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{t.date}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Recent Payments Dashboard - READ ONLY */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <span className="p-2 bg-emerald-50 rounded-2xl">💎</span> সাম্প্রতিক পেমেন্ট (Read Only)
          </h3>
          
          <div className="space-y-4">
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-[2rem] border border-slate-100 bg-slate-50/30">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-50">💰</div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{p.paymentType}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicle: {vehicles.find(v => v.id === p.vehicleId)?.vehicleNumber || 'N/A'}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-base font-black text-emerald-600">+{formatCurrency(p.amount)}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{p.date}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GlobalStatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center text-xl mb-4 shadow-lg shadow-slate-100`}>
      {icon}
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

export default AdminDashboard;
