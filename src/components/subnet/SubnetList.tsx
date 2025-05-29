import React from 'react';
import { Subnet } from '../../types';
import { Network, ArrowRight } from 'lucide-react';

interface SubnetListProps {
  subnets: Subnet[];
  selectedSubnetId?: string;
  onSelectSubnet: (subnet: Subnet) => void;
}

const SubnetList: React.FC<SubnetListProps> = ({ 
  subnets, 
  selectedSubnetId,
  onSelectSubnet 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-white">Subredes Disponíveis</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {subnets.length === 0 ? (
          <li className="p-4 text-center text-gray-500 dark:text-gray-400">Nenhuma subrede encontrada</li>
        ) : (
          subnets.map(subnet => (
            <li 
              key={subnet.id}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                subnet.id === selectedSubnetId ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
              onClick={() => onSelectSubnet(subnet)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                    <Network size={18} className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{subnet.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{subnet.cidr}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 mr-2">
                    {subnet.usedIPs}/{subnet.totalIPs}
                  </span>
                  <ArrowRight size={16} className="text-gray-400" />
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
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SubnetList;