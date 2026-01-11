
import React from 'react';
import { useAppState } from '../store';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAppState();

  const getTabs = () => {
    if (currentUser?.role === UserRole.DRIVER) {
      return [
        { id: 'trips', label: 'Trips', icon: '🚚' },
        { id: 'payments', label: 'Due', icon: '💳' },
        { id: 'managers', label: 'Managers', icon: '👥' },
        { id: 'profile', label: 'Profile', icon: '👤' },
      ];
    }
    if (currentUser?.role === UserRole.SUB_MANAGER) {
      return [
        { id: 'dashboard', label: 'Fleet', icon: '🚛' },
        { id: 'drivers', label: 'Drivers', icon: '👥' },
        { id: 'chat', label: 'Messages', icon: '💬' },
      ];
    }
    if (currentUser?.role === UserRole.UJALA_MANAGER) {
      return [
        { id: 'dashboard', label: 'Requests', icon: '💰' },
        { id: 'chat', label: 'Messages', icon: '💬' },
      ];
    }
    return [
      { id: 'dashboard', label: 'Home', icon: '📊' },
      { id: 'trips', label: 'Trips', icon: '🛣️' },
      { id: 'chat', label: 'Messages', icon: '💬' },
      { id: 'reports', label: 'Reports', icon: '📄' },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)] flex justify-around items-center h-16 sm:h-20">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex flex-col items-center justify-center flex-1 py-1 relative h-full"
        >
          <div className={`text-2xl mb-1 transition-transform duration-200 ${activeTab === tab.id ? 'scale-110 -translate-y-1' : 'scale-100 translate-y-0 opacity-60'}`}>
            {tab.icon}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}>
            {tab.label}
          </span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 w-8 h-1 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
