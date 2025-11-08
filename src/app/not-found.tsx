'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search, Network } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold gradient-text mb-4">
            404
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trang không tìm thấy
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Về trang chủ</span>
          </Link>
          <Link
            href="/tra-cuu-ip"
            className="flex items-center justify-center space-x-3 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Tra cứu IP</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-center">
            <Network className="w-5 h-5 text-blue-400 mr-2" />
            Các trang phổ biến
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/cong-cu-mang"
              className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors text-center"
            >
              Công cụ mạng
            </Link>
            <Link
              href="/kien-thuc"
              className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors text-center"
            >
              Kiến thức
            </Link>
            <Link
              href="/huong-dan-2d"
              className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors text-center"
            >
              Hướng dẫn 2D
            </Link>
            <Link
              href="/huong-dan-3d"
              className="p-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors text-center"
            >
              Hướng dẫn 3D
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang trước</span>
        </button>
      </div>
    </div>
  );
}
