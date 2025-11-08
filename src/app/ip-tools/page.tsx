'use client';

import { useState } from 'react';
import { 
  Network,
  CheckCircle,
  Calculator,
  GitCompare,
  History,
  Info
} from 'lucide-react';
import IPValidatorTool from '@/components/tools/IPValidatorTool';
import SubnetCalculatorTool from '@/components/tools/SubnetCalculatorTool';
import IPComparisonTool from '@/components/tools/IPComparisonTool';
import IPHistoryTool from '@/components/tools/IPHistoryTool';

type ToolType = 'validator' | 'subnet' | 'comparison' | 'history';

const tools = [
  {
    id: 'validator' as ToolType,
    name: 'IP Validator',
    description: 'Kiểm tra địa chỉ IP hợp lệ (IPv4/IPv6)',
    icon: CheckCircle,
    color: 'bg-cyan-600',
    hoverColor: 'hover:bg-cyan-700'
  },
  {
    id: 'subnet' as ToolType,
    name: 'Subnet Calculator',
    description: 'Phân tích subnet và CIDR notation',
    icon: Calculator,
    color: 'bg-indigo-600',
    hoverColor: 'hover:bg-indigo-700'
  },
  {
    id: 'comparison' as ToolType,
    name: 'IPv4 vs IPv6',
    description: 'So sánh chi tiết IPv4 và IPv6',
    icon: GitCompare,
    color: 'bg-pink-600',
    hoverColor: 'hover:bg-pink-700'
  },
  {
    id: 'history' as ToolType,
    name: 'Lịch sử',
    description: 'Xem và quản lý lịch sử tra cứu',
    icon: History,
    color: 'bg-yellow-600',
    hoverColor: 'hover:bg-yellow-700'
  }
];

export default function IPToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case 'validator':
        return <IPValidatorTool />;
      case 'subnet':
        return <SubnetCalculatorTool />;
      case 'comparison':
        return <IPComparisonTool />;
      case 'history':
        return <IPHistoryTool />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Công cụ IP nâng cao
          </h1>
          <p className="text-gray-400 text-lg">
            Bộ công cụ phân tích và quản lý địa chỉ IP chuyên nghiệp
          </p>
        </div>

        {/* Tool Selection */}
        {!activeTool && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`
                      ${tool.color} ${tool.hoverColor}
                      p-6 rounded-2xl text-white transition-all duration-300 
                      transform hover:scale-105 hover:shadow-xl
                      border border-gray-700 hover:border-gray-600
                    `}
                  >
                    <Icon className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                    <p className="text-sm opacity-90">{tool.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Info Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Giới thiệu công cụ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        IP Validator
                      </h4>
                      <p className="text-sm">
                        Kiểm tra tính hợp lệ của địa chỉ IPv4 và IPv6. 
                        Hiển thị dạng binary, decimal, hexadecimal và phân loại IP 
                        (Public, Private, Loopback, Link-Local, Multicast).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-400 mb-2 flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Subnet Calculator
                      </h4>
                      <p className="text-sm">
                        Phân tích subnet từ CIDR notation. Tính toán network address, 
                        broadcast address, subnet mask, wildcard mask, dải host và 
                        số lượng hosts có thể sử dụng.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-400 mb-2 flex items-center">
                        <GitCompare className="w-4 h-4 mr-2" />
                        IPv4 vs IPv6
                      </h4>
                      <p className="text-sm">
                        So sánh chi tiết giữa IPv4 và IPv6 về cấu trúc, tính năng, 
                        bảo mật, hiệu năng. Bao gồm thông tin về quá trình chuyển đổi 
                        và thống kê triển khai toàn cầu.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        Lịch sử tra cứu
                      </h4>
                      <p className="text-sm">
                        Lưu trữ và quản lý lịch sử tra cứu. Đánh dấu yêu thích, 
                        lọc theo loại công cụ, tìm kiếm và export dữ liệu. 
                        Tất cả được lưu local trên trình duyệt của bạn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-700/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                  Hỗ trợ IPv6 đầy đủ
                </h4>
                <p className="text-gray-300 text-sm">
                  Tất cả công cụ đều hỗ trợ cả IPv4 và IPv6. 
                  Tự động nhận diện và xử lý cả hai phiên bản IP.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                  Tính toán chính xác
                </h4>
                <p className="text-gray-300 text-sm">
                  Sử dụng thuật toán chuẩn để tính toán subnet, 
                  CIDR và các thông số mạng một cách chính xác.
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 backdrop-blur-sm rounded-2xl p-6 border border-pink-700/50">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                  Giao diện thân thiện
                </h4>
                <p className="text-gray-300 text-sm">
                  UI/UX được thiết kế tối ưu với dark theme, 
                  animations mượt mà và responsive trên mọi thiết bị.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Active Tool */}
        {activeTool && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setActiveTool(null)}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Quay lại danh sách công cụ</span>
            </button>

            {/* Tool Header */}
            <div className="text-center mb-6">
              {(() => {
                const tool = tools.find(t => t.id === activeTool);
                if (!tool) return null;
                const Icon = tool.icon;
                return (
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <h2 className="text-3xl font-bold text-white">{tool.name}</h2>
                  </div>
                );
              })()}
            </div>

            {/* Tool Component */}
            {renderTool()}
          </div>
        )}
      </div>
    </div>
  );
}

