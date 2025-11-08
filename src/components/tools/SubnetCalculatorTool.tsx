'use client';

import { useState } from 'react';
import { Calculator, Loader2, AlertCircle, Copy, CheckCircle } from 'lucide-react';
import { analyzeSubnet, isValidCIDR } from '@/utils/ipCalculator';
import { copyToClipboard } from '@/utils/api';
import { saveSubnetHistory } from '@/utils/historyManager';
import type { SubnetInfo } from '@/utils/ipCalculator';

export default function SubnetCalculatorTool() {
  const [cidr, setCidr] = useState('');
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cidr.trim()) return;

    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (!isValidCIDR(cidr.trim())) {
        setError('CIDR notation không hợp lệ. Ví dụ: 192.168.1.0/24');
        setResult(null);
        setLoading(false);
        return;
      }

      const analysis = analyzeSubnet(cidr.trim());
      if (analysis) {
        setResult(analysis);
        setError(null);

        // Lưu vào lịch sử
        saveSubnetHistory(cidr.trim(), analysis);
      } else {
        setError('Không thể phân tích subnet. Vui lòng kiểm tra lại CIDR.');
        setResult(null);
      }
      setLoading(false);
    }, 300);
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
    setCidr('');
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label htmlFor="cidr-input" className="block text-sm font-medium text-gray-300 mb-2">
              CIDR Notation (IP/Prefix)
            </label>
            <div className="flex space-x-4">
              <input
                id="cidr-input"
                type="text"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                placeholder="Ví dụ: 192.168.1.0/24"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !cidr.trim()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Calculator className="w-5 h-5" />
                )}
                <span>{loading ? 'Đang tính...' : 'Tính toán'}</span>
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Ví dụ:</span>
            {[
              '192.168.1.0/24',
              '10.0.0.0/8',
              '172.16.0.0/12',
              '192.168.0.0/16',
              '8.8.8.0/24'
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setCidr(example)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors"
                disabled={loading}
              >
                {example}
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
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calculator className="w-6 h-6 text-purple-400 mr-2" />
            Kết quả phân tích Subnet
          </h3>

          <div className="space-y-6">
            {/* Network Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Thông tin mạng</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="CIDR Notation"
                  value={result.cidr}
                  onCopy={handleCopy}
                  copied={copiedValue === result.cidr}
                />
                <InfoCard
                  label="Network Address"
                  value={result.networkAddress}
                  onCopy={handleCopy}
                  copied={copiedValue === result.networkAddress}
                />
                <InfoCard
                  label="Broadcast Address"
                  value={result.broadcastAddress}
                  onCopy={handleCopy}
                  copied={copiedValue === result.broadcastAddress}
                />
                <InfoCard
                  label="Subnet Mask"
                  value={result.subnetMask}
                  onCopy={handleCopy}
                  copied={copiedValue === result.subnetMask}
                />
                <InfoCard
                  label="Wildcard Mask"
                  value={result.wildcardMask}
                  onCopy={handleCopy}
                  copied={copiedValue === result.wildcardMask}
                />
                <InfoCard
                  label="IP Class"
                  value={result.ipClass}
                />
              </div>
            </div>

            {/* Host Range */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Dải địa chỉ Host</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  label="First Host"
                  value={result.firstHost}
                  onCopy={handleCopy}
                  copied={copiedValue === result.firstHost}
                />
                <InfoCard
                  label="Last Host"
                  value={result.lastHost}
                  onCopy={handleCopy}
                  copied={copiedValue === result.lastHost}
                />
              </div>
            </div>

            {/* Statistics */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Thống kê</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500">
                  <p className="text-purple-300 text-sm mb-1">Total Hosts</p>
                  <p className="text-white text-2xl font-bold">{formatNumber(result.totalHosts)}</p>
                </div>
                <div className="p-4 bg-green-600/20 rounded-lg border border-green-500">
                  <p className="text-green-300 text-sm mb-1">Usable Hosts</p>
                  <p className="text-white text-2xl font-bold">{formatNumber(result.usableHosts)}</p>
                </div>
                <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-500">
                  <p className="text-blue-300 text-sm mb-1">IP Type</p>
                  <p className="text-white text-xl font-bold">{result.ipType}</p>
                </div>
              </div>
            </div>

            {/* Binary Representation */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Binary Subnet Mask</h4>
              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Binary</p>
                  <button
                    onClick={() => handleCopy(result.binarySubnetMask)}
                    className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                  >
                    {copiedValue === result.binarySubnetMask ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-300" />
                    )}
                  </button>
                </div>
                <p className="text-white font-mono text-sm break-all">{result.binarySubnetMask}</p>
              </div>
            </div>

            {/* Visual Representation */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Biểu đồ phân bổ</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-300 text-sm">Network Address: {result.networkAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-300 text-sm">
                    Usable Hosts: {result.firstHost} - {result.lastHost} ({formatNumber(result.usableHosts)} hosts)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-300 text-sm">Broadcast Address: {result.broadcastAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-200">
            <p className="font-medium mb-1">Về Subnet Calculator:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-300">
              <li>CIDR notation: IP/Prefix (ví dụ: 192.168.1.0/24)</li>
              <li>Prefix /24 = 256 địa chỉ (254 usable hosts)</li>
              <li>Network address: Địa chỉ đầu tiên của subnet</li>
              <li>Broadcast address: Địa chỉ cuối cùng của subnet</li>
              <li>Usable hosts = Total hosts - 2 (trừ network và broadcast)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for info cards
function InfoCard({ 
  label, 
  value, 
  onCopy, 
  copied 
}: { 
  label: string; 
  value: string; 
  onCopy?: (value: string) => void;
  copied?: boolean;
}) {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm">{label}</p>
        {onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
          >
            {copied ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3 text-gray-300" />
            )}
          </button>
        )}
      </div>
      <p className="text-white font-mono">{value}</p>
    </div>
  );
}

