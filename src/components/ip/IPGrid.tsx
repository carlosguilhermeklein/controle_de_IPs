import React from 'react';
import { IPAddress, DHCPRange, ColorGroup } from '../../types';
import { getIPClass } from '../../utils/ipUtils';
import { Lock } from 'lucide-react';

interface IPGridProps {
  ips: IPAddress[];
  dhcpRange: DHCPRange | null;
  colorGroups: ColorGroup[];
  onIPClick: (ip: IPAddress) => void;
}

const IPGrid: React.FC<IPGridProps> = ({ ips, dhcpRange, colorGroups, onIPClick }) => {
  const isInDHCPRange = (ip: string): boolean => {
    if (!dhcpRange) return false;
    
    const ipParts = ip.split('.').map(Number);
    const startParts = dhcpRange.start.split('.').map(Number);
    const endParts = dhcpRange.end.split('.').map(Number);
    
    const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
    const startNum = (startParts[0] << 24) + (startParts[1] << 16) + (startParts[2] << 8) + startParts[3];
    const endNum = (endParts[0] << 24) + (endParts[1] << 16) + (endParts[2] << 8) + endParts[3];
    
    return ipNum >= startNum && ipNum <= endNum;
  };

  const getIPColor = (ip: IPAddress): string | undefined => {
    if (!ip.colorGroupId) return undefined;
    const group = colorGroups.find(g => g.id === ip.colorGroupId);
    return group?.color;
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-medium text-sm">
        <div>Endereço IP</div>
        <div>Informações do Host</div>
      </div>

      <div className="space-y-1">
        {ips.map((ip) => {
          const isUsed = ip.status === 'used';
          const inDHCP = isInDHCPRange(ip.address);
          const customColor = getIPColor(ip);
          const isSpecialAddress = ip.device === 'Endereço de Rede' || ip.device === 'Endereço de Broadcast';
          
          let bgColor = '';
          let textColor = '';
          let borderColor = '';
          
          if (isSpecialAddress) {
            bgColor = 'bg-gray-100 dark:bg-gray-700';
            borderColor = 'border-gray-300 dark:border-gray-600';
            textColor = 'text-gray-700 dark:text-gray-300';
          } else if (customColor) {
            bgColor = `${customColor}33`;
            borderColor = customColor;
            textColor = 'text-gray-800 dark:text-gray-200';
          } else if (isUsed) {
            bgColor = 'bg-blue-100 dark:bg-blue-900/50';
            borderColor = 'border-blue-400 dark:border-blue-700';
            textColor = 'text-blue-800 dark:text-blue-200';
          } else {
            bgColor = inDHCP ? 'bg-amber-50 dark:bg-amber-900/50' : 'bg-gray-50 dark:bg-gray-800';
            borderColor = inDHCP ? 'border-amber-300 dark:border-amber-700' : 'border-gray-200 dark:border-gray-700';
            textColor = inDHCP ? 'text-amber-800 dark:text-amber-200' : 'text-gray-500 dark:text-gray-400';
          }
          
          return (
            <button
              key={ip.address}
              onClick={() => onIPClick(ip)}
              className={`w-full grid grid-cols-2 gap-4 p-2 rounded-md text-sm border ${borderColor} ${bgColor} ${textColor} hover:shadow-sm transition-shadow items-center relative ${isSpecialAddress ? 'cursor-not-allowed' : 'hover:bg-opacity-75'}`}
              style={customColor && !isSpecialAddress ? { backgroundColor: `${customColor}33`, borderColor: customColor } : {}}
            >
              <div className="font-mono flex items-center gap-2">
                {isSpecialAddress && (
                  <Lock size={14} className="text-gray-500 dark:text-gray-400" />
                )}
                {ip.address}
              </div>
              <div className="text-left font-sans">
                {isSpecialAddress ? (
                  <div className="flex flex-col">
                    <span className="font-medium">{ip.device}</span>
                    {ip.notes && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{ip.notes}</span>
                    )}
                  </div>
                ) : isUsed ? (
                  <div className="flex flex-col">
                    {ip.hostname && (
                      <span className="font-medium">{ip.hostname}</span>
                    )}
                    {ip.device && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{ip.device}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 italic">Não atribuído</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-1"></div>
          <span>Livre</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-amber-50 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 mr-1"></div>
          <span>Faixa DHCP</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-blue-100 dark:bg-blue-900/50 border border-blue-400 dark:border-blue-700 mr-1"></div>
          <span>Em uso</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mr-1"></div>
          <span className="flex items-center gap-1">
            <Lock size={12} />
            Bloqueado
          </span>
        </div>
        {colorGroups.map(group => (
          <div key={group.id} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-sm mr-1 border" 
              style={{ backgroundColor: `${group.color}33`, borderColor: group.color }}
            ></div>
            <span>{group.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IPGrid;