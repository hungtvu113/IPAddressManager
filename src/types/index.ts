// Định nghĩa các types cho ứng dụng IP Programming

export interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  status: string;
}

export interface PingResult {
  host: string;
  alive: boolean;
  time: number;
  error?: string;
}

export interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
}

export interface DNSLookupResult {
  domain: string;
  records: {
    A?: DNSRecord[];
    AAAA?: DNSRecord[];
    MX?: DNSRecord[];
    NS?: DNSRecord[];
    TXT?: DNSRecord[];
    CNAME?: DNSRecord[];
  };
  error?: string;
}

export interface PortScanResult {
  host: string;
  port: number;
  open: boolean;
  service?: string;
  error?: string;
}

export interface WhoisResult {
  domain: string;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  nameServers?: string[];
  status?: string[];
  error?: string;
  message?: string;
  rawOutput?: string;
}

export interface NetworkTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export interface LearningSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SocketStep {
  id: string;
  name: string;
  description: string;
  code: string;
  isServer: boolean;
  order: number;
}

export interface Animation3DState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
}

// IP Validator types
export interface IPValidationResult {
  ip: string;
  isValid: boolean;
  version: 'IPv4' | 'IPv6' | 'Invalid';
  type?: 'Public' | 'Private' | 'Loopback' | 'Link-Local' | 'Multicast';
  details?: {
    binary?: string;
    decimal?: string;
    hexadecimal?: string;
    compressed?: string;
    expanded?: string;
  };
}

// Subnet Calculator types
export interface SubnetCalculation {
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
  ipType: string;
  binarySubnetMask: string;
}

// IP History types
export interface IPHistoryItem {
  id: string;
  timestamp: number;
  type: 'lookup' | 'validation' | 'subnet' | 'ping' | 'dns' | 'port' | 'whois';
  query: string;
  result: any;
  favorite?: boolean;
}

export interface IPComparisonItem {
  feature: string;
  ipv4: string;
  ipv6: string;
  category: 'basic' | 'technical' | 'security' | 'performance';
}
