// Utility functions cho API calls

import { IPInfo, PingResult, DNSLookupResult, PortScanResult, WhoisResult } from '@/types';

const API_BASE = '/api';

export const ipApi = {
  // Lấy thông tin IP hiện tại của người dùng
  getCurrentIP: async (): Promise<IPInfo> => {
    try {
      const response = await fetch(`${API_BASE}/ip-info`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Không thể lấy thông tin IP');
      }

      const data = await response.json();

      // Kiểm tra xem API có trả về dữ liệu hợp lệ không
      if (!data || !data.query) {
        throw new Error('API trả về dữ liệu không hợp lệ');
      }

      // Map 'query' field to 'ip' field for consistency
      return {
        ...data,
        ip: data.query,
      };
    } catch (error: any) {
      console.error('getCurrentIP error:', error);
      throw error;
    }
  },

  // Tra cứu thông tin IP hoặc domain
  lookupIP: async (query: string): Promise<IPInfo> => {
    try {
      const response = await fetch(`${API_BASE}/ip-info?ip=${encodeURIComponent(query)}`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Không thể tra cứu IP');
      }

      const data = await response.json();

      // Map 'query' field to 'ip' field for consistency
      return {
        ...data,
        ip: data.query,
      };
    } catch (error: any) {
      console.error('lookupIP error:', error);
      throw error;
    }
  },

  // Ping một host
  ping: async (host: string): Promise<PingResult> => {
    const response = await fetch(`${API_BASE}/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host }),
    });
    if (!response.ok) {
      throw new Error('Lỗi khi ping host');
    }
    return response.json();
  },

  // DNS Lookup
  dnsLookup: async (domain: string): Promise<DNSLookupResult> => {
    const response = await fetch(`${API_BASE}/dns-lookup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
    if (!response.ok) {
      throw new Error('Lỗi khi tra cứu DNS');
    }
    return response.json();
  },

  // Port Scanner
  scanPort: async (host: string, port: number): Promise<PortScanResult> => {
    const response = await fetch(`${API_BASE}/port-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port }),
    });
    if (!response.ok) {
      throw new Error('Lỗi khi quét port');
    }
    return response.json();
  },

  // WHOIS Lookup
  whoisLookup: async (domain: string): Promise<WhoisResult> => {
    const response = await fetch(`${API_BASE}/whois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
    });
    if (!response.ok) {
      throw new Error('Lỗi khi tra cứu WHOIS');
    }
    return response.json();
  },
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatLatency = (ms: number): string => {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

export const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 regex - hỗ trợ cả dạng đầy đủ và rút gọn
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Không thể sao chép:', err);
    return false;
  }
};
