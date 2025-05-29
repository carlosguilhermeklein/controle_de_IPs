import React, { useState } from 'react';
import { Subnet, IPAddress } from '../../types';
import { Edit, Trash, Settings, Filter } from 'lucide-react';
import IPGrid from '../ip/IPGrid';
import IPDetailModal from '../ip/IPDetailModal';
import EditSubnetModal from './EditSubnetModal';
import DeleteSubnetModal from './DeleteSubnetModal';
import DHCPRangeModal from './DHCPRangeModal';
import ColorGroupModal from './ColorGroupModal';

interface SubnetDetailProps {
  subnet: Subnet;
}

const SubnetDetail: React.FC<SubnetDetailProps> = ({ subnet }) => {
  const [selectedIP, setSelectedIP] = useState<IPAddress | null>(null);
  const [isIPDetailModalOpen, setIsIPDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDHCPModalOpen, setIsDHCPModalOpen] = useState(false);
  const [isColorGroupModalOpen, setIsColorGroupModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');

  const handleIPClick = (ip: IPAddress) => {
    setSelectedIP(ip);
    setIsIPDetailModalOpen(true);
  };

  const filteredIPs = subnet.ips.filter(ip => 
    ip.address.includes(filterText) || 
    (ip.hostname && ip.hostname.toLowerCase().includes(filterText.toLowerCase())) ||
    (ip.device && ip.device.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{subnet.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{subnet.cidr}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDHCPModalOpen(true)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Configurar Faixa DHCP"
          >
            DHCP
          </button>
          <button
            onClick={() => setIsColorGroupModalOpen(true)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            title="Gerenciar Grupos de Cores"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
            title="Editar Subrede"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
            title="Excluir Subrede"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300 mr-4">
              <span className="font-medium">Máscara:</span> {subnet.mask}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mr-4">
              <span className="font-medium">Gateway:</span> {subnet.gateway}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Utilização:</span> {subnet.usedIPs}/{subnet.totalIPs} ({Math.round((subnet.usedIPs / subnet.totalIPs) * 100)}%)
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar IPs ou hostnames..."
              className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <IPGrid 
          ips={filteredIPs} 
          dhcpRange={subnet.dhcpRange}
          colorGroups={subnet.colorGroups}
          onIPClick={handleIPClick} 
        />
      </div>

      {/* Modals */}
      {selectedIP && (
        <IPDetailModal
          isOpen={isIPDetailModalOpen}
          onClose={() => setIsIPDetailModalOpen(false)}
          ip={selectedIP}
          subnetId={subnet.id}
        />
      )}
      
      <EditSubnetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subnet={subnet}
      />
      
      <DeleteSubnetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        subnet={subnet}
      />
      
      <DHCPRangeModal
        isOpen={isDHCPModalOpen}
        onClose={() => setIsDHCPModalOpen(false)}
        subnet={subnet}
      />
      
      <ColorGroupModal
        isOpen={isColorGroupModalOpen}
        onClose={() => setIsColorGroupModalOpen(false)}
        subnet={subnet}
      />
    </div>
  );
};

export default SubnetDetail;