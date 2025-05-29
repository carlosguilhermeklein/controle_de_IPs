import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { validateCIDR } from '../../utils/ipUtils';

interface CreateSubnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateSubnetModal: React.FC<CreateSubnetModalProps> = ({ isOpen, onClose }) => {
  const { addSubnet } = useNetwork();
  const [name, setName] = useState('');
  const [cidr, setCIDR] = useState('');
  const [gateway, setGateway] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate CIDR
    const cidrValidation = validateCIDR(cidr);
    if (!cidrValidation.isValid) {
      setError(cidrValidation.error || 'Formato CIDR inválido');
      return;
    }
    
    try {
      addSubnet({ name, cidr, gateway });
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar subrede');
    }
  };

  const resetForm = () => {
    setName('');
    setCIDR('');
    setGateway('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Criar Nova Subrede</h2>
          <button onClick={() => { resetForm(); onClose(); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Subrede
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ex: VLAN Principal"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cidr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notação CIDR
              </label>
              <input
                id="cidr"
                type="text"
                value={cidr}
                onChange={(e) => setCIDR(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ex: 192.168.1.0/24"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formato: 192.168.1.0/24 ou 10.0.0.0/16
              </p>
            </div>
            
            <div>
              <label htmlFor="gateway" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                IP do Gateway (Opcional)
              </label>
              <input
                id="gateway"
                type="text"
                value={gateway}
                onChange={(e) => setGateway(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ex: 192.168.1.1"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Criar Subrede
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubnetModal;