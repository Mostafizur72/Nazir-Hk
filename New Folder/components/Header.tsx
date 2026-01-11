
import React from 'react';
import { useAppState } from '../store';
import Logo from './Logo';

interface HeaderProps {
  activeTab: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onMenuClick }) => {
  const { currentUser, settings } = useAppState();

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center space-x-3">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          aria-label="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          <Logo size="sm" />
          <h1 className="font-bold text-gray-900 truncate max-w-[120px] sm:max-w-none tracking-tight">
            {settings.appName}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right hidden xs:block">
          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
            {currentUser?.role.replace('_', ' ')}
          </p>
          <p className="text-sm font-bold text-gray-900 leading-none">{currentUser?.name}</p>
        </div>
        <img 
          src={currentUser?.photoUrl || `https://picsum.photos/seed/${currentUser?.id}/100/100`} 
          alt="Profile" 
          className="w-9 h-9 rounded-xl border border-gray-100 shadow-sm object-cover"
        />
      </div>
    </header>
  );
};

export default Header;
