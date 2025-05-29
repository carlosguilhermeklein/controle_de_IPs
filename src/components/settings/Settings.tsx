import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import UserManagement from './UserManagement';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="h-6 w-6 text-gray-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <UserManagement />
      </div>
    </div>
  );
};

export default Settings;