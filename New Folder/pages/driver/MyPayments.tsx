
import React from 'react';
import { useAppState } from '../../store';
// Fix: Import calculateDriverPending instead of calculateTripDue
import { formatCurrency, calculateDriverPending } from '../../utils';

const DriverPayments: React.FC = () => {
  const { trips, payments, vehicles, currentUser } = useAppState();

  const myTrips = trips.filter(t => t.driverId === currentUser?.id);
  // Fix: Use calculateDriverPending which is the correct helper for driver-side outstanding amount
  const myTotalDue = myTrips.reduce((sum, t) => sum + calculateDriverPending(t), 0);
  
  const myVehicle = vehicles.find(v => v.driverId === currentUser?.id);
  const myPaymentHistory = payments.filter(p => p.vehicleId === myVehicle?.id);

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-20">
      <div className="bg-emerald-600 p-8 rounded-3xl shadow-xl text-white text-center">
        <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Total Outstanding Due</p>
        <h2 className="text-4xl font-black mb-4">{formatCurrency(myTotalDue)}</h2>
        <div className="h-1 w-12 bg-emerald-400 mx-auto rounded-full"></div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 px-1">Recent Settlements</h3>
      
      <div className="space-y-4">
        {myPaymentHistory.map(payment => (
          <div key={payment.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
             <div>
                <p className="text-sm font-black text-gray-900">{formatCurrency(payment.amount)}</p>
                <p className="text-xs text-gray-500">{payment.date}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
                <p className="text-sm font-bold text-gray-700">{formatCurrency(payment.remainingDue)}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverPayments;
