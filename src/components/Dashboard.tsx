import React from 'react';
import { useNetwork } from '../context/NetworkContext';
import { Activity, Clock, Server, Wifi } from 'lucide-react';
import { SubnetSummary } from '../types';

const Dashboard: React.FC = () => {
  const { subnets, getNetworkStats } = useNetwork();
  const stats = getNetworkStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Subredes" 
          value={subnets.length.toString()} 
          icon={<Network />} 
          color="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" 
        />
        <StatCard 
          title="Total de IPs" 
          value={stats.totalIPs.toString()} 
          icon={<Wifi />} 
          color="bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300" 
        />
        <StatCard 
          title="IPs Alocados" 
          value={`${stats.allocatedIPs} (${stats.utilization}%)`} 
          icon={<Server />} 
          color="bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300" 
        />
        <StatCard 
          title="Faixas DHCP" 
          value={stats.dhcpRanges.toString()} 
          icon={<Activity />} 
          color="bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300" 
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Subredes Recentes</h2>
        {subnets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhuma subrede criada ainda. Adicione sua primeira subrede para começar.</p>
        ) : (
          <div className="space-y-4">
            {subnets.slice(0, 3).map((subnet) => (
              <SubnetCard key={subnet.id} subnet={subnet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const SubnetCard: React.FC<{ subnet: SubnetSummary }> = ({ subnet }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-800 dark:text-white">{subnet.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{subnet.cidr}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">IPs Utilizados</p>
          <p className="font-medium text-gray-800 dark:text-white">{subnet.usedIPs}/{subnet.totalIPs}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Network size={20} className="text-blue-600 dark:text-blue-300" />
        </div>
      </div>
    </div>
    <div className="mt-2">
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div 
          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full" 
          style={{ width: `${(subnet.usedIPs / subnet.totalIPs) * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const Network = () => (
  <Wifi className="h-6 w-6" />
);

export default Dashboard;