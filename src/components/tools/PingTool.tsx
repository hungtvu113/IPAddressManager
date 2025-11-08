'use client';

import { useState } from 'react';
import { Activity, Loader2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { PingResult } from '@/types';
import { ipApi } from '@/utils/api';
import { savePingHistory } from '@/utils/historyManager';

export default function PingTool() {
  const [host, setHost] = useState('');
  const [results, setResults] = useState<PingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await ipApi.ping(host.trim());
      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results

      // Lưu vào lịch sử
      savePingHistory(host.trim(), result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi ping');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  const getStatusColor = (alive: boolean) => {
    return alive ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (alive: boolean) => {
    return alive ? CheckCircle : XCircle;
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <form onSubmit={handlePing} className="space-y-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-2">
              Host hoặc IP Address
            </label>
            <div className="flex space-x-4">
              <input
                id="host"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="Ví dụ: google.com hoặc 8.8.8.8"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !host.trim()}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Activity className="w-5 h-5" />
                )}
                <span>{loading ? 'Đang ping...' : 'Ping'}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Thử nhanh:</span>
            {['google.com', '8.8.8.8', 'cloudflare.com', '1.1.1.1'].map((quickHost) => (
              <button
                key={quickHost}
                type="button"
                onClick={() => setHost(quickHost)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors"
                disabled={loading}
              >
                {quickHost}
              </button>
            ))}
            {results.length > 0 && (
              <button
                type="button"
                onClick={clearResults}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors ml-auto"
              >
                Xóa kết quả
              </button>
            )}
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
            <Activity className="w-5 h-5 text-green-400 mr-2" />
            Kết quả Ping
          </h3>
          
          <div className="space-y-3">
            {results.map((result, index) => {
              const StatusIcon = getStatusIcon(result.alive);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(result.alive)}`} />
                    <div>
                      <p className="text-white font-medium">{result.host}</p>
                      <p className="text-sm text-gray-400">
                        {result.alive ? 'Kết nối thành công' : (result.error || 'Không thể kết nối')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={`font-mono ${getStatusColor(result.alive)}`}>
                        {result.time.toFixed(1)}ms
                      </span>
                    </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {results.filter(r => r.alive).length}
                  </p>
                  <p className="text-sm text-gray-400">Thành công</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {results.filter(r => !r.alive).length}
                  </p>
                  <p className="text-sm text-gray-400">Thất bại</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {(results.filter(r => r.alive).reduce((sum, r) => sum + r.time, 0) / 
                      results.filter(r => r.alive).length || 0).toFixed(1)}ms
                  </p>
                  <p className="text-sm text-gray-400">Trung bình</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {results.filter(r => r.alive).length > 0 ?
                      Math.min(...results.filter(r => r.alive).map(r => r.time)).toFixed(1) : '0'}ms
                  </p>
                  <p className="text-sm text-gray-400">Nhanh nhất</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Lưu ý về Ping Tool:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>Ping kiểm tra kết nối mạng cơ bản đến host đích</li>
              <li>Thời gian phản hồi thấp (&lt; 50ms) là tốt, cao (&gt; 200ms) có thể chậm</li>
              <li>Một số firewall có thể chặn ping, gây kết quả false negative</li>
              <li>Kết quả có thể khác nhau tùy theo vị trí địa lý và nhà mạng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
