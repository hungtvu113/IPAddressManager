'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Globe, 
  Wifi, 
  Clock, 
  Copy, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { IPInfo } from '@/types';
import { ipApi, copyToClipboard } from '@/utils/api';
import dynamic from 'next/dynamic';

const IPMap = dynamic(() => import('./maps/IPMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-900 rounded-lg flex items-center justify-center">
    <p className="text-gray-400">Đang tải bản đồ...</p>
  </div>
});

export default function MyIPPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        setLoading(true);
        const data = await ipApi.getCurrentIP();
        setIpInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };

    fetchIPInfo();
  }, []);

  const handleCopyIP = async () => {
    if (ipInfo?.ip) {
      const success = await copyToClipboard(ipInfo.ip);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Đang tải thông tin IP của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!ipInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            IP của tôi
          </h1>
          <p className="text-gray-400 text-lg">
            Thông tin chi tiết về địa chỉ IP công khai của bạn
          </p>
        </div>

        {/* Main IP Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Địa chỉ IP công khai của bạn</h2>
            <p className="text-gray-400 text-sm">IP này được nhìn thấy bởi các website và dịch vụ trên Internet</p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            {/* IPv4 Display */}
            {ipInfo.ip ? (
              <div className="w-full max-w-3xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    <span className="text-lg font-semibold text-blue-300">IPv4 Address</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    Public
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl md:text-5xl font-mono font-bold text-white">
                    {ipInfo.ip}
                  </span>
                  <button
                    onClick={handleCopyIP}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                    title="Sao chép IPv4"
                  >
                    {copied ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Copy className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm animate-pulse mt-2">
                    ✓ Đã sao chép IPv4 vào clipboard!
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full max-w-3xl bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Đang tải địa chỉ IP...</p>
                </div>
              </div>
            )}

            {/* IPv6 Info */}
            <div className="w-full max-w-3xl bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-green-400" />
                  <span className="text-lg font-semibold text-green-300">IPv6 Address</span>
                </div>
                <span className="px-3 py-1 bg-gray-600 text-gray-300 text-xs font-medium rounded-full">
                  Not Available
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                <p className="mb-2">
                  <strong className="text-gray-300">Lưu ý:</strong> API hiện tại chỉ trả về IPv4.
                  Để xem IPv6 của bạn, bạn có thể:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Truy cập <a href="https://test-ipv6.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">test-ipv6.com</a></li>
                  <li>Truy cập <a href="https://ipv6-test.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">ipv6-test.com</a></li>
                  <li>Sử dụng lệnh: <code className="bg-gray-700 px-2 py-1 rounded text-green-300">curl -6 ifconfig.co</code></li>
                </ul>
              </div>
            </div>
          </div>

          {/* IP Version Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Về IPv4
              </h3>
              <p className="text-gray-300 text-sm">
                IPv4 sử dụng 32-bit, cho phép ~4.3 tỷ địa chỉ.
                Đây là phiên bản IP phổ biến nhất hiện nay.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Về IPv6
              </h3>
              <p className="text-gray-300 text-sm">
                IPv6 sử dụng 128-bit, cho phép ~340 undecillion địa chỉ.
                Đây là tương lai của Internet.
              </p>
            </div>
          </div>
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
                <span className="text-gray-400">Địa chỉ IP:</span>
                <span className="text-white font-medium font-mono text-right">{ipInfo.ip || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Phiên bản IP:</span>
                <span className="text-white font-medium text-right">
                  <span className="px-2 py-1 bg-blue-600 rounded text-sm">IPv4</span>
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Nhà mạng (ISP):</span>
                <span className="text-white font-medium text-right">{ipInfo.isp || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Tổ chức:</span>
                <span className="text-white font-medium text-right">{ipInfo.org || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">AS Number:</span>
                <span className="text-white font-medium text-right">{ipInfo.as || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Loại IP:</span>
                <span className="text-white font-medium text-right">
                  <span className="px-2 py-1 bg-green-600 rounded text-sm">Public</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        {ipInfo.ip && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Globe className="w-6 h-6 text-blue-400 mr-2" />
              Chi tiết kỹ thuật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Binary (Nhị phân)</p>
                <p className="text-white font-mono text-xs break-all">
                  {ipInfo.ip.split('.').map(octet =>
                    parseInt(octet).toString(2).padStart(8, '0')
                  ).join('.')}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Decimal (Thập phân)</p>
                <p className="text-white font-mono text-sm">
                  {ipInfo.ip.split('.').map(octet => parseInt(octet)).reduce((acc, val, i) =>
                    acc + (val << (8 * (3 - i))), 0
                  ) >>> 0}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Hexadecimal (Thập lục phân)</p>
                <p className="text-white font-mono text-sm">
                  0x{ipInfo.ip.split('.').map(octet =>
                    parseInt(octet).toString(16).padStart(2, '0').toUpperCase()
                  ).join('')}
                </p>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </div>
  );
}
