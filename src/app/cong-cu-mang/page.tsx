'use client';

import { useState } from 'react';
import {
  Wifi,
  Search,
  Shield,
  Globe,
  Activity,
  Database,
  Lock,
  Info,
  CheckCircle,
  Calculator,
  GitCompare,
  History
} from 'lucide-react';
import PingTool from '@/components/tools/PingTool';
import DNSLookupTool from '@/components/tools/DNSLookupTool';
import PortScannerTool from '@/components/tools/PortScannerTool';
import WhoisTool from '@/components/tools/WhoisTool';
import IPValidatorTool from '@/components/tools/IPValidatorTool';
import SubnetCalculatorTool from '@/components/tools/SubnetCalculatorTool';
import IPComparisonTool from '@/components/tools/IPComparisonTool';
import IPHistoryTool from '@/components/tools/IPHistoryTool';

type ToolType = 'ping' | 'dns' | 'port' | 'whois' | 'validator' | 'subnet' | 'comparison' | 'history';

const tools = [
  {
    id: 'ping' as ToolType,
    name: 'Ping Tool',
    description: 'Kiểm tra kết nối mạng và đo độ trễ',
    icon: Activity,
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700'
  },
  {
    id: 'dns' as ToolType,
    name: 'DNS Lookup',
    description: 'Tra cứu DNS records của domain',
    icon: Search,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  },
  {
    id: 'port' as ToolType,
    name: 'Port Scanner',
    description: 'Quét cổng mạng của host',
    icon: Shield,
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700'
  },
  {
    id: 'whois' as ToolType,
    name: 'WHOIS Lookup',
    description: 'Tra cứu thông tin đăng ký domain',
    icon: Globe,
    color: 'bg-orange-600',
    hoverColor: 'hover:bg-orange-700'
  },
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

export default function NetworkToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case 'ping':
        return <PingTool />;
      case 'dns':
        return <DNSLookupTool />;
      case 'port':
        return <PortScannerTool />;
      case 'whois':
        return <WhoisTool />;
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
            Công cụ mạng
          </h1>
          <p className="text-gray-400 text-lg">
            Bộ công cụ mạng tương tác để kiểm tra và phân tích kết nối
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
                  <h3 className="text-xl font-bold text-white mb-3">Hướng dẫn sử dụng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Ping Tool
                      </h4>
                      <p className="text-sm">
                        Kiểm tra kết nối mạng và đo độ trễ đến host.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                        <Search className="w-4 h-4 mr-2" />
                        DNS Lookup
                      </h4>
                      <p className="text-sm">
                        Tra cứu DNS records (A, AAAA, MX, NS, TXT, CNAME).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Port Scanner
                      </h4>
                      <p className="text-sm">
                        Quét cổng mạng để kiểm tra dịch vụ đang chạy.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-400 mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        WHOIS Lookup
                      </h4>
                      <p className="text-sm">
                        Tra cứu thông tin đăng ký domain và registrar.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-400 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        IP Validator
                      </h4>
                      <p className="text-sm">
                        Kiểm tra địa chỉ IPv4/IPv6 hợp lệ và phân tích.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-400 mb-2 flex items-center">
                        <Calculator className="w-4 h-4 mr-2" />
                        Subnet Calculator
                      </h4>
                      <p className="text-sm">
                        Tính toán subnet, CIDR và phân tích mạng.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-400 mb-2 flex items-center">
                        <GitCompare className="w-4 h-4 mr-2" />
                        IPv4 vs IPv6
                      </h4>
                      <p className="text-sm">
                        So sánh chi tiết giữa IPv4 và IPv6.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        Lịch sử
                      </h4>
                      <p className="text-sm">
                        Xem và quản lý lịch sử tra cứu của bạn.
                      </p>
                    </div>
                  </div>
                </div>
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
