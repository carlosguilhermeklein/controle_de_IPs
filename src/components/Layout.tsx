import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import SubnetManager from './subnet/SubnetManager';
import Settings from './settings/Settings';
import { Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type View = 'dashboard' | 'subnets' | 'settings';

const Layout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      {/* Mobile sidebar toggle */}
      <button 
        className="absolute top-4 left-4 md:hidden z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        onClick={toggleSidebar}
      >
        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
      </button>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64`}>
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          closeSidebar={() => setSidebarOpen(false)} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'subnets' && <SubnetManager />}
          {currentView === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Layout;