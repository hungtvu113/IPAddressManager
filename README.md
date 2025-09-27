# 🌐 IP Address Manager - Demo IP Programming

Đây là một demo ứng dụng web đơn giản để quản lý và kiểm tra IP Address, được phát triển bằng Python Flask và containerized với Docker.

## 🎯 Mục đích

Demo này được tạo ra để minh họa các khái niệm cơ bản về IP Programming bao gồm:
- Validation và phân tích IP Address
- Tính toán Subnet và Network
- Quản lý danh sách IP Address
- Containerization với Docker

## ✨ Tính năng

### 1. 🔍 Kiểm tra IP Address
- Validate IP Address (IPv4 và IPv6)
- Hiển thị thông tin chi tiết về IP:
  - Phiên bản IP (IPv4/IPv6)
  - Loại IP (Private/Public/Loopback)
  - Trạng thái Global

### 2. 🌍 **Tra cứu vị trí IP Address (MỚI!)**
- **Geolocation lookup** cho IP public
- Hiển thị thông tin địa lý:
  - Quốc gia, vùng/tỉnh, thành phố
  - Tọa độ GPS (latitude, longitude)
  - Thông tin ISP và tổ chức
  - Múi giờ (timezone)
- **Hiển thị trên bản đồ Google Maps** (phiên bản Flask)
- Sử dụng **free IP geolocation API**

### 3. 🧮 Tính toán Subnet
- Tính toán thông tin subnet từ CIDR notation
- Hiển thị:
  - Network Address
  - Broadcast Address
  - Subnet Mask
  - Số lượng địa chỉ có thể sử dụng
  - Danh sách host addresses

### 4. 📝 Quản lý IP Address
- Lưu trữ IP Address với mô tả
- Xem danh sách IP đã lưu
- Xóa IP khỏi danh sách
- Lưu trữ trong SQLite database

## 🛠️ Công nghệ sử dụng

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite
- **Containerization**: Docker & Docker Compose
- **Python Libraries**: 
  - Flask (Web framework)
  - ipaddress (IP processing)

## 🚀 Cách chạy ứng dụng

### Phương pháp 1: Demo nhanh (Không cần cài đặt)

1. **Mở file `demo.html` trực tiếp trong trình duyệt**
   - Double-click vào file `demo.html`
   - Hoặc kéo thả file vào trình duyệt
   - Tính năng có sẵn: Kiểm tra IP và tính toán Subnet
   - Tính năng demo: Quản lý IP (chỉ hiển thị dữ liệu mẫu)

### Phương pháp 2: Sử dụng Docker (Khuyến nghị - Đầy đủ tính năng)

1. **Cài đặt Docker và Docker Compose** (nếu chưa có)

2. **Mở terminal/command prompt tại thư mục dự án**

3. **Chạy ứng dụng với Docker Compose:**
```bash
docker-compose up --build
```

4. **Truy cập ứng dụng:**
   - Mở trình duyệt và truy cập: `http://localhost:5000`
   - Tất cả tính năng hoạt động đầy đủ

5. **Dừng ứng dụng:**
```bash
docker-compose down
```

### Phương pháp 3: Chạy trực tiếp với Python

1. **Cài đặt Python 3.7+**

2. **Cài đặt dependencies:**
```bash
pip install -r requirements.txt
```

3. **Chạy ứng dụng:**
```bash
python app.py
```

4. **Truy cập ứng dụng:**
   - Mở trình duyệt và truy cập: `http://localhost:5000`

## 📖 Hướng dẫn sử dụng

### Tab 1: Kiểm tra IP
1. Nhập IP address vào ô input (VD: `192.168.1.1`, `::1`)
2. Click "Kiểm tra"
3. Xem thông tin chi tiết về IP

### Tab 2: 🌍 Vị trí IP (MỚI!)
1. Nhập IP **public** (VD: `8.8.8.8`, `1.1.1.1`)
2. Click "Tra cứu vị trí"
3. Xem thông tin địa lý chi tiết
4. Xem vị trí trên bản đồ (phiên bản Flask)

**IP demo có sẵn:** `8.8.8.8`, `1.1.1.1`, `208.67.222.222`

### Tab 3: Tính toán Subnet
1. Nhập network với CIDR notation (VD: `192.168.1.0/24`)
2. Click "Tính toán"
3. Xem thông tin subnet và danh sách host

### Tab 4: Quản lý IP
1. Nhập IP address và mô tả (tùy chọn)
2. Click "Lưu IP"
3. Click "🔄 Tải danh sách IP" để xem danh sách
4. Sử dụng nút "🗑️ Xóa" để xóa IP

## 🏗️ Cấu trúc dự án

```
ip-address-manager/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── .dockerignore         # Docker ignore file
├── README.md             # Documentation
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # CSS styles
│   └── script.js         # JavaScript functionality
└── data/                 # Database storage (created automatically)
```

## 🔧 API Endpoints

- `GET /` - Trang chủ
- `POST /api/validate-ip` - Validate IP address
- `POST /api/ip-geolocation` - **Tra cứu vị trí IP (MỚI!)**
- `POST /api/subnet-calc` - Tính toán subnet
- `POST /api/save-ip` - Lưu IP address
- `GET /api/get-ips` - Lấy danh sách IP
- `DELETE /api/delete-ip/<id>` - Xóa IP

## 🐳 Docker Commands hữu ích

```bash
# Build và chạy
docker-compose up --build

# Chạy trong background
docker-compose up -d

# Xem logs
docker-compose logs

# Dừng và xóa containers
docker-compose down

# Xóa cả volumes (database sẽ bị xóa)
docker-compose down -v
```

## 📝 Ghi chú

- Database SQLite sẽ được tạo tự động trong thư mục `data/`
- Ứng dụng chạy trên port 5000
- Dữ liệu sẽ được lưu trữ persistent qua Docker volumes
- Giao diện responsive, hoạt động tốt trên mobile

## 🎓 Ý nghĩa giáo dục

Demo này minh họa:
1. **IP Programming concepts**: Validation, parsing, network calculations
2. **Web Development**: REST API, responsive UI
3. **Database operations**: CRUD operations với SQLite
4. **Containerization**: Docker best practices
5. **Modern development workflow**: Separation of concerns, clean code

## 🤝 Đóng góp

Đây là demo giáo dục, bạn có thể:
- Fork và cải thiện
- Thêm tính năng mới
- Báo cáo bugs
- Đề xuất cải tiến

---

**Made with ❤️ for IP Programming Education**
"# IPAddressManager" 
