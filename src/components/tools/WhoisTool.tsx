'use client';

import { useState } from 'react';
import { Globe, Loader2, AlertCircle, Calendar, Server, Copy, CheckCircle } from 'lucide-react';
import { WhoisResult } from '@/types';
import { ipApi, copyToClipboard } from '@/utils/api';
import { saveWhoisHistory } from '@/utils/historyManager';

export default function WhoisTool() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<WhoisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await ipApi.whoisLookup(domain.trim());
      setResult(data);

      // Lưu vào lịch sử
      saveWhoisHistory(domain.trim(), data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tra cứu WHOIS');
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
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
                <span>{loading ? 'Đang tra cứu...' : 'Tra cứu WHOIS'}</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Thử nhanh:</span>
            {['google.com', 'microsoft.com', 'apple.com', 'amazon.com'].map((quickDomain) => (
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
            <Globe className="w-5 h-5 text-orange-400 mr-2" />
            WHOIS thông tin cho {result.domain}
          </h3>

          {result.error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <p className="text-orange-200 mb-2">{result.error}</p>
              {result.message && (
                <p className="text-gray-400 text-sm">{result.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.registrar && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Server className="w-5 h-5 text-orange-400 mr-2" />
                      Registrar
                    </h4>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                      <span className="text-gray-300">{result.registrar}</span>
                      <button
                        onClick={() => handleCopy(result.registrar!)}
                        className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        {copiedValue === result.registrar ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {(result.registrationDate || result.expirationDate) && (
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Calendar className="w-5 h-5 text-orange-400 mr-2" />
                      Ngày tháng
                    </h4>
                    <div className="space-y-2">
                      {result.registrationDate && (
                        <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <span className="text-gray-400">Ngày đăng ký:</span>
                          <span className="text-white">{result.registrationDate}</span>
                        </div>
                      )}
                      {result.expirationDate && (
                        <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <span className="text-gray-400">Ngày hết hạn:</span>
                          <span className="text-white">{result.expirationDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Name Servers */}
              {result.nameServers && result.nameServers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <Server className="w-5 h-5 text-orange-400 mr-2" />
                    Name Servers
                  </h4>
                  <div className="space-y-2">
                    {result.nameServers.map((ns, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                      >
                        <span className="text-white font-mono text-sm">{ns}</span>
                        <button
                          onClick={() => handleCopy(ns)}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                        >
                          {copiedValue === ns ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              {result.status && result.status.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Domain Status</h4>
                  <div className="space-y-2">
                    {result.status.map((status, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                      >
                        <span className="text-white text-sm">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw Output */}
              {(result as any).rawOutput && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Raw WHOIS Output</h4>
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-600 max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                      {(result as any).rawOutput}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-orange-900/30 backdrop-blur-sm rounded-2xl p-4 border border-orange-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-200">
            <p className="font-medium mb-1">Về WHOIS Lookup:</p>
            <ul className="list-disc list-inside space-y-1 text-orange-300">
              <li>WHOIS cung cấp thông tin đăng ký domain công khai</li>
              <li>Một số domain có thể ẩn thông tin cá nhân (WHOIS Privacy)</li>
              <li>Thông tin có thể khác nhau tùy theo registrar và TLD</li>
              <li>Dữ liệu được cập nhật định kỳ, có thể có độ trễ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
