# 🚀 Quick Start - IP Programming Docker

Hướng dẫn nhanh để chạy ứng dụng IP Programming với Docker trong 5 phút!

## ⚡ Bước 1: Kiểm tra Docker

```bash
# Kiểm tra Docker đã cài đặt
docker --version
docker-compose --version

# Nếu chưa có, tải Docker Desktop tại: https://www.docker.com/products/docker-desktop
```

## ⚡ Bước 2: Clone và Build

```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd my-app

# Build và chạy ứng dụng
docker-compose up -d --build
```

## ⚡ Bước 3: Truy cập ứng dụng

Mở trình duyệt và truy cập:
- **Ứng dụng**: http://localhost:3000
- **Nginx**: http://localhost (nếu được bật)

## ⚡ Bước 4: Kiểm tra trạng thái

```bash
# Xem containers đang chạy
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 🛑 Dừng ứng dụng

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

## 🔧 Scripts tự động

### Windows:
```cmd
# Deploy
deploy.bat deploy

# Xem logs
deploy.bat logs

# Dừng
deploy.bat stop
```

### Linux/macOS:
```bash
# Deploy
./deploy.sh deploy

# Xem logs
./deploy.sh logs

# Dừng
./deploy.sh stop
```

## 🎯 Các tính năng chính

Sau khi chạy thành công, bạn có thể truy cập:

1. **Trang chủ**: http://localhost:3000
   - Xem IP công khai của bạn
   - Thông tin địa lý và ISP

2. **Tra cứu IP**: http://localhost:3000/tra-cuu-ip
   - Tra cứu bất kỳ IP hoặc domain nào

3. **Công cụ mạng**: http://localhost:3000/cong-cu-mang
   - Ping Tool
   - DNS Lookup
   - Port Scanner
   - WHOIS

4. **Kiến thức**: http://localhost:3000/kien-thuc
   - Lý thuyết IP Programming

5. **Hướng dẫn 2D**: http://localhost:3000/huong-dan-2d
   - Animation Socket Programming

6. **Hướng dẫn 3D**: http://localhost:3000/huong-dan-3d
   - Trải nghiệm 3D tương tác

## 🐛 Troubleshooting nhanh

### Lỗi port đã sử dụng:
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # Thay vì 3000:3000
```

### Container không khởi động:
```bash
# Xem logs chi tiết
docker-compose logs ip-programming-app

# Build lại từ đầu
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Network tools không hoạt động:
```bash
# Kiểm tra trong container
docker-compose exec ip-programming-app ping google.com

# Nếu lỗi, đảm bảo có capabilities trong docker-compose.yml:
cap_add:
  - NET_RAW
  - NET_ADMIN
```

## 📱 Development Mode

Để chạy ở chế độ development với hot reload:

```bash
# Sử dụng docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up -d --build

# Hoặc
npm run dev  # Chạy trực tiếp không qua Docker
```

## 🎉 Hoàn thành!

Bây giờ bạn đã có ứng dụng IP Programming chạy trên Docker!

Để biết thêm chi tiết, xem file `DOCKER_DEPLOYMENT.md`.

---

**Happy coding! 🚀**
