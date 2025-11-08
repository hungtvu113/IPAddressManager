'use client';

import { useState } from 'react';
import { Search, Loader2, Globe, Database, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { DNSLookupResult } from '@/types';
import { ipApi, copyToClipboard } from '@/utils/api';
import { saveDNSHistory } from '@/utils/historyManager';

export default function DNSLookupTool() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<DNSLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await ipApi.dnsLookup(domain.trim());
      setResult(data);

      // Lưu vào lịch sử
      saveDNSHistory(domain.trim(), data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tra cứu DNS');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  const recordTypeColors: { [key: string]: string } = {
    A: 'bg-green-600',
    AAAA: 'bg-blue-600',
    MX: 'bg-purple-600',
    NS: 'bg-orange-600',
    TXT: 'bg-red-600',
    CNAME: 'bg-yellow-600'
  };

  const recordTypeDescriptions: { [key: string]: string } = {
    A: 'IPv4 Address',
    AAAA: 'IPv6 Address',
    MX: 'Mail Exchange',
    NS: 'Name Server',
    TXT: 'Text Record',
    CNAME: 'Canonical Name'
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
              Tên miền
            </label>
            <div className="flex space-x-4">
              <input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ví dụ: google.com, facebook.com"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{loading ? 'Đang tra cứu...' : 'Tra cứu DNS'}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Thử nhanh:</span>
            {['google.com', 'facebook.com', 'github.com', 'stackoverflow.com'].map((quickDomain) => (
              <button
                key={quickDomain}
                type="button"
                onClick={() => setDomain(quickDomain)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors"
                disabled={loading}
              >
                {quickDomain}
              </button>
            ))}
            {result && (
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
      {result && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Database className="w-5 h-5 text-blue-400 mr-2" />
            DNS Records cho {result.domain}
          </h3>

          {result.error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-200">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(result.records).map(([recordType, records]) => {
                if (!records || records.length === 0) return null;
                
                return (
                  <div key={recordType} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 ${recordTypeColors[recordType] || 'bg-gray-600'} text-white text-sm font-medium rounded-full`}>
                        {recordType}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {recordTypeDescriptions[recordType] || recordType}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {records.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex-1">
                            <p className="text-white font-mono text-sm break-all">
                              {record.value}
                            </p>
                            {(record as any).priority && (
                              <p className="text-gray-400 text-xs mt-1">
                                Priority: {(record as any).priority}

                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleCopy(record.value)}
                            className="ml-3 p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                            title="Sao chép"
                          >
                            {copiedValue === record.value ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {Object.keys(result.records).length === 0 && (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Không tìm thấy DNS records nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Giải thích các loại DNS Records:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li><strong>A Record:</strong> Trỏ domain đến địa chỉ IPv4</li>
              <li><strong>AAAA Record:</strong> Trỏ domain đến địa chỉ IPv6</li>
              <li><strong>MX Record:</strong> Chỉ định mail server cho domain</li>
              <li><strong>NS Record:</strong> Chỉ định name server quản lý domain</li>
              <li><strong>TXT Record:</strong> Chứa thông tin text, thường dùng cho verification</li>
              <li><strong>CNAME Record:</strong> Tạo alias cho domain khác</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
