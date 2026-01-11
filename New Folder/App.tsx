
import React, { useState, useEffect } from 'react';
import { useAppState, AppProvider } from './store';
import { UserRole } from './types';

// Components
import Header from './components/Header';
import SideDrawer from './components/SideDrawer';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageManagers from './pages/admin/ManageManagers';
import AppSettingsPage from './pages/admin/AppSettings';
import FleetExplorer from './pages/admin/FleetExplorer';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManageTrips from './pages/manager/ManageTrips';
import ManageDrivers from './pages/manager/ManageDrivers';
import ManageVehicles from './pages/manager/ManageVehicles';
import ManagePayments from './pages/manager/ManagePayments';
import Reports from './pages/manager/Reports';
import ManagerChat from './pages/manager/Chat';
import ExportSheet from './pages/manager/ExportSheet';
import ManageSalary from './pages/manager/ManageSalary';
import ManageSubManagers from './pages/manager/ManageSubManagers';

// Sub-Manager Pages
import SubManagerDashboard from './pages/submanager/Dashboard';
import SubManagerDrivers from './pages/submanager/DriverDirectory';

// Ujala Manager Pages
import UjalaManagerDashboard from './pages/ujalamanager/Dashboard';

// Shared Pages
import UnifiedProfile from './pages/shared/Profile';

// Driver Pages
import DriverTrips from './pages/driver/MyTrips';
import DriverPayments from './pages/driver/MyPayments';
import DriverChat from './pages/driver/Chat';
import ManagerDirectory from './pages/driver/ManagerDirectory';
import MySalary from './pages/driver/MySalary';

const AppContent: React.FC = () => {
  const { currentUser } = useAppState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.role === UserRole.DRIVER) {
      setActiveTab('trips');
    } else {
      setActiveTab('dashboard');
    }
  }, [currentUser?.role]);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    if (activeTab === 'profile') return <UnifiedProfile />;

    if (currentUser.role === UserRole.SUPER_ADMIN) {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'managers': return <ManageManagers />;
        case 'fleet': return <FleetExplorer />;
        case 'settings': return <AppSettingsPage />;
        default: return <AdminDashboard />;
      }
    }

    if (currentUser.role === UserRole.MANAGER) {
      switch (activeTab) {
        case 'dashboard': return <ManagerDashboard />;
        case 'trips': return <ManageTrips />;
        case 'exports': return <ExportSheet />;
        case 'drivers': return <ManageDrivers />;
        case 'sub-managers': return <ManageSubManagers />;
        case 'vehicles': return <ManageVehicles />;
        case 'payments': return <ManagePayments />;
        case 'reports': return <Reports />;
        case 'salary': return <ManageSalary />;
        case 'chat': return <ManagerChat />;
        default: return <ManagerDashboard />;
      }
    }

    if (currentUser.role === UserRole.SUB_MANAGER) {
      switch (activeTab) {
        case 'dashboard': return <SubManagerDashboard />;
        case 'drivers': return <SubManagerDrivers />;
        case 'chat': return <ManagerChat />;
        default: return <SubManagerDashboard />;
      }
    }

    if (currentUser.role === UserRole.UJALA_MANAGER) {
      switch (activeTab) {
        case 'dashboard': return <UjalaManagerDashboard />;
        case 'chat': return <ManagerChat />;
        default: return <UjalaManagerDashboard />;
      }
    }

    if (currentUser.role === UserRole.DRIVER) {
      switch (activeTab) {
        case 'trips': return <DriverTrips />;
        case 'payments': return <DriverPayments />;
        case 'salary': return <MySalary />;
        case 'chat': return <DriverChat />;
        case 'managers': return <ManagerDirectory />;
        default: return <DriverTrips />;
      }
    }

    return <div>Select a module from the menu.</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        activeTab={activeTab} 
        onMenuClick={() => setIsDrawerOpen(true)} 
      />
      
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsDrawerOpen(false);
        }}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <AppContent />
    </AppProvider>
  );
};

export default App;
