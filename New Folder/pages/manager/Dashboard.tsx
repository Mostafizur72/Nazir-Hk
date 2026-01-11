
import React, { useMemo } from 'react';
import { useAppState } from '../../store';
import { TripStatus, MovementStatus } from '../../types';
import { formatCurrency, calculatePartyDue, calculateDriverPending } from '../../utils';

const ManagerDashboard: React.FC = () => {
  const { trips, vehicles, payments } = useAppState();

  const getPartyDueByCompany = (isUjala: boolean) => {
    return trips
      .filter(t => {
        const name = (t.rentCompany || '').toLowerCase();
        const isUjalaMatch = name.includes('ujala') || name.includes('উজালা');
        return isUjala ? isUjalaMatch : !isUjalaMatch;
      })
      .reduce((sum, t) => sum + calculatePartyDue(t), 0);
  };

  const totalDriverPending = trips.reduce((sum, t) => sum + calculateDriverPending(t), 0);
  const runningTrips = trips.filter(t => t.status === TripStatus.RUNNING || t.status === TripStatus.DELAYED);
  
  // Floating Activity Logic
  const recentTrips = useMemo(() => trips.slice(-5).reverse(), [trips]);
  const recentPayments = useMemo(() => payments.slice(-5).reverse(), [payments]);

  // Expiry Logic
  const expiredDocuments = useMemo(() => {
    const today = new Date();
    const alerts: { vehicleNo: string; docType: string; date: string }[] = [];
    
    vehicles.forEach(v => {
      if (v.taxTokenExpiry && new Date(v.taxTokenExpiry) < today) 
        alerts.push({ vehicleNo: v.vehicleNumber, docType: 'Tax Token', date: v.taxTokenExpiry });
      if (v.fitnessExpiry && new Date(v.fitnessExpiry) < today) 
        alerts.push({ vehicleNo: v.vehicleNumber, docType: 'Fitness', date: v.fitnessExpiry });
      if (v.roadPermitExpiry && new Date(v.roadPermitExpiry) < today) 
        alerts.push({ vehicleNo: v.vehicleNumber, docType: 'Road Permit', date: v.roadPermitExpiry });
    });
    return alerts;
  }, [vehicles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Expiry Alerts Section */}
      {expiredDocuments.length > 0 && (
        <div className="bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 animate-pulse">
           <h4 className="text-sm font-black text-red-700 uppercase tracking-widest flex items-center mb-4">
             <span className="mr-2">⚠️</span> মেয়াদের উত্তীর্ণ সংকেত (Document Expiry Alerts)
           </h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
             {expiredDocuments.map((alert, idx) => (
               <div key={idx} className="bg-white p-3 rounded-xl border border-red-200 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-xs font-black text-slate-800">{alert.vehicleNo}</p>
                    <p className="text-[9px] text-red-500 font-bold uppercase">{alert.docType}</p>
                  </div>
                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-md">{alert.date}</span>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="উজালা বাবদ ডিউ" value={formatCurrency(getPartyDueByCompany(true))} icon="💼" color="border-blue-500" />
        <StatCard title="বাহিরের ভাড়া বাবদ ডিউ" value={formatCurrency(getPartyDueByCompany(false))} icon="📦" color="border-purple-500" />
        <StatCard title="ড্রাইভার বাবদ ডিউ" value={formatCurrency(totalDriverPending)} icon="🚛" color="border-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Floating Recent Trips */}
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
              <span>🚀 সাম্প্রতিক ট্রিপ (Recent Trips)</span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Newest First</span>
            </h3>
            <div className="space-y-4">
               {recentTrips.map(t => (
                 <div key={t.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]">
                    <div className="flex items-center space-x-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${t.movementStatus === MovementStatus.INPUT ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {t.movementStatus === MovementStatus.INPUT ? 'IN' : 'EX'}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-900">{vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{t.loadingPoint} ➟ {t.unloadingPoint}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-800">{formatCurrency(t.partyFare)}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">{t.date}</p>
                    </div>
                 </div>
               ))}
               {recentTrips.length === 0 && <p className="text-center py-10 text-slate-300 italic">No recent trips recorded.</p>}
            </div>
         </div>

         {/* Floating Recent Payments */}
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between">
              <span>💸 পেমেন্ট হিস্ট্রি (Recent Payments)</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">History</span>
            </h3>
            <div className="space-y-4">
               {recentPayments.map(p => (
                 <div key={p.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white hover:shadow-lg transition-all active:scale-[0.98]">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100">💰</div>
                       <div>
                          <p className="text-xs font-black text-slate-900">{p.paymentType}</p>
                          <p className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">{p.notes || 'No notes'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-emerald-600">+{formatCurrency(p.amount)}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase">{p.date}</p>
                    </div>
                 </div>
               ))}
               {recentPayments.length === 0 && <p className="text-center py-10 text-slate-300 italic">No payments yet.</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className={`bg-white p-6 rounded-[2.5rem] shadow-sm border-l-8 ${color} hover:shadow-xl transition-all`}>
    <div className="flex justify-between items-start mb-4">
      <span className="text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-100">{icon}</span>
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-slate-900">{value}</p>
  </div>
);

export default ManagerDashboard;
