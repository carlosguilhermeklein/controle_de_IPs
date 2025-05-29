import React, { useState, useEffect } from 'react';
import { X, Save, Trash, AlertCircle } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { IPAddress, ColorGroup } from '../../types';

interface IPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ip: IPAddress;
  subnetId: string;
}

const IPDetailModal: React.FC<IPDetailModalProps> = ({ isOpen, onClose, ip, subnetId }) => {
  const { updateIP, getSubnet } = useNetwork();
  const [status, setStatus] = useState<'free' | 'used'>(ip.status);
  const [hostname, setHostname] = useState(ip.hostname || '');
  const [device, setDevice] = useState(ip.device || '');
  const [notes, setNotes] = useState(ip.notes || '');
  const [colorGroupId, setColorGroupId] = useState(ip.colorGroupId || '');
  
  const subnet = getSubnet(subnetId);
  const colorGroups: ColorGroup[] = subnet?.colorGroups || [];

  const isSpecialAddress = ip.device === 'Endereço de Rede' || ip.device === 'Endereço de Broadcast';
  
  useEffect(() => {
    if (isOpen) {
      setStatus(ip.status);
      setHostname(ip.hostname || '');
      setDevice(ip.device || '');
      setNotes(ip.notes || '');
      setColorGroupId(ip.colorGroupId || '');
    }
  }, [ip, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSpecialAddress) {
      return;
    }
    
    const updatedIP: IPAddress = {
      ...ip,
      status,
      hostname: hostname || undefined,
      device: device || undefined,
      notes: notes || undefined,
      colorGroupId: colorGroupId || undefined,
      lastModified: new Date().toISOString()
    };
    
    updateIP(subnetId, updatedIP);
    onClose();
  };
  
  const handleClear = () => {
    if (isSpecialAddress) {
      return;
    }

    const updatedIP: IPAddress = {
      address: ip.address,
      status: 'free',
      lastModified: new Date().toISOString()
    };
    
    updateIP(subnetId, updatedIP);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Endereço IP: {ip.address}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {isSpecialAddress && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-md flex items-start">
              <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0\" size={18} />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Este é um endereço especial reservado para {ip.device?.toLowerCase()}. 
                Suas configurações não podem ser modificadas.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    value="free"
                    checked={status === 'free'}
                    onChange={() => setStatus('free')}
                    disabled={isSpecialAddress}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Livre</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    value="used"
                    checked={status === 'used'}
                    onChange={() => setStatus('used')}
                    disabled={isSpecialAddress}
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Em uso</span>
                </label>
              </div>
            </div>
            
            {status === 'used' && (
              <>
                <div>
                  <label htmlFor="hostname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Host
                  </label>
                  <input
                    id="hostname"
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="ex: servidor01"
                    disabled={isSpecialAddress}
                  />
                </div>
                
                <div>
                  <label htmlFor="device" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Dispositivo
                  </label>
                  <input
                    id="device"
                    type="text"
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="ex: Servidor Web"
                    disabled={isSpecialAddress}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    placeholder="Informações adicionais sobre este IP..."
                    disabled={isSpecialAddress}
                  />
                </div>
                
                {colorGroups.length > 0 && !isSpecialAddress && (
                  <div>
                    <label htmlFor="colorGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grupo de Cores
                    </label>
                    <select
                      id="colorGroup"
                      value={colorGroupId}
                      onChange={(e) => setColorGroupId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Nenhum</option>
                      {colorGroups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            {!isSpecialAddress && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:bg-red-900/50 dark:hover:bg-red-900"
              >
                <Trash size={16} className="mr-2" />
                Limpar Dados
              </button>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              {!isSpecialAddress && (
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Save size={16} className="mr-2" />
                  Salvar
                </button>
              )}
            </div>
          </div>
          
          {ip.lastModified && (
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">
              Última modificação: {new Date(ip.lastModified).toLocaleString()}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default IPDetailModal;