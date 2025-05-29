// IP address and CIDR utilities

/**
 * Check if an IP address is valid
 */
export const isValidIP = (ip: string): boolean => {
  const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return pattern.test(ip);
};

/**
 * Validate CIDR notation and return additional information
 */
export const validateCIDR = (cidr: string): { 
  isValid: boolean; 
  error?: string; 
  networkAddress?: string;
  broadcastAddress?: string;
  totalIPs?: number;
  mask?: string;
  isIPInRange: (ip: string) => boolean;
} => {
  // Check basic format
  const parts = cidr.split('/');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Formato CIDR inválido', isIPInRange: () => false };
  }

  const ip = parts[0];
  const prefix = parseInt(parts[1], 10);

  // Validate IP
  if (!isValidIP(ip)) {
    return { isValid: false, error: 'Endereço IP inválido', isIPInRange: () => false };
  }

  // Validate prefix
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return { isValid: false, error: 'Prefixo deve estar entre 0 e 32', isIPInRange: () => false };
  }

  // Convert IP to numeric value
  const ipOctets = ip.split('.').map(Number);
  const ipNum = ((ipOctets[0] << 24) >>> 0) + 
                ((ipOctets[1] << 16) >>> 0) + 
                ((ipOctets[2] << 8) >>> 0) + 
                ipOctets[3];

  // Calculate subnet mask
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  
  // Calculate network address
  const networkNum = ipNum & mask;
  
  // Calculate broadcast address
  const broadcastNum = networkNum | (~mask >>> 0);
  
  // Convert numeric values back to IP strings
  const networkAddress = `${(networkNum >>> 24) & 0xff}.${(networkNum >>> 16) & 0xff}.${(networkNum >>> 8) & 0xff}.${networkNum & 0xff}`;
  const broadcastAddress = `${(broadcastNum >>> 24) & 0xff}.${(broadcastNum >>> 16) & 0xff}.${(broadcastNum >>> 8) & 0xff}.${broadcastNum & 0xff}`;
  
  // Calculate subnet mask string
  const maskStr = `${(mask >>> 24) & 0xff}.${(mask >>> 16) & 0xff}.${(mask >>> 8) & 0xff}.${mask & 0xff}`;
  
  // Calculate total IPs
  const totalIPs = Math.pow(2, 32 - prefix);
  
  // Function to check if an IP is in this range
  const isIPInRange = (ipToCheck: string): boolean => {
    if (!isValidIP(ipToCheck)) return false;
    
    const checkOctets = ipToCheck.split('.').map(Number);
    const checkNum = ((checkOctets[0] << 24) >>> 0) + 
                    ((checkOctets[1] << 16) >>> 0) + 
                    ((checkOctets[2] << 8) >>> 0) + 
                    checkOctets[3];
    
    return checkNum >= networkNum && checkNum <= broadcastNum;
  };
  
  return {
    isValid: true,
    networkAddress,
    broadcastAddress,
    totalIPs: Math.max(1, totalIPs),
    mask: maskStr,
    isIPInRange
  };
};

/**
 * Generate IP addresses for a subnet
 */
export const generateIPsForSubnet = (cidr: string): IPAddress[] => {
  const validation = validateCIDR(cidr);
  if (!validation.isValid || !validation.networkAddress || !validation.broadcastAddress) {
    return [];
  }
  
  const networkParts = validation.networkAddress.split('.').map(Number);
  const broadcastParts = validation.broadcastAddress.split('.').map(Number);
  
  const ips: IPAddress[] = [];
  
  // Simple case for small subnets: generate all IPs
  if (validation.totalIPs <= 256) {
    let start = [...networkParts];
    let end = [...broadcastParts];
    
    // Generate all IPs in range
    for (let a = start[0]; a <= end[0]; a++) {
      for (let b = (a === start[0] ? start[1] : 0); b <= (a === end[0] ? end[1] : 255); b++) {
        for (let c = (a === start[0] && b === start[1] ? start[2] : 0); c <= (a === end[0] && b === end[1] ? end[2] : 255); c++) {
          for (let d = (a === start[0] && b === start[1] && c === start[2] ? start[3] : 0); d <= (a === end[0] && b === end[1] && c === end[2] ? end[3] : 255); d++) {
            const ipAddress = `${a}.${b}.${c}.${d}`;
            const isNetworkAddress = ipAddress === validation.networkAddress;
            const isBroadcastAddress = ipAddress === validation.broadcastAddress;
            
            ips.push({
              address: ipAddress,
              status: 'free',
              device: isNetworkAddress ? 'Endereço de Rede' : 
                     isBroadcastAddress ? 'Endereço de Broadcast' : undefined,
              notes: isNetworkAddress ? 'Este é o endereço de rede (network address)' :
                     isBroadcastAddress ? 'Este é o endereço de broadcast' : undefined
            });
          }
        }
      }
    }
  } else {
    // For large subnets, generate the first 256 IPs
    const a = networkParts[0];
    const b = networkParts[1];
    const c = networkParts[2];
    
    for (let d = 0; d < 256; d++) {
      const ipAddress = `${a}.${b}.${c}.${d}`;
      const isNetworkAddress = d === 0;
      const isBroadcastAddress = d === 255;
      
      ips.push({
        address: ipAddress,
        status: 'free',
        device: isNetworkAddress ? 'Endereço de Rede' : 
               isBroadcastAddress ? 'Endereço de Broadcast' : undefined,
        notes: isNetworkAddress ? 'Este é o endereço de rede (network address)' :
               isBroadcastAddress ? 'Este é o endereço de broadcast' : undefined
      });
    }
  }
  
  return ips;
};

/**
 * Get IP class (A, B, C, etc.)
 */
export const getIPClass = (ip: string): string => {
  if (!isValidIP(ip)) return 'Inválido';
  
  const firstOctet = parseInt(ip.split('.')[0], 10);
  
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet === 127) return 'Loopback';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reservado)';
  
  return 'Desconhecido';
};