import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Subnet } from '../../types';

interface DeleteSubnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subnet: Subnet;
}

const DeleteSubnetModal: React.FC<DeleteSubnetModalProps> = ({ isOpen, onClose, subnet }) => {
  const { deleteSubnet } = useNetwork();

  const handleDelete = () => {
    deleteSubnet(subnet.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-red-600">Excluir Subrede</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">Tem certeza?</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          
          <p className="mb-4">
            Você está prestes a excluir a subrede <strong>{subnet.name}</strong> ({subnet.cidr}).
            Isso removerá permanentemente todas as atribuições de IP e configurações associadas a esta subrede.
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Excluir Subrede
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubnetModal;