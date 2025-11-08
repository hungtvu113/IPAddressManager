'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Loader2, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { isValidIPv4, isValidIPv6, ipv4ToInt, compressIPv6, expandIPv6 } from '@/utils/ipCalculator';
import { copyToClipboard } from '@/utils/api';
import { saveValidationHistory } from '@/utils/historyManager';

interface ValidationResult {
  ip: string;
  isValid: boolean;
  version: 'IPv4' | 'IPv6' | 'Invalid';
  type?: string;
  details?: {
    binary?: string;
    decimal?: string;
    hexadecimal?: string;
    compressed?: string;
    expanded?: string;
  };
}

export default function IPValidatorTool() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const ip = input.trim();
      let validationResult: ValidationResult;

      if (isValidIPv4(ip)) {
        // IPv4 validation
        const ipInt = ipv4ToInt(ip);
        const parts = ip.split('.').map(Number);
        
        // Determine type
        let type = 'Public';
        if (ip.startsWith('10.') || ip.startsWith('192.168.') || 
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)) {
          type = 'Private';
        } else if (ip.startsWith('127.')) {
          type = 'Loopback';
        } else if (ip.startsWith('169.254.')) {
          type = 'Link-Local';
        } else if (parts[0] >= 224 && parts[0] <= 239) {
          type = 'Multicast';
        }

        validationResult = {
          ip,
          isValid: true,
          version: 'IPv4',
          type,
          details: {
            binary: parts.map(n => n.toString(2).padStart(8, '0')).join('.'),
            decimal: ipInt.toString(),
            hexadecimal: '0x' + parts.map(n => n.toString(16).padStart(2, '0').toUpperCase()).join('')
          }
        };
      } else if (isValidIPv6(ip)) {
        // IPv6 validation
        const expanded = expandIPv6(ip);
        const compressed = compressIPv6(ip);
        
        // Determine type
        let type = 'Public';
        if (ip.startsWith('fe80:')) {
          type = 'Link-Local';
        } else if (ip.startsWith('::1') || ip === '::1') {
          type = 'Loopback';
        } else if (ip.startsWith('fc') || ip.startsWith('fd')) {
          type = 'Private (ULA)';
        } else if (ip.startsWith('ff')) {
          type = 'Multicast';
        }

        validationResult = {
          ip,
          isValid: true,
          version: 'IPv6',
          type,
          details: {
            expanded,
            compressed,
            hexadecimal: expanded.replace(/:/g, '')
          }
        };
      } else {
        validationResult = {
          ip,
          isValid: false,
          version: 'Invalid'
        };
      }

      setResult(validationResult);

      // Lưu vào lịch sử nếu valid
      if (validationResult.isValid) {
        saveValidationHistory(ip, validationResult);
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
    setInput('');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label htmlFor="ip-input" className="block text-sm font-medium text-gray-300 mb-2">
              Địa chỉ IP cần kiểm tra
            </label>
            <div className="flex space-x-4">
              <input
                id="ip-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ví dụ: 192.168.1.1 hoặc 2001:db8::1"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span>{loading ? 'Đang kiểm tra...' : 'Kiểm tra'}</span>
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400">Ví dụ:</span>
            {[
              '192.168.1.1',
              '8.8.8.8',
              '2001:4860:4860::8888',
              'fe80::1',
              '::1'
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setInput(example)}
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

      {/* Results */}
      {result && (
        <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border ${
          result.isValid ? 'border-green-700' : 'border-red-700'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              {result.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 mr-2" />
              )}
              Kết quả kiểm tra
            </h3>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              result.isValid 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {result.version}
            </span>
          </div>

          {result.isValid ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Địa chỉ IP</p>
                  <div className="flex items-center justify-between">
                    <p className="text-white font-mono text-lg">{result.ip}</p>
                    <button
                      onClick={() => handleCopy(result.ip)}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      {copiedValue === result.ip ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <p className="text-gray-400 text-sm mb-1">Loại IP</p>
                  <p className="text-white font-medium">{result.type}</p>
                </div>
              </div>

              {/* Details */}
              {result.details && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Chi tiết kỹ thuật</h4>
                  
                  {result.details.binary && (
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Binary (Nhị phân)</p>
                        <button
                          onClick={() => handleCopy(result.details!.binary!)}
                          className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                          {copiedValue === result.details.binary ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-300" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-sm break-all">{result.details.binary}</p>
                    </div>
                  )}

                  {result.details.decimal && (
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Decimal (Thập phân)</p>
                        <button
                          onClick={() => handleCopy(result.details!.decimal!)}
                          className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                          {copiedValue === result.details.decimal ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-300" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono">{result.details.decimal}</p>
                    </div>
                  )}

                  {result.details.hexadecimal && (
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Hexadecimal (Thập lục phân)</p>
                        <button
                          onClick={() => handleCopy(result.details!.hexadecimal!)}
                          className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                          {copiedValue === result.details.hexadecimal ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-300" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono">{result.details.hexadecimal}</p>
                    </div>
                  )}

                  {result.details.expanded && (
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Expanded (Đầy đủ)</p>
                        <button
                          onClick={() => handleCopy(result.details!.expanded!)}
                          className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                          {copiedValue === result.details.expanded ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-300" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono text-sm break-all">{result.details.expanded}</p>
                    </div>
                  )}

                  {result.details.compressed && (
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Compressed (Rút gọn)</p>
                        <button
                          onClick={() => handleCopy(result.details!.compressed!)}
                          className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                        >
                          {copiedValue === result.details.compressed ? (
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-300" />
                          )}
                        </button>
                      </div>
                      <p className="text-white font-mono">{result.details.compressed}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-200 text-lg mb-2">Địa chỉ IP không hợp lệ</p>
              <p className="text-gray-400 text-sm">
                Vui lòng nhập địa chỉ IPv4 hoặc IPv6 hợp lệ
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/50">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Về IP Validator:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>Hỗ trợ kiểm tra cả IPv4 và IPv6</li>
              <li>Hiển thị dạng binary, decimal, hexadecimal</li>
              <li>IPv6 hỗ trợ cả dạng đầy đủ và rút gọn</li>
              <li>Phân loại IP: Public, Private, Loopback, Link-Local, Multicast</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

