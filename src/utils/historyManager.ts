// Utility functions for managing IP Programming history

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'lookup' | 'validation' | 'subnet' | 'ping' | 'dns' | 'port' | 'whois';
  query: string;
  result: any;
  favorite?: boolean;
}

const HISTORY_KEY = 'ip-programming-history';
const MAX_HISTORY_ITEMS = 100; // Giới hạn số lượng để tránh localStorage quá lớn

/**
 * Lấy toàn bộ lịch sử từ localStorage
 */
export function getHistory(): HistoryItem[] {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
}

/**
 * Lưu một item mới vào lịch sử
 */
export function addHistoryItem(
  type: HistoryItem['type'],
  query: string,
  result: any
): void {
  try {
    const history = getHistory();
    
    const newItem: HistoryItem = {
      id: generateId(),
      timestamp: Date.now(),
      type,
      query,
      result,
      favorite: false
    };

    // Thêm item mới vào đầu mảng
    history.unshift(newItem);

    // Giới hạn số lượng items
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // Lưu vào localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));

    console.log(`✅ Đã lưu vào lịch sử: ${type} - ${query}`);
  } catch (error) {
    console.error('Error saving history:', error);
  }
}

/**
 * Xóa một item khỏi lịch sử
 */
export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error deleting history item:', error);
  }
}

/**
 * Xóa toàn bộ lịch sử
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

/**
 * Toggle favorite status của một item
 */
export function toggleFavorite(id: string): void {
  try {
    const history = getHistory();
    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Lưu lịch sử cho Ping Tool
 */
export function savePingHistory(host: string, result: any): void {
  addHistoryItem('ping', host, result);
}

/**
 * Lưu lịch sử cho DNS Lookup
 */
export function saveDNSHistory(domain: string, result: any): void {
  addHistoryItem('dns', domain, result);
}

/**
 * Lưu lịch sử cho Port Scanner
 */
export function savePortScanHistory(host: string, port: number, result: any): void {
  addHistoryItem('port', `${host}:${port}`, result);
}

/**
 * Lưu lịch sử cho WHOIS
 */
export function saveWhoisHistory(domain: string, result: any): void {
  addHistoryItem('whois', domain, result);
}

/**
 * Lưu lịch sử cho IP Validator
 */
export function saveValidationHistory(ip: string, result: any): void {
  addHistoryItem('validation', ip, result);
}

/**
 * Lưu lịch sử cho Subnet Calculator
 */
export function saveSubnetHistory(cidr: string, result: any): void {
  addHistoryItem('subnet', cidr, result);
}

/**
 * Lưu lịch sử cho IP Lookup
 */
export function saveIPLookupHistory(query: string, result: any): void {
  addHistoryItem('lookup', query, result);
}

