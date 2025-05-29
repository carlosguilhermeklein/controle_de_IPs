import { User } from './types';

export interface IPAddress {
  address: string;
  status: 'free' | 'used';
  hostname?: string;
  device?: string;
  notes?: string;
  lastModified?: string;
  colorGroupId?: string;
}

export interface ColorGroup {
  id: string;
  name: string;
  color: string;
}

export interface DHCPRange {
  start: string;
  end: string;
}

export interface Subnet {
  id: string;
  name: string;
  cidr: string;
  mask: string;
  gateway?: string;
  totalIPs: number;
  usedIPs: number;
  ips: IPAddress[];
  dhcpRange: DHCPRange | null;
  colorGroups: ColorGroup[];
}

export interface SubnetSummary {
  id: string;
  name: string;
  cidr: string;
  totalIPs: number;
  usedIPs: number;
}

export interface SubnetUpdate {
  name?: string;
  gateway?: string;
}

export interface NetworkStats {
  totalIPs: number;
  allocatedIPs: number;
  utilization: number;
  dhcpRanges: number;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  password?: string;
}