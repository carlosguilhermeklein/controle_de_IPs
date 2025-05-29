import React from 'react';
import { LayoutDashboard, Network, Settings as SettingsIcon, LogOut, X, Sun, Moon } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type View = 'dashboard' | 'subnets' | 'settings';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, closeSidebar }) => {
  const { subnetCount } = useNetwork();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Gerenciador de IP</h1>
        </div>
        <button className="md:hidden" onClick={closeSidebar}>
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => { setView('dashboard'); closeSidebar(); }}
              className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                currentView === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Painel
            </button>
          </li>
          <li>
            <button
              onClick={() => { setView('subnets'); closeSidebar(); }}
              className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                currentView === 'subnets' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Network className="h-5 w-5 mr-3" />
              Subredes
              <span className="ml-auto bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                {subnetCount}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => { setView('settings'); closeSidebar(); }}
              className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                currentView === 'settings' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <SettingsIcon className="h-5 w-5 mr-3" />
              Configurações
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="border-t dark:border-gray-700 p-4">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                onClick={signOut}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;