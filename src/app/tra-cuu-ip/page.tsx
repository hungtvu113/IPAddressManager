'use client';

import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe, 
  Wifi, 
  Clock, 
  Copy, 
  CheckCircle,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import { IPInfo } from '@/types';
import { ipApi, copyToClipboard, isValidIP, isValidDomain } from '@/utils/api';
import dynamic from 'next/dynamic';

const IPMap = dynamic(() => import('@/components/maps/IPMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 rounded-lg flex items-center justify-center">
    <p className="text-gray-400">Đang tải bản đồ...</p>
  </div>
});

export default function IPLookupPage() {
  const [query, setQuery] = useState('');
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (!isValidIP(query) && !isValidDomain(query)) {
      setError('Vui lòng nhập địa chỉ IP hoặc tên miền hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ipApi.lookupIP(query.trim());
      setIpInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tra cứu');
      setIpInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyIP = async () => {
    if (ipInfo?.ip) {
      const success = await copyToClipboard(ipInfo.ip);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const clearResults = () => {
    setIpInfo(null);
    setError(null);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Tra cứu IP
          </h1>
          <p className="text-gray-400 text-lg">
            Tra cứu thông tin chi tiết của bất kỳ địa chỉ IP hoặc tên miền nào
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập địa chỉ IP hoặc tên miền (ví dụ: 8.8.8.8 hoặc google.com)"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{loading ? 'Đang tra cứu...' : 'Tra cứu'}</span>
            </button>
            {(ipInfo || error) && (
              <button
                type="button"
                onClick={clearResults}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Xóa kết quả
              </button>
            )}
          </form>

          {/* Info */}
          <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Hỗ trợ tra cứu:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                  <li>Địa chỉ IPv4 (ví dụ: 8.8.8.8, 1.1.1.1)</li>
                  <li>Tên miền (ví dụ: google.com, facebook.com)</li>
                  <li>Subdomain (ví dụ: www.example.com)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-700">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {ipInfo && (
          <>
            {/* IP Display */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 text-center border border-gray-700">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Globe className="w-8 h-8 text-blue-400" />
                <span className="text-4xl md:text-6xl font-mono font-bold text-white">
                  {ipInfo.ip}
                </span>
                <button
                  onClick={handleCopyIP}
                  className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                  title="Sao chép IP"
                >
                  {copied ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Copy className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-sm animate-pulse">
                  Đã sao chép IP vào clipboard!
                </p>
              )}
              {query !== ipInfo.ip && (
                <p className="text-gray-400 text-sm mt-2">
                  Kết quả tra cứu cho: <span className="text-blue-400 font-mono">{query}</span>
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Location Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-blue-400 mr-2" />
                  Thông tin địa lý
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Thành phố:</span>
                    <span className="text-white font-medium">{ipInfo.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Khu vực:</span>
                    <span className="text-white font-medium">{ipInfo.region}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quốc gia:</span>
                    <span className="text-white font-medium">
                      {ipInfo.country} ({ipInfo.countryCode})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tọa độ:</span>
                    <span className="text-white font-medium">
                      {ipInfo.lat.toFixed(4)}, {ipInfo.lon.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Múi giờ:</span>
                    <span className="text-white font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {ipInfo.timezone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Wifi className="w-6 h-6 text-blue-400 mr-2" />
                  Thông tin mạng
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Nhà mạng (ISP):</span>
                    <span className="text-white font-medium text-right">{ipInfo.isp}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">Tổ chức:</span>
                    <span className="text-white font-medium text-right">{ipInfo.org}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">AS Number:</span>
                    <span className="text-white font-medium text-right">{ipInfo.as}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 text-blue-400 mr-2" />
                Vị trí trên bản đồ
              </h2>
              <div className="map-container">
                <IPMap 
                  lat={ipInfo.lat} 
                  lon={ipInfo.lon} 
                  city={ipInfo.city}
                  country={ipInfo.country}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
