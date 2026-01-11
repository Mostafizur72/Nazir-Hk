
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../store';
import { ChatMessage, UserRole, User } from '../../types';
import { generateId } from '../../utils';

const DriverChat: React.FC = () => {
  const { messages, currentUser, users, addMessage } = useAppState();
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get both main and sub managers for this driver
  const mainManager = users.find(u => u.id === currentUser?.assignedManagerId && u.role === UserRole.MANAGER);
  const subManagers = users.filter(u => u.role === UserRole.SUB_MANAGER && u.assignedManagerId === currentUser?.assignedManagerId);
  const allManagers = [...(mainManager ? [mainManager] : []), ...subManagers];

  const chatMessages = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === selectedManager?.id) ||
    (m.senderId === selectedManager?.id && m.receiverId === currentUser?.id)
  ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedManager) return;

    const newMessage: ChatMessage = {
      id: generateId(),
      senderId: currentUser?.id || '',
      receiverId: selectedManager.id,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    addMessage(newMessage);
    setText('');
  };

  return (
    <div className="max-w-lg mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      {!selectedManager ? (
        <div className="space-y-6">
           <div className="px-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">মেসেঞ্জার</h3>
              <p className="text-sm text-slate-500 font-medium">কার সাথে কথা বলতে চান নির্বাচন করুন।</p>
           </div>
           <div className="space-y-3">
              {allManagers.map(mgr => (
                <button 
                  key={mgr.id} 
                  onClick={() => setSelectedManager(mgr)}
                  className="w-full bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4 active:scale-95 transition-transform"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${mgr.role === UserRole.MANAGER ? 'bg-blue-600 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                    {mgr.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-black text-slate-900 leading-none">{mgr.name}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">
                      {mgr.role === UserRole.MANAGER ? 'Main Manager' : `Assistant (${mgr.subManagerType})`}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </button>
              ))}
           </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-slate-100">
           {/* Header */}
           <div className="p-4 border-b border-slate-50 flex items-center space-x-4 bg-white sticky top-0 z-10">
               <button onClick={() => setSelectedManager(null)} className="p-2 -ml-2 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
               </button>
               <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black ${selectedManager.role === UserRole.MANAGER ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'}`}>
                  {selectedManager.name.charAt(0)}
               </div>
               <div className="flex-1 overflow-hidden">
                  <h3 className="font-black text-slate-900 leading-none truncate">{selectedManager.name}</h3>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">Active</p>
               </div>
               <a href={`tel:${selectedManager.phone}`} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl active:bg-blue-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               </a>
            </div>

            {/* Message List */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4 scrollbar-hide">
              {chatMessages.length === 0 && (
                <div className="py-20 text-center opacity-20">
                   <p className="text-sm font-bold">No messages yet. Say hi!</p>
                </div>
              )}
              {chatMessages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-sm relative ${m.senderId === currentUser?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    <p className="leading-relaxed font-medium">{m.text}</p>
                    <p className={`text-[8px] mt-1.5 font-bold uppercase tracking-widest ${m.senderId === currentUser?.id ? 'text-blue-100/70' : 'text-slate-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50 flex items-center space-x-2">
              <input 
                type="text" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="মেসেজ লিখুন..." 
                className="flex-1 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 px-5 py-3.5 text-sm transition-all outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l7-7-7-7M5 12h14"/></svg>
              </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default DriverChat;
