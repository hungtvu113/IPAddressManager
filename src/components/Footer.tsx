import Link from 'next/link';
import { Network, Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">IP Programming</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Ứng dụng học tập IP Programming với hướng dẫn 2D/3D tương tác, 
              công cụ mạng thực tế và kiến thức lý thuyết đầy đủ.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@ipprogramming.com"
                className="text-gray-400 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tính năng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  IP của tôi
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu-ip" className="text-gray-400 hover:text-white transition-colors">
                  Tra cứu IP
                </Link>
              </li>
              <li>
                <Link href="/cong-cu-mang" className="text-gray-400 hover:text-white transition-colors">
                  Công cụ mạng
                </Link>
              </li>
              <li>
                <Link href="/kien-thuc" className="text-gray-400 hover:text-white transition-colors">
                  Kiến thức
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h3 className="text-white font-semibold mb-4">Học tập</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/huong-dan-2d" className="text-gray-400 hover:text-white transition-colors">
                  Hướng dẫn 2D
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-3d" className="text-gray-400 hover:text-white transition-colors">
                  Hướng dẫn 3D
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Bài tập thực hành
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Tài liệu tham khảo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 IP Programming. Được phát triển với{' '}
            <Heart className="w-4 h-4 inline text-red-500" />{' '}
            cho cộng đồng lập trình viên Việt Nam.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
