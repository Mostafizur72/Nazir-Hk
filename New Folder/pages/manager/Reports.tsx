
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { Trip, MovementStatus } from '../../types';
import { formatCurrency, calculatePartyDue, formatDate } from '../../utils';
import { COMPANY_INFO } from '../../constants';

const Reports: React.FC = () => {
  const { trips, vehicles } = useAppState();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); 

  // Extract unique rent companies from trips
  const companies = useMemo(() => {
    const set = new Set(trips.map(t => t.rentCompany));
    return Array.from(set).filter(Boolean);
  }, [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter(t => 
      (selectedCompany === '' || t.rentCompany === selectedCompany) && 
      t.date.startsWith(selectedMonth)
    ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [trips, selectedCompany, selectedMonth]);

  const tripsByMovement = useMemo(() => ({
    input: filteredTrips.filter(t => t.movementStatus === MovementStatus.INPUT),
    export: filteredTrips.filter(t => t.movementStatus === MovementStatus.EXPORT)
  }), [filteredTrips]);

  const totals = useMemo(() => {
    const fare = filteredTrips.reduce((sum, t) => sum + t.partyFare, 0);
    const paid = filteredTrips.reduce((sum, t) => sum + t.partyAdvanceAmount, 0);
    return { fare, paid, due: fare - paid };
  }, [filteredTrips]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 no-print flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">কোম্পানি নির্বাচন (Rent Company)</label>
          <select value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)} className="w-full rounded-xl border-gray-300 py-2 px-4 border">
            <option value="">All Companies</option>
            {companies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="w-full md:flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">মাস নির্বাচন (Month)</label>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-full rounded-xl border-gray-300 py-2 px-4 border" />
        </div>
        <button onClick={() => window.print()} className="w-full md:w-auto bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg uppercase">
          Print Invoice
        </button>
      </div>

      <div className="overflow-x-auto pb-8 scrollbar-hide">
        <div className="bg-white p-12 shadow-2xl mx-auto rounded-none print:shadow-none print:p-0" style={{ width: '210mm', minHeight: '297mm' }}>
          <div className="text-center mb-10 border-b-4 border-slate-900 pb-8">
             <h1 className="text-4xl font-black text-slate-900 uppercase">{COMPANY_INFO.name}</h1>
             <p className="text-sm font-medium text-slate-600 mt-2">{COMPANY_INFO.address}</p>
          </div>

          <div className="flex justify-between items-end mb-8">
             <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Party Invoice For</p>
                <h2 className="text-2xl font-black text-slate-900">{selectedCompany || 'All Companies'} - {new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
             </div>
             <div className="text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Statement Summary</p>
                <p className="text-sm font-bold text-red-600">Total Due: {formatCurrency(totals.due)}</p>
             </div>
          </div>

          {tripsByMovement.input.length > 0 && (
            <div className="mb-10">
              <h3 className="bg-blue-600 text-white px-4 py-2 text-xs font-black uppercase mb-2">যাওয়া ট্রিপ (Going)</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left text-[10px] font-black border">তারিখ</th>
                    <th className="p-2 text-left text-[10px] font-black border">গাড়ির নম্বর</th>
                    <th className="p-2 text-left text-[10px] font-black border">রুট (Route)</th>
                    <th className="p-2 text-right text-[10px] font-black border">ভাড়া (Fare)</th>
                    <th className="p-2 text-right text-[10px] font-black border">অ্যাডভান্স (Adv)</th>
                    <th className="p-2 text-right text-[10px] font-black border">বকেয়া (Due)</th>
                  </tr>
                </thead>
                <tbody>
                  {tripsByMovement.input.map(t => (
                    <tr key={t.id} className="border-b">
                      <td className="p-2 text-[10px] border">{formatDate(t.date)}</td>
                      <td className="p-2 text-[10px] font-bold border">{vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber}</td>
                      <td className="p-2 text-[10px] border">{t.loadingPoint} ➟ {t.unloadingPoint}</td>
                      <td className="p-2 text-[10px] text-right border">{formatCurrency(t.partyFare)}</td>
                      <td className="p-2 text-[10px] text-right border">{formatCurrency(t.partyAdvanceAmount)}</td>
                      <td className="p-2 text-[10px] text-right font-bold text-red-600 border">{formatCurrency(calculatePartyDue(t))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tripsByMovement.export.length > 0 && (
            <div className="mb-10">
              <h3 className="bg-emerald-600 text-white px-4 py-2 text-xs font-black uppercase mb-2">আসা ট্রিপ (Returning)</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left text-[10px] font-black border">তারিখ</th>
                    <th className="p-2 text-left text-[10px] font-black border">গাড়ির নম্বর</th>
                    <th className="p-2 text-left text-[10px] font-black border">রুট (Route)</th>
                    <th className="p-2 text-right text-[10px] font-black border">ভাড়া (Fare)</th>
                    <th className="p-2 text-right text-[10px] font-black border">অ্যাডভান্স (Adv)</th>
                    <th className="p-2 text-right text-[10px] font-black border">বকেয়া (Due)</th>
                  </tr>
                </thead>
                <tbody>
                  {tripsByMovement.export.map(t => (
                    <tr key={t.id} className="border-b">
                      <td className="p-2 text-[10px] border">{formatDate(t.date)}</td>
                      <td className="p-2 text-[10px] font-bold border">{vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber}</td>
                      <td className="p-2 text-[10px] border">{t.loadingPoint} ➟ {t.unloadingPoint}</td>
                      <td className="p-2 text-[10px] text-right border">{formatCurrency(t.partyFare)}</td>
                      <td className="p-2 text-[10px] text-right border">{formatCurrency(t.partyAdvanceAmount)}</td>
                      <td className="p-2 text-[10px] text-right font-bold text-red-600 border">{formatCurrency(calculatePartyDue(t))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-20 flex justify-between px-10">
             <div className="text-center w-40 border-t border-slate-900 pt-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">Party Signature</p>
             </div>
             <div className="text-center w-40 border-t border-slate-900 pt-2">
                <p className="text-[10px] font-bold uppercase text-slate-500">Authorized Signature</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
