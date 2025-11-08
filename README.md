# IP Programming - Ứng dụng học tập mạng máy tính tương tác

Một ứng dụng web giáo dục toàn diện về IP Programming với hướng dẫn 2D/3D tương tác, công cụ mạng thực tế và kiến thức lý thuyết đầy đủ.

## 🌟 Tính năng chính

### 1. **Trang chủ - IP của tôi**
- Tự động hiển thị IP công khai của người dùng
- Thông tin vị trí địa lý (thành phố, khu vực, quốc gia)
- Thông tin nhà mạng (ISP, tổ chức)
- Bản đồ tương tác hiển thị vị trí
- Nút sao chép IP tiện lợi

### 2. **Tra cứu IP**
- Tra cứu thông tin chi tiết của bất kỳ IP hoặc tên miền nào
- Hiển thị đầy đủ metadata (vĩ độ, kinh độ, múi giờ, v.v.)
- Bản đồ định vị
- Giao diện tìm kiếm thân thiện

### 3. **Công cụ mạng tương tác**
- **Ping Tool**: Kiểm tra kết nối mạng và đo độ trễ
- **DNS Lookup**: Tra cứu DNS records (A, AAAA, MX, NS, TXT, CNAME)
- **Port Scanner**: Quét cổng mạng với thông tin dịch vụ
- **WHOIS**: Tra cứu thông tin đăng ký tên miền
- Visualization trực quan cho từng công cụ

### 4. **Kiến thức lý thuyết**
- Hướng dẫn chi tiết về IP Programming
- Lịch sử phát triển của IP
- Mô hình TCP/IP
- So sánh IPv4 vs IPv6
- Bảo mật trong IP Programming
- Ứng dụng thực tế

### 5. **Hướng dẫn trực quan 2D**
- Mô phỏng từng bước của Socket Programming
- Quá trình Client-Server communication
- Các bước: socket(), bind(), listen(), connect(), accept(), trao đổi dữ liệu, close()
- Animation và visualization
- Code examples thực tế

### 6. **Hướng dẫn 3D tương tác**
- Sử dụng Three.js và React Three Fiber
- Mô hình 3D của Server rack và Client computer
- Animation packet truyền qua mạng
- Hiệu ứng visual đẹp mắt với post-processing
- Trải nghiệm học tập immersive

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 15** với App Router
- **React 19** với TypeScript
- **Tailwind CSS 4** cho styling
- **React Three Fiber** cho 3D graphics
- **Leaflet** cho bản đồ tương tác
- **Framer Motion** cho animations
- **Lucide React** cho icons

### Backend API
- **Next.js API Routes**
- **Node.js** built-in modules (dns, net, child_process)
- Tích hợp với **ip-api.com** cho geolocation

### 3D Graphics
- **@react-three/drei** - utilities cho Three.js
- **@react-three/postprocessing** - hiệu ứng visual
- **Three.js** core library

### Development
- **TypeScript** cho type safety
- **Turbopack** cho build tối ưu

## 🚀 Cài đặt và chạy

### Phương pháp 1: Docker (Khuyến nghị) 🐳

#### Yêu cầu:
- Docker Desktop hoặc Docker Engine
- Docker Compose

#### Cài đặt nhanh:
```bash
# Clone repository
git clone <repository-url>
cd my-app

# Chạy với Docker
docker-compose up -d --build

# Truy cập ứng dụng
# http://localhost:3000
```

#### Scripts tự động:
```bash
# Windows
deploy.bat deploy

# Linux/macOS
./deploy.sh deploy
```

### Phương pháp 2: Development truyền thống

#### Yêu cầu hệ thống:
- Node.js 18+
- npm hoặc yarn

#### Cài đặt:
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Hoặc build cho production
npm run build
npm start
```

### Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

### 📚 Tài liệu deployment:
- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Docker Guide**: [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## 🎯 Đối tượng mục tiêu

- Sinh viên ngành CNTT học về mạng máy tính
- Lập trình viên muốn hiểu sâu về Socket Programming
- Người mới bắt đầu với IP Programming
- Giảng viên dạy về mạng máy tính

**Được phát triển với ❤️ cho cộng đồng lập trình viên Việt Nam**
