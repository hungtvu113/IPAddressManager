'use client';

import { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Star,
  Download,
  Search,
  Clock,
  Filter,
  AlertCircle
} from 'lucide-react';
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
  toggleFavorite as toggleHistoryFavorite,
  type HistoryItem
} from '@/utils/historyManager';

type FilterType = 'all' | 'lookup' | 'validation' | 'subnet' | 'ping' | 'dns' | 'port' | 'whois' | 'favorites';

export default function IPHistoryTool() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load history from localStorage
  useEffect(() => {
    loadHistory();
  }, []);

  // Reload history
  const loadHistory = () => {
    const savedHistory = getHistory();
    setHistory(savedHistory);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    toggleHistoryFavorite(id);
    loadHistory(); // Reload to update UI
  };

  // Delete item
  const deleteItem = (id: string) => {
    deleteHistoryItem(id);
    loadHistory(); // Reload to update UI
  };

  // Clear all history
  const clearAllHistory = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
      clearHistory();
      loadHistory(); // Reload to update UI
    }
  };

  // Export history as JSON
  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter history
  const filteredHistory = history.filter(item => {
    // Filter by type
    if (filter === 'favorites' && !item.favorite) return false;
    if (filter !== 'all' && filter !== 'favorites' && item.type !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !item.query.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lookup': return 'bg-blue-600';
      case 'validation': return 'bg-green-600';
      case 'subnet': return 'bg-purple-600';
      case 'ping': return 'bg-yellow-600';
      case 'dns': return 'bg-cyan-600';
      case 'port': return 'bg-red-600';
      case 'whois': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'lookup': return 'IP Lookup';
      case 'validation': return 'IP Validation';
      case 'subnet': return 'Subnet Calc';
      case 'ping': return 'Ping';
      case 'dns': return 'DNS Lookup';
      case 'port': return 'Port Scan';
      case 'whois': return 'WHOIS';
      default: return type;
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) return 'Vừa xong';
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} phút trước`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} giờ trước`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} ngày trước`;
    }
    
    // Format as date
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <History className="w-6 h-6 text-blue-400 mr-2" />
            Lịch sử tra cứu
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportHistory}
              disabled={history.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={clearAllHistory}
              disabled={history.length === 0}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm trong lịch sử..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">Lọc:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all' as FilterType, name: 'Tất cả' },
            { id: 'favorites' as FilterType, name: 'Yêu thích' },
            { id: 'lookup' as FilterType, name: 'IP Lookup' },
            { id: 'validation' as FilterType, name: 'Validation' },
            { id: 'subnet' as FilterType, name: 'Subnet' },
            { id: 'ping' as FilterType, name: 'Ping' },
            { id: 'dns' as FilterType, name: 'DNS' },
            { id: 'port' as FilterType, name: 'Port Scan' },
            { id: 'whois' as FilterType, name: 'WHOIS' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterOption.name}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            {history.length === 0 ? 'Chưa có lịch sử tra cứu' : 'Không tìm thấy kết quả'}
          </p>
          <p className="text-gray-500 text-sm">
            {history.length === 0 
              ? 'Lịch sử tra cứu của bạn sẽ được lưu tự động khi bạn sử dụng các công cụ'
              : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 ${getTypeColor(item.type)} text-white text-xs font-medium rounded-full`}>
                      {getTypeName(item.type)}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                  <p className="text-white font-mono text-lg mb-1">{item.query}</p>
                  {item.result && (
                    <div className="text-gray-400 text-sm">
                      {typeof item.result === 'string' 
                        ? item.result 
                        : JSON.stringify(item.result).substring(0, 100) + '...'
                      }
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.favorite
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    title={item.favorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Star className={`w-4 h-4 ${item.favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {history.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h4 className="text-lg font-bold text-white mb-4">Thống kê</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-500">
              <p className="text-3xl font-bold text-blue-400">{history.length}</p>
              <p className="text-gray-300 text-sm mt-1">Tổng số</p>
            </div>
            <div className="text-center p-4 bg-yellow-600/20 rounded-lg border border-yellow-500">
              <p className="text-3xl font-bold text-yellow-400">
                {history.filter(item => item.favorite).length}
              </p>
              <p className="text-gray-300 text-sm mt-1">Yêu thích</p>
            </div>
            <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-500">
              <p className="text-3xl font-bold text-green-400">
                {new Set(history.map(item => item.type)).size}
              </p>
              <p className="text-gray-300 text-sm mt-1">Loại công cụ</p>
            </div>
            <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500">
              <p className="text-3xl font-bold text-purple-400">
                {history.filter(item => {
                  const diff = Date.now() - item.timestamp;
                  return diff < 86400000; // Last 24 hours
                }).length}
              </p>
              <p className="text-gray-300 text-sm mt-1">Hôm nay</p>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Về lịch sử tra cứu:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>Lịch sử được lưu tự động trong trình duyệt (localStorage)</li>
              <li>Đánh dấu sao để lưu các tra cứu quan trọng</li>
              <li>Export lịch sử để backup hoặc chia sẻ</li>
              <li>Dữ liệu chỉ lưu trên máy bạn, không gửi lên server</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

