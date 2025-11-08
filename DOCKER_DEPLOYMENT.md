# 🐳 Docker Deployment Guide - IP Programming

Hướng dẫn triển khai ứng dụng IP Programming sử dụng Docker và Docker Compose.

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết:
- **Docker Desktop** (Windows/Mac) hoặc **Docker Engine** (Linux)
- **Docker Compose** (thường đi kèm với Docker Desktop)
- **Git** (để clone repository)

### Tài nguyên hệ thống:
- **RAM**: Tối thiểu 2GB, khuyến nghị 4GB+
- **Disk**: Tối thiểu 1GB trống
- **CPU**: 2 cores khuyến nghị
- **Network**: Cổng 3000 và 80 phải trống

## 🚀 Cài đặt Docker

### Windows:
1. Tải Docker Desktop từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Đảm bảo WSL2 được bật (nếu sử dụng Windows 10/11)

### macOS:
1. Tải Docker Desktop từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop

### Linux (Ubuntu/Debian):
```bash
# Cập nhật package index
sudo apt update

# Cài đặt Docker
sudo apt install docker.io docker-compose

# Thêm user vào group docker
sudo usermod -aG docker $USER

# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

## 📦 Deployment

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd my-app
```

### Bước 2: Kiểm tra Docker
```bash
# Kiểm tra Docker
docker --version
docker-compose --version

# Kiểm tra Docker đang chạy
docker ps
```

### Bước 3: Deploy ứng dụng

#### Trên Windows:
```cmd
# Sử dụng script tự động
deploy.bat deploy

# Hoặc thủ công
docker-compose up -d --build
```

#### Trên Linux/macOS:
```bash
# Sử dụng script tự động
./deploy.sh deploy

# Hoặc thủ công
docker-compose up -d --build
```

### Bước 4: Kiểm tra deployment
```bash
# Kiểm tra trạng thái containers
docker-compose ps

# Kiểm tra logs
docker-compose logs -f

# Kiểm tra ứng dụng
curl http://localhost:3000
```

## 🌐 Truy cập ứng dụng

Sau khi deployment thành công:

- **Ứng dụng chính**: http://localhost:3000
- **Nginx reverse proxy**: http://localhost (nếu được bật)
- **Health check**: http://localhost:3000/api/ping

## 🛠️ Quản lý Container

### Các lệnh cơ bản:

```bash
# Xem trạng thái
docker-compose ps

# Xem logs
docker-compose logs -f [service_name]

# Khởi động lại
docker-compose restart

# Dừng services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v

# Build lại images
docker-compose build --no-cache

# Scale services (nếu cần)
docker-compose up -d --scale ip-programming-app=2
```

### Sử dụng script tự động:

#### Windows:
```cmd
deploy.bat status    # Xem trạng thái
deploy.bat logs      # Xem logs
deploy.bat restart   # Khởi động lại
deploy.bat stop      # Dừng services
deploy.bat health    # Kiểm tra health
```

#### Linux/macOS:
```bash
./deploy.sh status    # Xem trạng thái
./deploy.sh logs      # Xem logs
./deploy.sh restart   # Khởi động lại
./deploy.sh stop      # Dừng services
./deploy.sh health    # Kiểm tra health
```

## 🔧 Cấu hình

### Environment Variables:
Tạo file `.env` để tùy chỉnh:
```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Nginx Configuration:
Chỉnh sửa `nginx.conf` để:
- Thay đổi rate limiting
- Cấu hình SSL/HTTPS
- Thêm custom headers
- Cấu hình caching

### Docker Compose Override:
Tạo `docker-compose.override.yml` cho development:
```yaml
version: '3.8'
services:
  ip-programming-app:
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## 🔍 Troubleshooting

### Lỗi thường gặp:

#### 1. Port đã được sử dụng:
```bash
# Kiểm tra process sử dụng port
netstat -tulpn | grep :3000

# Thay đổi port trong docker-compose.yml
ports:
  - "3001:3000"  # Thay vì 3000:3000
```

#### 2. Container không khởi động:
```bash
# Xem logs chi tiết
docker-compose logs ip-programming-app

# Kiểm tra Docker daemon
docker info
```

#### 3. Network tools không hoạt động:
```bash
# Kiểm tra capabilities
docker-compose exec ip-programming-app ping google.com

# Nếu lỗi, thêm vào docker-compose.yml:
cap_add:
  - NET_RAW
  - NET_ADMIN
```

#### 4. Build lỗi:
```bash
# Xóa cache và build lại
docker system prune -a
docker-compose build --no-cache
```

### Logs và Monitoring:

```bash
# Xem logs realtime
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f ip-programming-app

# Xem resource usage
docker stats

# Kiểm tra health
docker-compose exec ip-programming-app curl localhost:3000/api/ping
```

## 🚀 Production Deployment

### Khuyến nghị cho production:

1. **Sử dụng reverse proxy** (Nginx)
2. **Cấu hình SSL/HTTPS**
3. **Set up monitoring** (Prometheus, Grafana)
4. **Backup strategy**
5. **Log aggregation** (ELK stack)
6. **Security scanning**

### SSL Configuration:
```bash
# Tạo thư mục SSL
mkdir ssl

# Copy certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Uncomment HTTPS server block trong nginx.conf
```

### Environment cho Production:
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
# Thêm các biến môi trường khác nếu cần
```

## 📊 Monitoring

### Health Checks:
- Container health check: Tự động kiểm tra mỗi 30s
- Application health: `/api/ping` endpoint
- Nginx health: `/health` endpoint

### Metrics:
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network usage
docker network ls
```

## 🔄 Updates và Maintenance

### Cập nhật ứng dụng:
```bash
# Pull code mới
git pull origin main

# Rebuild và deploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup:
```bash
# Backup volumes
docker run --rm -v my-app_logs:/data -v $(pwd):/backup alpine tar czf /backup/logs-backup.tar.gz /data

# Backup images
docker save my-app_ip-programming-app > ip-programming-backup.tar
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra Docker status: `docker info`
3. Restart services: `docker-compose restart`
4. Liên hệ team support

---

**Chúc bạn deployment thành công! 🎉**
