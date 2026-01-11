
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { formatCurrency } from '../../utils';

const MySalary: React.FC = () => {
  const { currentUser, salaries } = useAppState();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const record = salaries.find(s => s.driverId === currentUser?.id && s.month === selectedMonth);
  const totalAdvances = record?.advances.reduce((sum, a) => sum + a.amount, 0) || 0;
  const pending = 5000 - totalAdvances;

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-24 animate-in fade-in">
       <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">আমার স্যালারি (My Salary)</h3>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="rounded-xl border-slate-200 py-1.5 px-3 border text-xs font-bold" />
       </div>

       <div className="bg-gradient-to-br from-slate-800 to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 text-center">
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">মোট পাওনা (Net Payable)</p>
             <h2 className="text-4xl font-black">{formatCurrency(pending)}</h2>
             <div className="mt-6 flex justify-between bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                <div className="text-left">
                   <p className="text-[8px] text-slate-400 uppercase font-bold">বেতন (Base)</p>
                   <p className="text-sm font-black">৳ 5,000</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] text-slate-400 uppercase font-bold">অ্যাডভান্স নিয়েছেন</p>
                   <p className="text-sm font-black text-red-400">{formatCurrency(totalAdvances)}</p>
                </div>
             </div>
          </div>
       </div>

       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Advance History (অ্যাডভান্স হিস্ট্রি)</h4>
       
       <div className="space-y-3">
          {record?.advances && record.advances.length > 0 ? (
            record.advances.map(a => (
               <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                  <div>
                     <p className="text-sm font-black text-slate-800">{formatCurrency(a.amount)}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase">{a.date}</p>
                  </div>
                  <span className="text-[10px] bg-slate-50 px-3 py-1 rounded-lg font-black text-slate-400">PAID</span>
               </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-300 italic text-sm">No advances taken this month.</div>
          )}
       </div>

       {record?.isSettled && (
         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
            <p className="text-emerald-700 text-xs font-black uppercase tracking-widest">✅ মাস পূর্ণ সেটেলমেন্ট সম্পন্ন হয়েছে</p>
         </div>
       )}
    </div>
  );
};

export default MySalary;
