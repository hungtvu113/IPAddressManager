'use client';

import { useState } from 'react';
import { GitCompare, Filter, Info } from 'lucide-react';
import { ipComparisonData } from '@/utils/ipCalculator';
import type { IPComparison } from '@/utils/ipCalculator';

type CategoryFilter = 'all' | 'basic' | 'technical' | 'security' | 'performance';

export default function IPComparisonTool() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  const categories = [
    { id: 'all' as CategoryFilter, name: 'Tất cả', color: 'bg-gray-600' },
    { id: 'basic' as CategoryFilter, name: 'Cơ bản', color: 'bg-blue-600' },
    { id: 'technical' as CategoryFilter, name: 'Kỹ thuật', color: 'bg-purple-600' },
    { id: 'security' as CategoryFilter, name: 'Bảo mật', color: 'bg-red-600' },
    { id: 'performance' as CategoryFilter, name: 'Hiệu năng', color: 'bg-green-600' }
  ];

  const filteredData = selectedCategory === 'all' 
    ? ipComparisonData 
    : ipComparisonData.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'bg-blue-600/20 border-blue-500 text-blue-300';
      case 'technical': return 'bg-purple-600/20 border-purple-500 text-purple-300';
      case 'security': return 'bg-red-600/20 border-red-500 text-red-300';
      case 'performance': return 'bg-green-600/20 border-green-500 text-green-300';
      default: return 'bg-gray-600/20 border-gray-500 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <GitCompare className="w-6 h-6 text-blue-400 mr-2" />
            So sánh IPv4 và IPv6
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm">Lọc theo:</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-700/50 border-b border-gray-600">
          <div className="text-gray-300 font-semibold">Tính năng</div>
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-white font-bold">
              IPv4
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-green-600 rounded-lg text-white font-bold">
              IPv6
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{item.feature}</span>
                <span className={`px-2 py-1 rounded text-xs border ${getCategoryColor(item.category)}`}>
                  {categories.find(c => c.id === item.category)?.name}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center p-3 bg-blue-600/10 rounded-lg border border-blue-500/30 w-full">
                  <p className="text-gray-200 text-sm">{item.ipv4}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center p-3 bg-green-600/10 rounded-lg border border-green-500/30 w-full">
                  <p className="text-gray-200 text-sm">{item.ipv6}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IPv4 Summary */}
        <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/50">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            IPv4 - Ưu điểm
          </h4>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✓</span>
              <span>Được hỗ trợ rộng rãi trên toàn cầu</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✓</span>
              <span>Đơn giản, dễ nhớ và dễ cấu hình</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✓</span>
              <span>Tài liệu và công cụ phong phú</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✓</span>
              <span>NAT giúp tiết kiệm địa chỉ IP</span>
            </li>
          </ul>

          <h4 className="text-xl font-bold text-white mb-4 mt-6 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            IPv4 - Nhược điểm
          </h4>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Cạn kiệt địa chỉ IP (~4.3 tỷ)</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Bảo mật không được tích hợp sẵn</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Header phức tạp, kích thước thay đổi</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Phụ thuộc vào NAT gây phức tạp</span>
            </li>
          </ul>
        </div>

        {/* IPv6 Summary */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-700/50">
          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            IPv6 - Ưu điểm
          </h4>
          <ul className="space-y-2 text-green-200">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Không gian địa chỉ khổng lồ (2¹²⁸)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>IPSec tích hợp sẵn (bảo mật tốt hơn)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Header đơn giản, kích thước cố định</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Auto-configuration (SLAAC)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Không cần NAT, end-to-end connectivity</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>Hỗ trợ QoS và mobility tốt hơn</span>
            </li>
          </ul>

          <h4 className="text-xl font-bold text-white mb-4 mt-6 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            IPv6 - Nhược điểm
          </h4>
          <ul className="space-y-2 text-green-200">
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Chưa được triển khai rộng rãi</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Địa chỉ dài, khó nhớ</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Cần đào tạo và học tập mới</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>Thiết bị cũ có thể không hỗ trợ</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Migration Info */}
      <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 text-blue-400 mr-2" />
          Quá trình chuyển đổi từ IPv4 sang IPv6
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h5 className="font-semibold text-blue-400 mb-2">1. Dual Stack</h5>
            <p className="text-gray-300 text-sm">
              Chạy cả IPv4 và IPv6 đồng thời trên cùng một thiết bị. 
              Đây là phương pháp phổ biến nhất hiện nay.
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h5 className="font-semibold text-green-400 mb-2">2. Tunneling</h5>
            <p className="text-gray-300 text-sm">
              Đóng gói IPv6 packets trong IPv4 để truyền qua mạng IPv4. 
              Ví dụ: 6to4, Teredo, ISATAP.
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h5 className="font-semibold text-purple-400 mb-2">3. Translation</h5>
            <p className="text-gray-300 text-sm">
              Chuyển đổi giữa IPv4 và IPv6 packets. 
              Ví dụ: NAT64, DNS64 cho phép IPv6-only clients truy cập IPv4 servers.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h4 className="text-xl font-bold text-white mb-4">Thống kê triển khai IPv6 toàn cầu</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-600/20 rounded-lg border border-blue-500">
            <p className="text-3xl font-bold text-blue-400">~40%</p>
            <p className="text-gray-300 text-sm mt-2">Google users qua IPv6</p>
          </div>
          <div className="text-center p-4 bg-green-600/20 rounded-lg border border-green-500">
            <p className="text-3xl font-bold text-green-400">~50%</p>
            <p className="text-gray-300 text-sm mt-2">Mạng AS hỗ trợ IPv6</p>
          </div>
          <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500">
            <p className="text-3xl font-bold text-purple-400">100%</p>
            <p className="text-gray-300 text-sm mt-2">Top websites hỗ trợ IPv6</p>
          </div>
          <div className="text-center p-4 bg-orange-600/20 rounded-lg border border-orange-500">
            <p className="text-3xl font-bold text-orange-400">2025+</p>
            <p className="text-gray-300 text-sm mt-2">Dự kiến IPv6 phổ biến</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-700/50">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>IPv6 không tương thích ngược với IPv4</li>
              <li>Cần sử dụng dual-stack hoặc translation mechanisms</li>
              <li>IPv6 là tương lai của Internet, nên bắt đầu học và triển khai</li>
              <li>Nhiều ISP và cloud providers đã hỗ trợ IPv6</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

