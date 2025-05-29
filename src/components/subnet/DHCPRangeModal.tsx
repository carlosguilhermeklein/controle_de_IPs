import React, { useState, useEffect } from 'react';
import { X, WifiOff } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { Subnet, DHCPRange } from '../../types';
import { isValidIP } from '../../utils/ipUtils';

interface DHCPRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  subnet: Subnet;
}

const DHCPRangeModal: React.FC<DHCPRangeModalProps> = ({ isOpen, onClose, subnet }) => {
  const { updateSubnetDHCPRange } = useNetwork();
  const [startIP, setStartIP] = useState('');
  const [endIP, setEndIP] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && subnet) {
      if (subnet.dhcpRange) {
        setStartIP(subnet.dhcpRange.start);
        setEndIP(subnet.dhcpRange.end);
        setEnabled(true);
      } else {
        // Default values based on subnet
        const parts = subnet.cidr.split('/')[0].split('.');
        setStartIP(`${parts[0]}.${parts[1]}.${parts[2]}.100`);
        setEndIP(`${parts[0]}.${parts[1]}.${parts[2]}.200`);
        setEnabled(false);
      }
      setError('');
    }
  }, [isOpen, subnet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (enabled) {
      // Validate IPs
      if (!isValidIP(startIP)) {
        setError('Start IP is not valid');
        return;
      }
      
      if (!isValidIP(endIP)) {
        setError('End IP is not valid');
        return;
      }
      
      // Check if IPs are in subnet range
      const cidrValidation = { isIPInRange: (ip: string) => true }; // Placeholder for actual validation
      if (!cidrValidation.isIPInRange(startIP) || !cidrValidation.isIPInRange(endIP)) {
        setError('IP addresses must be within the subnet range');
        return;
      }
      
      // Check if start IP is before end IP
      const startParts = startIP.split('.').map(Number);
      const endParts = endIP.split('.').map(Number);
      
      for (let i = 0; i < 4; i++) {
        if (startParts[i] < endParts[i]) break;
        if (startParts[i] > endParts[i]) {
          setError('Start IP must be less than End IP');
          return;
        }
      }
      
      const dhcpRange: DHCPRange = { start: startIP, end: endIP };
      updateSubnetDHCPRange(subnet.id, dhcpRange);
    } else {
      // Remove DHCP range
      updateSubnetDHCPRange(subnet.id, null);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">DHCP Range Configuration</h2>
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
          
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <input
                id="enabled"
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
                Enable DHCP Range
              </label>
            </div>
            
            {!enabled && (
              <div className="flex items-center p-4 bg-gray-50 rounded-md">
                <WifiOff size={20} className="text-gray-500 mr-3" />
                <p className="text-sm text-gray-600">
                  DHCP is currently disabled for this subnet.
                </p>
              </div>
            )}
          </div>
          
          {enabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startIP" className="block text-sm font-medium text-gray-700 mb-1">
                    Start IP
                  </label>
                  <input
                    id="startIP"
                    type="text"
                    value={startIP}
                    onChange={(e) => setStartIP(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 192.168.1.100"
                    required={enabled}
                  />
                </div>
                
                <div>
                  <label htmlFor="endIP" className="block text-sm font-medium text-gray-700 mb-1">
                    End IP
                  </label>
                  <input
                    id="endIP"
                    type="text"
                    value={endIP}
                    onChange={(e) => setEndIP(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 192.168.1.200"
                    required={enabled}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                This range will be visually highlighted in the IP grid and can be used to configure your DHCP server.
              </p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DHCPRangeModal;