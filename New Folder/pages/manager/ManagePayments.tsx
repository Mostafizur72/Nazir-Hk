
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { Trip, Payment, TripStatus, PaymentRequest, UserRole } from '../../types';
import { formatCurrency, generateId, calculatePartyDue } from '../../utils';
import { RENT_COMPANY_OPTIONS } from '../../constants';

const ManagePayments: React.FC = () => {
  const { trips, payments, vehicles, paymentRequests, updatePaymentRequest, addPayment, deletePayment, updateTrip, users, currentUser } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isMainManager = currentUser?.role === UserRole.MANAGER || currentUser?.role === UserRole.SUPER_ADMIN;

  const handleDeletePayment = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পেমেন্ট রেকর্ডটি ডিলিট করতে চান? এটি ডিলিট করলে ট্রিপের বকেয়া আবার বেড়ে যাবে।')) {
      deletePayment(id);
    }
  };

  const [formData, setFormData] = useState({
    payerType: RENT_COMPANY_OPTIONS[0].value,
    customCompanyName: '', 
    vehicleId: '',
    amount: 0,
    paymentType: 'Single Trip' as const,
    farePaymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const pendingRequests = useMemo(() => paymentRequests.filter(r => r.status === 'pending'), [paymentRequests]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Payments & Collections</h3>
          <p className="text-sm text-slate-500 font-medium">মেইন ম্যানেজার পেমেন্ট হিস্ট্রি ডিলিট করতে পারবেন।</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full sm:w-auto bg-[#0B72E7] text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition uppercase tracking-widest text-sm"
        >
          Add Manual Payment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-slate-100 whitespace-nowrap">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Payer</th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</th>
              <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              {isMainManager && <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.filter(p => p.paymentType !== 'Salary').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600 font-bold">{p.date}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${p.paymentType === 'Ujala Request' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {p.paymentType}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-900">
                  {vehicles.find(v => v.id === p.vehicleId)?.vehicleNumber}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right">
                  <p className="text-sm font-black text-emerald-600">{formatCurrency(p.amount)}</p>
                </td>
                {isMainManager && (
                  <td className="px-6 py-5 text-right">
                    <button onClick={() => handleDeletePayment(p.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePayments;
