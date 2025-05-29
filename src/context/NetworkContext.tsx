import React, { createContext, useContext, useState, useEffect } from 'react';
import { Database } from '../utils/database';
import { Subnet, SubnetUpdate, IPAddress, DHCPRange, ColorGroup, Toast, NetworkStats } from '../types';
import { validateCIDR, generateIPsForSubnet } from '../utils/ipUtils';

interface NetworkContextProps {
  subnets: Subnet[];
  subnetCount: number;
  getNetworkStats: () => NetworkStats;
  addSubnet: (data: { name: string; cidr: string; gateway?: string }) => Promise<void>;
  updateSubnet: (id: string, data: SubnetUpdate) => Promise<void>;
  deleteSubnet: (id: string) => Promise<void>;
  getSubnet: (id: string) => Subnet | undefined;
  updateSubnetDHCPRange: (id: string, dhcpRange: DHCPRange | null) => Promise<void>;
  updateSubnetColorGroups: (id: string, colorGroups: ColorGroup[]) => Promise<void>;
  updateIP: (subnetId: string, ip: IPAddress) => Promise<void>;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NetworkContext = createContext<NetworkContextProps | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    loadSubnets();
  }, []);

  const loadSubnets = async () => {
    const loadedSubnets = await Database.getSubnets();
    setSubnets(loadedSubnets);
  };
  
  const addSubnet = async (data: { name: string; cidr: string; gateway?: string }) => {
    const { name, cidr, gateway } = data;
    
    const validation = validateCIDR(cidr);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid CIDR format');
    }
    
    if (subnets.some(s => s.cidr === cidr)) {
      throw new Error('A subnet with this CIDR already exists');
    }
    
    const ips = generateIPsForSubnet(cidr);
    
    const newSubnet: Subnet = {
      id: Date.now().toString(),
      name,
      cidr,
      mask: validation.mask || '',
      gateway,
      totalIPs: validation.totalIPs || 0,
      usedIPs: 0,
      ips,
      dhcpRange: null,
      colorGroups: []
    };
    
    if (gateway) {
      const gatewayIP = ips.find(ip => ip.address === gateway);
      if (gatewayIP) {
        gatewayIP.status = 'used';
        gatewayIP.hostname = 'Gateway';
        gatewayIP.device = 'Router/Gateway';
        newSubnet.usedIPs = 1;
      }
    }
    
    await Database.addSubnet(newSubnet);
    setSubnets(prev => [...prev, newSubnet]);
    
    addToast({
      title: 'Subnet Created',
      description: `Subnet ${name} (${cidr}) was created successfully`,
      type: 'success'
    });
  };
  
  const updateSubnet = async (id: string, data: SubnetUpdate) => {
    const updatedSubnets = subnets.map(subnet => {
      if (subnet.id === id) {
        return { ...subnet, ...data };
      }
      return subnet;
    });
    
    await Database.saveSubnets(updatedSubnets);
    setSubnets(updatedSubnets);
    
    addToast({
      title: 'Subnet Updated',
      description: `Subnet settings were updated successfully`,
      type: 'success'
    });
  };
  
  const deleteSubnet = async (id: string) => {
    const subnetToDelete = subnets.find(s => s.id === id);
    await Database.deleteSubnet(id);
    setSubnets(prev => prev.filter(subnet => subnet.id !== id));
    
    if (subnetToDelete) {
      addToast({
        title: 'Subnet Deleted',
        description: `Subnet ${subnetToDelete.name} was deleted successfully`,
        type: 'info'
      });
    }
  };
  
  const getSubnet = (id: string) => {
    return subnets.find(subnet => subnet.id === id);
  };
  
  const updateSubnetDHCPRange = async (id: string, dhcpRange: DHCPRange | null) => {
    const updatedSubnets = subnets.map(subnet => {
      if (subnet.id === id) {
        return { ...subnet, dhcpRange };
      }
      return subnet;
    });
    
    await Database.saveSubnets(updatedSubnets);
    setSubnets(updatedSubnets);
    
    addToast({
      title: 'DHCP Range Updated',
      description: dhcpRange 
        ? `DHCP range set to ${dhcpRange.start} - ${dhcpRange.end}` 
        : 'DHCP range has been disabled',
      type: 'success'
    });
  };
  
  const updateSubnetColorGroups = async (id: string, colorGroups: ColorGroup[]) => {
    const updatedSubnets = subnets.map(subnet => {
      if (subnet.id === id) {
        return { ...subnet, colorGroups };
      }
      return subnet;
    });
    
    await Database.saveSubnets(updatedSubnets);
    setSubnets(updatedSubnets);
    
    addToast({
      title: 'Color Groups Updated',
      description: `Color groups have been updated successfully`,
      type: 'success'
    });
  };
  
  const updateIP = async (subnetId: string, updatedIP: IPAddress) => {
    const updatedSubnets = subnets.map(subnet => {
      if (subnet.id === subnetId) {
        const wasUsedBefore = subnet.ips.find(ip => ip.address === updatedIP.address)?.status === 'used';
        const isUsedNow = updatedIP.status === 'used';
        
        let newUsedIPs = subnet.usedIPs;
        if (wasUsedBefore && !isUsedNow) {
          newUsedIPs -= 1;
        } else if (!wasUsedBefore && isUsedNow) {
          newUsedIPs += 1;
        }
        
        const newIPs = subnet.ips.map(ip => 
          ip.address === updatedIP.address ? updatedIP : ip
        );
        
        return { 
          ...subnet, 
          ips: newIPs,
          usedIPs: newUsedIPs
        };
      }
      return subnet;
    });
    
    await Database.saveSubnets(updatedSubnets);
    setSubnets(updatedSubnets);
    
    addToast({
      title: 'IP Updated',
      description: `IP ${updatedIP.address} was updated successfully`,
      type: 'success'
    });
  };
  
  const getNetworkStats = (): NetworkStats => {
    const totalIPs = subnets.reduce((sum, subnet) => sum + subnet.totalIPs, 0);
    const allocatedIPs = subnets.reduce((sum, subnet) => sum + subnet.usedIPs, 0);
    const utilization = totalIPs > 0 ? Math.round((allocatedIPs / totalIPs) * 100) : 0;
    const dhcpRanges = subnets.filter(subnet => subnet.dhcpRange !== null).length;
    
    return {
      totalIPs,
      allocatedIPs,
      utilization,
      dhcpRanges
    };
  };
  
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <NetworkContext.Provider value={{
      subnets,
      subnetCount: subnets.length,
      getNetworkStats,
      addSubnet,
      updateSubnet,
      deleteSubnet,
      getSubnet,
      updateSubnetDHCPRange,
      updateSubnetColorGroups,
      updateIP,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};