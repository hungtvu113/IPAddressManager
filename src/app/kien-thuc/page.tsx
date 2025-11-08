'use client';

import { useState } from 'react';
import {
  BookOpen,
  Network,
  Shield,
  Code,
  Globe,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Monitor,
  Box
} from 'lucide-react';

const knowledgeSections = [
  {
    id: 'intro',
    title: 'Giới thiệu IP Programming',
    icon: BookOpen,
    color: 'bg-blue-600',
    content: {
      overview: 'IP Programming là lĩnh vực lập trình mạng sử dụng giao thức Internet Protocol (IP) để tạo ra các ứng dụng có thể giao tiếp qua mạng.',
      topics: [
        'Khái niệm cơ bản về IP và mạng máy tính',
        'Socket Programming và API mạng',
        'Client-Server Architecture',
        'Các giao thức mạng phổ biến (TCP, UDP, HTTP)',
        'Ứng dụng thực tế trong phát triển phần mềm'
      ]
    }
  },
  {
    id: 'tcp-ip',
    title: 'Mô hình TCP/IP',
    icon: Layers,
    color: 'bg-green-600',
    content: {
      overview: 'TCP/IP là bộ giao thức mạng chuẩn được sử dụng trên Internet và hầu hết các mạng máy tính hiện đại.',
      topics: [
        'Application Layer (HTTP, FTP, SMTP, DNS)',
        'Transport Layer (TCP, UDP)',
        'Internet Layer (IP, ICMP, ARP)',
        'Network Access Layer (Ethernet, WiFi)',
        'Quá trình đóng gói và mở gói dữ liệu'
      ]
    }
  },
  {
    id: 'ipv4-vs-ipv6',
    title: 'IPv4 vs IPv6',
    icon: Globe,
    color: 'bg-purple-600',
    content: {
      overview: 'So sánh hai phiên bản chính của giao thức Internet Protocol và xu hướng chuyển đổi.',
      topics: [
        'Cấu trúc và định dạng địa chỉ IPv4 (32-bit)',
        'Cấu trúc và định dạng địa chỉ IPv6 (128-bit)',
        'Vấn đề cạn kiệt địa chỉ IPv4',
        'Ưu điểm của IPv6: không gian địa chỉ lớn, bảo mật tốt hơn',
        'Quá trình chuyển đổi và dual-stack implementation'
      ]
    }
  },
  {
    id: 'socket-programming',
    title: 'Socket Programming',
    icon: Code,
    color: 'bg-orange-600',
    content: {
      overview: 'Socket là interface lập trình cho phép các ứng dụng giao tiếp qua mạng.',
      topics: [
        'Khái niệm Socket và các loại Socket',
        'TCP Socket: socket(), bind(), listen(), accept(), connect()',
        'UDP Socket: sendto(), recvfrom()',
        'Blocking vs Non-blocking I/O',
        'Multiplexing với select(), poll(), epoll()'
      ]
    }
  },
  {
    id: 'security',
    title: 'Bảo mật trong IP Programming',
    icon: Shield,
    color: 'bg-red-600',
    content: {
      overview: 'Các vấn đề bảo mật cần quan tâm khi phát triển ứng dụng mạng.',
      topics: [
        'Mã hóa dữ liệu với TLS/SSL',
        'Xác thực và phân quyền',
        'Tấn công DDoS và cách phòng chống',
        'Firewall và Network Security',
        'Best practices trong secure coding'
      ]
    }
  },
  {
    id: 'applications',
    title: 'Ứng dụng thực tế',
    icon: Network,
    color: 'bg-indigo-600',
    content: {
      overview: 'Các ứng dụng thực tế của IP Programming trong cuộc sống và công nghiệp.',
      topics: [
        'Web Servers và Web Applications',
        'Chat Applications và Real-time Communication',
        'File Transfer và P2P Networks',
        'IoT và Embedded Systems',
        'Cloud Computing và Microservices'
      ]
    }
  }
];

export default function KnowledgePage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('intro');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Kiến thức IP Programming
          </h1>
          <p className="text-gray-400 text-lg">
            Tìm hiểu lý thuyết và kiến thức nền tảng về lập trình mạng
          </p>
        </div>

        {/* Knowledge Sections */}
        <div className="space-y-6">
          {knowledgeSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <div
                key={section.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 ${section.color} rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-bold text-white">{section.title}</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        {section.content.overview}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Nội dung chính:
                      </h3>
                      <div className="space-y-3">
                        {section.content.topics.map((topic, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg"
                          >
                            <ArrowRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-300">{topic}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Learning Path */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Lộ trình học tập được đề xuất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cơ bản</h3>
              <p className="text-gray-300 text-sm">
                Học về IP, TCP/IP, và các khái niệm mạng cơ bản
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Thực hành</h3>
              <p className="text-gray-300 text-sm">
                Thực hành Socket Programming và xây dựng ứng dụng đơn giản
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Nâng cao</h3>
              <p className="text-gray-300 text-sm">
                Tìm hiểu về bảo mật, performance và ứng dụng thực tế
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Sẵn sàng thực hành? Hãy thử các hướng dẫn tương tác của chúng tôi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/huong-dan-2d"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Monitor className="w-5 h-5" />
              <span>Hướng dẫn 2D</span>
            </a>
            <a
              href="/huong-dan-3d"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Box className="w-5 h-5" />
              <span>Hướng dẫn 3D</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
