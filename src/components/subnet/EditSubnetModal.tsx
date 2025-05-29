import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Subnet } from '../../types';

interface EditSubnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subnet: Subnet;
}

const EditSubnetModal: React.FC<EditSubnetModalProps> = ({ isOpen, onClose, subnet }) => {
  const { updateSubnet } = useNetwork();
  const [name, setName] = useState(subnet.name);
  const [gateway, setGateway] = useState(subnet.gateway || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(subnet.name);
      setGateway(subnet.gateway || '');
      setError('');
    }
  }, [subnet, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateSubnet(subnet.id, { name, gateway });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar subrede');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Editar Subrede</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Subrede
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cidr" className="block text-sm font-medium text-gray-700 mb-1">
                Notação CIDR
              </label>
              <input
                id="cidr"
                type="text"
                value={subnet.cidr}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                O CIDR não pode ser alterado após a criação
              </p>
            </div>
            
            <div>
              <label htmlFor="gateway" className="block text-sm font-medium text-gray-700 mb-1">
                IP do Gateway (Opcional)
              </label>
              <input
                id="gateway"
                type="text"
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex: 192.168.1.1"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubnetModal;