// Utility functions cho IP Calculator và Subnet Analysis

/**
 * Kiểm tra IPv4 hợp lệ
 */
export function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

/**
 * Kiểm tra IPv6 hợp lệ
 */
export function isValidIPv6(ip: string): boolean {
  // IPv6 regex - hỗ trợ cả dạng đầy đủ và rút gọn
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
}

/**
 * Kiểm tra CIDR notation hợp lệ
 */
export function isValidCIDR(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  
  const ip = parts[0];
  const prefix = parseInt(parts[1]);
  
  if (isValidIPv4(ip)) {
    return prefix >= 0 && prefix <= 32;
  } else if (isValidIPv6(ip)) {
    return prefix >= 0 && prefix <= 128;
  }
  
  return false;
}

/**
 * Chuyển IPv4 thành số nguyên
 */
export function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

/**
 * Chuyển số nguyên thành IPv4
 */
export function intToIPv4(int: number): string {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.');
}

/**
 * Tính toán subnet mask từ prefix length
 */
export function prefixToSubnetMask(prefix: number): string {
  const mask = ~((1 << (32 - prefix)) - 1);
  return intToIPv4(mask >>> 0);
}

/**
 * Tính toán wildcard mask
 */
export function getWildcardMask(prefix: number): string {
  const mask = (1 << (32 - prefix)) - 1;
  return intToIPv4(mask >>> 0);
}

/**
 * Phân tích subnet IPv4
 */
export interface SubnetInfo {
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipType: 'Public' | 'Private' | 'Loopback' | 'Link-Local' | 'Multicast';
  binarySubnetMask: string;
}

export function analyzeSubnet(cidr: string): SubnetInfo | null {
  const parts = cidr.split('/');
  if (parts.length !== 2) return null;
  
  const ip = parts[0];
  const prefix = parseInt(parts[1]);
  
  if (!isValidIPv4(ip) || prefix < 0 || prefix > 32) return null;
  
  const ipInt = ipv4ToInt(ip);
  const maskInt = ~((1 << (32 - prefix)) - 1) >>> 0;
  
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | ~maskInt) >>> 0;
  
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix === 32 ? 1 : (prefix === 31 ? 2 : totalHosts - 2);
  
  const firstHostInt = prefix === 32 ? networkInt : networkInt + 1;
  const lastHostInt = prefix === 32 ? networkInt : broadcastInt - 1;
  
  // Xác định IP class
  const firstOctet = (networkInt >>> 24) & 0xFF;
  let ipClass = '';
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Reserved)';
  
  // Xác định IP type
  let ipType: SubnetInfo['ipType'] = 'Public';
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || 
      (firstOctet === 172 && ((networkInt >>> 16) & 0xFF) >= 16 && ((networkInt >>> 16) & 0xFF) <= 31)) {
    ipType = 'Private';
  } else if (ip.startsWith('127.')) {
    ipType = 'Loopback';
  } else if (ip.startsWith('169.254.')) {
    ipType = 'Link-Local';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipType = 'Multicast';
  }
  
  // Binary subnet mask
  const binarySubnetMask = maskInt.toString(2).padStart(32, '0')
    .match(/.{1,8}/g)?.join('.') || '';
  
  return {
    cidr,
    networkAddress: intToIPv4(networkInt),
    broadcastAddress: intToIPv4(broadcastInt),
    subnetMask: prefixToSubnetMask(prefix),
    wildcardMask: getWildcardMask(prefix),
    firstHost: intToIPv4(firstHostInt),
    lastHost: intToIPv4(lastHostInt),
    totalHosts,
    usableHosts,
    ipClass,
    ipType,
    binarySubnetMask
  };
}

/**
 * Rút gọn địa chỉ IPv6
 */
export function compressIPv6(ipv6: string): string {
  // Chuyển về lowercase
  ipv6 = ipv6.toLowerCase();
  
  // Tách thành các phần
  const parts = ipv6.split(':');
  
  // Loại bỏ leading zeros
  const compressed = parts.map(part => part.replace(/^0+/, '') || '0');
  
  // Tìm chuỗi dài nhất của các '0' liên tiếp
  let maxZeroStart = -1;
  let maxZeroLength = 0;
  let currentZeroStart = -1;
  let currentZeroLength = 0;
  
  for (let i = 0; i < compressed.length; i++) {
    if (compressed[i] === '0') {
      if (currentZeroStart === -1) {
        currentZeroStart = i;
        currentZeroLength = 1;
      } else {
        currentZeroLength++;
      }
    } else {
      if (currentZeroLength > maxZeroLength) {
        maxZeroStart = currentZeroStart;
        maxZeroLength = currentZeroLength;
      }
      currentZeroStart = -1;
      currentZeroLength = 0;
    }
  }
  
  // Kiểm tra lần cuối
  if (currentZeroLength > maxZeroLength) {
    maxZeroStart = currentZeroStart;
    maxZeroLength = currentZeroLength;
  }
  
  // Thay thế chuỗi '0' dài nhất bằng '::'
  if (maxZeroLength > 1) {
    const before = compressed.slice(0, maxZeroStart);
    const after = compressed.slice(maxZeroStart + maxZeroLength);
    
    if (before.length === 0 && after.length === 0) {
      return '::';
    } else if (before.length === 0) {
      return '::' + after.join(':');
    } else if (after.length === 0) {
      return before.join(':') + '::';
    } else {
      return before.join(':') + '::' + after.join(':');
    }
  }
  
  return compressed.join(':');
}

/**
 * Mở rộng địa chỉ IPv6 về dạng đầy đủ
 */
export function expandIPv6(ipv6: string): string {
  // Xử lý '::'
  if (ipv6.includes('::')) {
    const parts = ipv6.split('::');
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    const missing = 8 - left.length - right.length;
    const middle = Array(missing).fill('0000');
    const all = [...left, ...middle, ...right];
    ipv6 = all.join(':');
  }
  
  // Expand mỗi phần thành 4 chữ số
  return ipv6.split(':')
    .map(part => part.padStart(4, '0'))
    .join(':');
}

/**
 * So sánh IPv4 và IPv6
 */
export interface IPComparison {
  feature: string;
  ipv4: string;
  ipv6: string;
  category: 'basic' | 'technical' | 'security' | 'performance';
}

export const ipComparisonData: IPComparison[] = [
  {
    feature: 'Độ dài địa chỉ',
    ipv4: '32 bits',
    ipv6: '128 bits',
    category: 'basic'
  },
  {
    feature: 'Số lượng địa chỉ',
    ipv4: '~4.3 tỷ (2³²)',
    ipv6: '~340 undecillion (2¹²⁸)',
    category: 'basic'
  },
  {
    feature: 'Định dạng',
    ipv4: 'Thập phân (192.168.1.1)',
    ipv6: 'Thập lục phân (2001:db8::1)',
    category: 'basic'
  },
  {
    feature: 'Header size',
    ipv4: '20-60 bytes (variable)',
    ipv6: '40 bytes (fixed)',
    category: 'technical'
  },
  {
    feature: 'Checksum',
    ipv4: 'Có header checksum',
    ipv6: 'Không có header checksum',
    category: 'technical'
  },
  {
    feature: 'Fragmentation',
    ipv4: 'Router và sender',
    ipv6: 'Chỉ sender',
    category: 'technical'
  },
  {
    feature: 'IPSec',
    ipv4: 'Tùy chọn',
    ipv6: 'Bắt buộc (built-in)',
    category: 'security'
  },
  {
    feature: 'NAT',
    ipv4: 'Cần thiết',
    ipv6: 'Không cần thiết',
    category: 'technical'
  },
  {
    feature: 'Broadcast',
    ipv4: 'Có hỗ trợ',
    ipv6: 'Không có (dùng multicast)',
    category: 'technical'
  },
  {
    feature: 'Configuration',
    ipv4: 'Manual hoặc DHCP',
    ipv6: 'Auto-configuration (SLAAC)',
    category: 'technical'
  },
  {
    feature: 'QoS',
    ipv4: 'Hỗ trợ hạn chế',
    ipv6: 'Hỗ trợ tốt hơn (Flow Label)',
    category: 'performance'
  },
  {
    feature: 'Mobility',
    ipv4: 'Cần Mobile IP',
    ipv6: 'Built-in mobility support',
    category: 'performance'
  }
];

