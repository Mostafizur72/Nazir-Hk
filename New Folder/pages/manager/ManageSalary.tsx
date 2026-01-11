
import React, { useState } from 'react';
import { useAppState } from '../../store';
import { UserRole, SalaryRecord, SalaryAdvance, Payment } from '../../types';
import { generateId, formatCurrency } from '../../utils';

const ManageSalary: React.FC = () => {
  const { users, currentUser, salaries, updateSalary, addPayment } = useAppState();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const drivers = users.filter(u => u.role === UserRole.DRIVER && u.assignedManagerId === currentUser?.id);

  const handleAddAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const existingRecord = salaries.find(s => s.driverId === selectedDriverId && s.month === selectedMonth) || {
      id: generateId(),
      driverId: selectedDriverId,
      month: selectedMonth,
      baseSalary: 5000,
      bonus: 0,
      advances: [],
      isSettled: false
    };

    const newAdvance: SalaryAdvance = {
      id: generateId(),
      amount: advanceAmount,
      date: new Date().toISOString().split('T')[0],
      notes: 'Monthly Salary Advance'
    };

    const updatedRecord = {
      ...existingRecord,
      advances: [...existingRecord.advances, newAdvance]
    };

    updateSalary(updatedRecord);
    setIsAdvanceModalOpen(false);
    setAdvanceAmount(0);
  };

  const handleFinalSettlement = (driverId: string) => {
    const record = salaries.find(s => s.driverId === driverId && s.month === selectedMonth);
    const totalAdvances = record?.advances.reduce((sum, a) => sum + a.amount, 0) || 0;
    const pending = 5000 - totalAdvances;

    if (window.confirm(`Settle final salary for this month? Amount: ${formatCurrency(pending)}`)) {
       const newPayment: Payment = {
          id: generateId(),
          paymentType: 'Salary',
          amount: pending,
          remainingDue: 0,
          date: new Date().toISOString().split('T')[0],
          notes: `Monthly Salary Settle - ${selectedMonth}`
       };
       addPayment(newPayment);
       if (record) updateSalary({ ...record, isSettled: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">Driver Salaries</h3>
           <p className="text-sm text-slate-500">Monthly salary management (5,000 BDT Base)</p>
        </div>
        <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="rounded-xl border-slate-200 py-2 px-4 border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => {
          const record = salaries.find(s => s.driverId === driver.id && s.month === selectedMonth);
          const totalAdvances = record?.advances.reduce((sum, a) => sum + a.amount, 0) || 0;
          const pending = 5000 - totalAdvances;

          return (
            <div key={driver.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600">{driver.name.charAt(0)}</div>
                 <div>
                    <p className="text-sm font-black">{driver.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{driver.phone}</p>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>Base Salary</span>
                    <span className="text-slate-900">৳ 5,000</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>Total Advance Taken</span>
                    <span className="text-red-600">{formatCurrency(totalAdvances)}</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-black text-slate-900 uppercase pt-2 border-t">
                    <span>Net Payable</span>
                    <span className="text-emerald-600">{formatCurrency(pending)}</span>
                 </div>
              </div>

              <div className="flex gap-2">
                 <button onClick={() => { setSelectedDriverId(driver.id); setIsAdvanceModalOpen(true); }} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition">Add Advance</button>
                 <button disabled={record?.isSettled} onClick={() => handleFinalSettlement(driver.id)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${record?.isSettled ? 'bg-slate-100 text-slate-400' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'}`}>
                   {record?.isSettled ? 'Settled' : 'Settle Now'}
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAdvanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <h4 className="text-lg font-black mb-4 uppercase tracking-widest">Salary Advance</h4>
              <form onSubmit={handleAddAdvance} className="space-y-4">
                 <input type="number" required value={advanceAmount} onChange={e => setAdvanceAmount(Number(e.target.value))} className="w-full rounded-xl border-slate-200 py-3 px-4 border" placeholder="Enter Amount" />
                 <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAdvanceModalOpen(false)} className="px-4 py-2 text-slate-400 font-bold text-xs">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Save Advance</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageSalary;
