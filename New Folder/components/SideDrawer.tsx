
import React, { useEffect } from 'react';
import { useAppState } from '../store';
import { UserRole } from '../types';
import { COMPANY_INFO } from '../constants';
import Logo from './Logo';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { currentUser, settings, logout } = useAppState();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const getMenuItems = () => {
    if (currentUser?.role === UserRole.SUPER_ADMIN) {
      return [
        { id: 'dashboard', label: 'Owner Dashboard', icon: '📊' },
        { id: 'fleet', label: 'Fleet Explorer', icon: '🌍' },
        { id: 'managers', label: 'Manager Directory', icon: '👥' },
        { id: 'settings', label: 'App Settings', icon: '⚙️' },
        { id: 'profile', label: 'My Admin Profile', icon: '👤' },
      ];
    }
    
    if (currentUser?.role === UserRole.MANAGER) {
      return [
        { id: 'dashboard', label: 'Dashboard Overview', icon: '📈' },
        { id: 'trips', label: 'Trip Management', icon: '🛣️' },
        { id: 'exports', label: 'Export / Return Sheet', icon: '📋' },
        { id: 'sub-managers', label: 'Manage Sub-Managers', icon: '👤' },
        { id: 'drivers', label: 'Driver Management', icon: '🚛' },
        { id: 'vehicles', label: 'Vehicle Fleet', icon: '🚜' },
        { id: 'salary', label: 'Driver Salaries', icon: '💵' },
        { id: 'payments', label: 'Company Payments', icon: '💰' },
        { id: 'reports', label: 'Financial Reports', icon: '📄' },
        { id: 'chat', label: 'Manager Messages', icon: '💬' },
        { id: 'profile', label: 'My Profile', icon: '👤' },
      ];
    }

    if (currentUser?.role === UserRole.SUB_MANAGER) {
      return [
        { id: 'dashboard', label: 'Fleet & Requests', icon: '🚛' },
        { id: 'drivers', label: 'Driver Directory', icon: '👥' },
        { id: 'chat', label: 'Messages', icon: '💬' },
        { id: 'profile', label: 'My Profile', icon: '👤' },
      ];
    }

    if (currentUser?.role === UserRole.UJALA_MANAGER) {
      return [
        { id: 'dashboard', label: 'Payment Requests', icon: '💰' },
        { id: 'chat', label: 'Messages', icon: '💬' },
        { id: 'profile', label: 'My Profile', icon: '👤' },
      ];
    }

    return [
      { id: 'trips', label: 'My Trip List', icon: '🚚' },
      { id: 'salary', label: 'My Salary (বেতন)', icon: '💵' },
      { id: 'payments', label: 'Advances & Dues', icon: '💳' },
      { id: 'managers', label: 'Manager Directory', icon: '👥' },
      { id: 'chat', label: 'Chat with Manager', icon: '💬' },
      { id: 'profile', label: 'My Driver Profile', icon: '👤' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 left-0 w-[80%] max-w-[320px] bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
      >
        <div className="p-6 bg-slate-900 text-white">
          <div className="flex items-center space-x-4 mb-6">
            <Logo size="md" className="bg-white/10 shadow-none border border-white/10" />
            <div>
              <h2 className="text-lg font-bold leading-tight">{settings.appName}</h2>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Navigation Menu</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-lg">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{currentUser?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm">Log Out</span>
          </button>
          <div className="mt-4 px-4 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              {COMPANY_INFO.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
