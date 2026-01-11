
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store';
import { MovementStatus } from '../../types';
import { calculatePartyDue, formatCurrency } from '../../utils';

const UjalaManagerDashboard: React.FC = () => {
  const { trips, vehicles } = useAppState();
  const [showAllUjala, setShowAllUjala] = useState(false);
  const [showAllOutside, setShowAllOutside] = useState(false);

  // Helper to check if trip is new (last 48 hours)
  const isNewDue = (dateStr: string) => {
    const tripDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - tripDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 2;
  };

  const categorizedDues = useMemo(() => {
    const allDues = trips.filter(t => calculatePartyDue(t) > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const ujala = allDues.filter(t => t.rentCompany.includes('উজালা'));
    const outside = allDues.filter(t => !t.rentCompany.includes('উজালা'));

    const split = (list: typeof trips) => ({
      export: list.filter(t => t.movementStatus === MovementStatus.EXPORT),
      import: list.filter(t => t.movementStatus === MovementStatus.INPUT)
    });

    return {
      ujala: split(ujala),
      outside: split(outside),
      ujalaTotal: ujala.reduce((s, t) => s + calculatePartyDue(t), 0),
      outsideTotal: outside.reduce((s, t) => s + calculatePartyDue(t), 0)
    };
  }, [trips]);

  const renderTripList = (list: any[], limit: number, showAll: boolean) => {
    const displayList = showAll ? list : list.slice(0, limit);
    return (
      <div className="space-y-3">
        {displayList.map(t => (
          <div 
            key={t.id} 
            className={`p-4 rounded-2xl border-2 transition-all ${isNewDue(t.date) ? 'border-red-400 bg-red-50/50 shadow-md' : 'border-slate-50 bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${t.movementStatus === MovementStatus.EXPORT ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                  {t.movementStatus === MovementStatus.EXPORT ? 'EX' : 'IN'}
                </span>
                <p className="text-xs font-black text-slate-900 mt-1">{vehicles.find(v => v.id === t.vehicleId)?.vehicleNumber}</p>
              </div>
              <p className="text-sm font-black text-red-600">{formatCurrency(calculatePartyDue(t))}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-400 font-bold truncate max-w-[140px]">{t.loadingPoint} ➟ {t.unloadingPoint}</p>
              <p className="text-[9px] text-slate-400 font-black">{t.date}</p>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-[10px] text-slate-300 italic text-center py-4">কোনো বকেয়া নেই।</p>}
      </div>
    );
  };

  const Section = ({ title, data, showAll, setShowAll, total, accentColor }: any) => (
    <section className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm mb-10">
      <div className="flex justify-between items-center mb-8">
         <h3 className={`text-xl font-black ${accentColor} flex items-center gap-2`}>
           <span className={`w-2 h-8 ${accentColor.replace('text', 'bg')} rounded-full`}></span> {title}
         </h3>
         <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Total: {formatCurrency(total)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Export (আসা ৫টি)</h4>
            {renderTripList(data.export, 5, showAll)}
         </div>
         <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Input (যাওয়া ৫টি)</h4>
            {renderTripList(data.import, 5, showAll)}
         </div>
      </div>

      {(data.export.length > 5 || data.import.length > 5) && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className={`w-full mt-8 py-4 ${accentColor.replace('text', 'bg').replace('600', '50')} ${accentColor} rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-95 transition border-2 border-dashed ${accentColor.replace('text', 'border').replace('600', '200')}`}
        >
          {showAll ? 'সংক্ষিপ্ত করুন' : 'আরও বকেয়া দেখুন (See More)'}
        </button>
      )}
    </section>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 px-2">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase">Collection Tracker</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1"> Nazir Hossain & Son - Financial Desk</p>
        </div>
        <div className="bg-white/10 px-8 py-4 rounded-3xl backdrop-blur-md border border-white/10 text-center relative z-10">
           <p className="text-[10px] font-black text-blue-300 uppercase">Grand Total Outstanding</p>
           <p className="text-3xl font-black text-white">{formatCurrency(categorizedDues.ujalaTotal + categorizedDues.outsideTotal)}</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <Section 
        title="উজালা বকেয়া (Ujala)" 
        data={categorizedDues.ujala} 
        showAll={showAllUjala} 
        setShowAll={setShowAllUjala} 
        total={categorizedDues.ujalaTotal}
        accentColor="text-blue-600"
      />

      <Section 
        title="বাহিরের বকেয়া (Outside)" 
        data={categorizedDues.outside} 
        showAll={showAllOutside} 
        setShowAll={setShowAllOutside} 
        total={categorizedDues.outsideTotal}
        accentColor="text-slate-800"
      />
    </div>
  );
};

export default UjalaManagerDashboard;
