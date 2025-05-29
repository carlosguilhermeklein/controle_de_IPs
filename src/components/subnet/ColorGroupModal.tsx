import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Subnet, ColorGroup } from '../../types';

interface ColorGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  subnet: Subnet;
}

const ColorGroupModal: React.FC<ColorGroupModalProps> = ({ isOpen, onClose, subnet }) => {
  const { updateSubnetColorGroups } = useNetwork();
  const [colorGroups, setColorGroups] = useState<ColorGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#10B981');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setColorGroups(subnet.colorGroups || []);
      setNewGroupName('');
      setNewGroupColor('#10B981');
      setError('');
    }
  }, [isOpen, subnet]);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      setError('O nome do grupo não pode estar vazio');
      return;
    }
    
    if (colorGroups.some(group => group.name === newGroupName.trim())) {
      setError('Já existe um grupo com este nome');
      return;
    }
    
    setColorGroups([
      ...colorGroups,
      { id: Date.now().toString(), name: newGroupName.trim(), color: newGroupColor }
    ]);
    
    setNewGroupName('');
    setNewGroupColor('#10B981');
    setError('');
  };

  const handleRemoveGroup = (id: string) => {
    setColorGroups(colorGroups.filter(group => group.id !== id));
  };

  const handleSave = () => {
    updateSubnetColorGroups(subnet.id, colorGroups);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Gerenciar Grupos de Cores</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Crie grupos de cores para categorizar seus endereços IP (ex: Servidores, Switches, Impressoras).
          </p>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Adicionar Novo Grupo</h3>
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label htmlFor="groupName" className="block text-xs text-gray-500 mb-1">
                  Nome do Grupo
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ex: Servidores"
                />
              </div>
              <div>
                <label htmlFor="groupColor" className="block text-xs text-gray-500 mb-1">
                  Cor
                </label>
                <input
                  id="groupColor"
                  type="color"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={handleAddGroup}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Grupos Atuais</h3>
            {colorGroups.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">Nenhum grupo de cores definido ainda.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {colorGroups.map(group => (
                  <li key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-md mr-2" 
                        style={{ backgroundColor: group.color }}
                      ></div>
                      <span className="text-sm">{group.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveGroup(group.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Salvar Grupos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorGroupModal;