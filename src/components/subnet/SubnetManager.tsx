import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import SubnetList from './SubnetList';
import SubnetDetail from './SubnetDetail';
import CreateSubnetModal from './CreateSubnetModal';
import { Subnet } from '../../types';

const SubnetManager: React.FC = () => {
  const { subnets } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubnet, setSelectedSubnet] = useState<Subnet | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredSubnets = subnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    subnet.cidr.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciador de Subredes</h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar subredes..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Subrede
          </button>
        </div>
      </div>
      
      {subnets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Nenhuma Subrede Disponível</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Crie sua primeira subrede para começar a gerenciar sua rede.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Subrede
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SubnetList 
              subnets={filteredSubnets} 
              selectedSubnetId={selectedSubnet?.id}
              onSelectSubnet={setSelectedSubnet}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedSubnet ? (
              <SubnetDetail subnet={selectedSubnet} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center h-full flex items-center justify-center">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Nenhuma Subrede Selecionada</h2>
                  <p className="text-gray-600 dark:text-gray-400">Selecione uma subrede da lista para visualizar e gerenciar seus endereços IP.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <CreateSubnetModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default SubnetManager;