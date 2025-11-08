'use client';

import { useState } from 'react';
import { Shield, Loader2, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { PortScanResult } from '@/types';
import { ipApi } from '@/utils/api';
import { savePortScanHistory } from '@/utils/historyManager';

export default function PortScannerTool() {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [results, setResults] = useState<PortScanResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host.trim() || !port.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await ipApi.scanPort(host.trim(), parseInt(port));
      setResults(prev => [result, ...prev.slice(0, 9)]);

      // Lưu vào lịch sử
      savePortScanHistory(host.trim(), parseInt(port), result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi quét port');
    } finally {
      setLoading(false);
    }
  };

  const scanCommonPorts = async () => {
    if (!host.trim()) return;
    
    const commonPorts = [80, 443, 22, 21, 25, 53, 110, 143, 993, 995];
    setResults([]);
    setError(null);
    
    for (const portNum of commonPorts) {
      try {
        const result = await ipApi.scanPort(host.trim(), portNum);
        setResults(prev => [...prev, result]);
      } catch (err) {
        // Continue with next port
      }
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-2">
                Host hoặc IP Address
              </label>
              <input
                id="host"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="Ví dụ: google.com hoặc 8.8.8.8"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="port" className="block text-sm font-medium text-gray-300 mb-2">
                Port
              </label>
              <input
                id="port"
                type="number"
                min="1"
                max="65535"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="80"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading || !host.trim() || !port.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              <span>{loading ? 'Đang quét...' : 'Quét Port'}</span>
            </button>

            <button
              type="button"
              onClick={scanCommonPorts}
              disabled={loading || !host.trim()}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              Quét ports phổ biến
            </button>

            {results.length > 0 && (
              <button
                type="button"
                onClick={clearResults}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors ml-auto"
              >
                Xóa kết quả
              </button>
            )}
          </div>

          {/* Common Ports */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Ports phổ biến:</span>
            {[80, 443, 22, 21, 25, 53, 3389].map((commonPort) => (
              <button
                key={commonPort}
                type="button"
                onClick={() => setPort(commonPort.toString())}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors"
                disabled={loading}
              >
                {commonPort}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/50 backdrop-blur-sm rounded-2xl p-4 border border-red-700">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 text-purple-400 mr-2" />
            Kết quả quét Port
          </h3>
          
          <div className="space-y-3">
            {results.map((result, index) => {
              const StatusIcon = result.open ? CheckCircle : XCircle;
              const statusColor = result.open ? 'text-green-400' : 'text-red-400';
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                    <div>
                      <p className="text-white font-medium">
                        {result.host}:{result.port}
                      </p>
                      <p className="text-sm text-gray-400">
                        {result.open ? 
                          `${result.service || 'Unknown service'} - Port mở` : 
                          (result.error || 'Port đóng')
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {result.open && (result as any).responseTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-green-400">
                          {(result as any).responseTime}ms
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          {results.length > 1 && (
            <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
              <h4 className="text-lg font-semibold text-white mb-3">Thống kê</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {results.filter(r => r.open).length}
                  </p>
                  <p className="text-sm text-gray-400">Ports mở</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {results.filter(r => !r.open).length}
                  </p>
                  <p className="text-sm text-gray-400">Ports đóng</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {results.length}
                  </p>
                  <p className="text-sm text-gray-400">Tổng quét</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-200">
            <p className="font-medium mb-1">Lưu ý về Port Scanner:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-300">
              <li>Chỉ sử dụng để kiểm tra hệ thống của bạn hoặc có sự cho phép</li>
              <li>Port mở không có nghĩa là dịch vụ đang hoạt động bình thường</li>
              <li>Firewall có thể chặn hoặc làm chậm quá trình quét</li>
              <li>Quét nhiều port có thể mất thời gian và tạo traffic mạng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
