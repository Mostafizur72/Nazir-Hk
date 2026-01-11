
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../store';
import { UserRole, ChatMessage, User } from '../../types';
import { generateId } from '../../utils';

const ManagerChat: React.FC = () => {
  const { messages, users, currentUser, addMessage } = useAppState();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Contacts: Drivers and Sub-Managers assigned to this manager
  const contacts = users.filter(u => 
    (u.role === UserRole.DRIVER || u.role === UserRole.SUB_MANAGER) && 
    u.assignedManagerId === currentUser?.id
  );

  const chatMessages = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === selectedUser?.id) ||
    (m.senderId === selectedUser?.id && m.receiverId === currentUser?.id)
  ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    const newMessage: ChatMessage = {
      id: generateId(),
      senderId: currentUser?.id || '',
      receiverId: selectedUser.id,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    addMessage(newMessage);
    setText('');
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-500">
      {/* Contact List */}
      <div className={`w-full md:w-80 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
           <h3 className="text-lg font-black text-slate-800">Messages</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">In-App Messaging System</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
          {contacts.map(u => (
            <button 
              key={u.id} 
              onClick={() => setSelectedUser(u)}
              className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all mb-1 ${selectedUser?.id === u.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <div className={`h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg ${selectedUser?.id === u.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                {u.name.charAt(0)}
              </div>
              <div className="text-left overflow-hidden flex-1">
                <p className={`text-sm font-black truncate ${selectedUser?.id === u.id ? 'text-white' : 'text-slate-900'}`}>{u.name}</p>
                <p className={`text-[9px] font-bold uppercase tracking-tighter ${selectedUser?.id === u.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  {u.role === UserRole.SUB_MANAGER ? `Assistant (${u.subManagerType})` : 'Driver'}
                </p>
              </div>
              {u.isActive && <div className={`w-2 h-2 rounded-full ${selectedUser?.id === u.id ? 'bg-white' : 'bg-emerald-500'}`}></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            <div className="p-5 border-b border-slate-50 flex items-center space-x-4 bg-white sticky top-0 z-10">
               <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
               </button>
               <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600">
                  {selectedUser.name.charAt(0)}
               </div>
               <div className="flex-1">
                  <h3 className="font-black text-slate-900 leading-none">{selectedUser.name}</h3>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Active Now</p>
               </div>
               <a href={`tel:${selectedUser.phone}`} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               </a>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4 scrollbar-hide">
              {chatMessages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm relative ${m.senderId === currentUser?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    <p className="leading-relaxed font-medium">{m.text}</p>
                    <p className={`text-[8px] mt-1.5 font-bold uppercase tracking-widest ${m.senderId === currentUser?.id ? 'text-blue-100/70' : 'text-slate-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50 flex items-center space-x-3">
              <input 
                type="text" 
                value={text} 
                onChange={e => setText(e.target.value)} 
                placeholder="আপনার মেসেজ লিখুন..." 
                className="flex-1 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 px-5 py-3.5 text-sm transition-all outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 transition-transform">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-10 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl mb-6">💬</div>
             <h4 className="text-lg font-black text-slate-400">Select a Conversation</h4>
             <p className="text-sm font-medium mt-2 max-w-[200px]">Choose a driver or assistant from the list to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerChat;
