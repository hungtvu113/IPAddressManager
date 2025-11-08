# 🚀 Hướng dẫn các tính năng mới - IP Programming

## 📋 Tổng quan

Dự án đã được mở rộng với **4 công cụ IP mới** hỗ trợ đầy đủ cả **IPv4 và IPv6**:

1. ✅ **IP Validator** - Kiểm tra địa chỉ IP hợp lệ
2. 🧮 **Subnet Calculator** - Phân tích subnet & CIDR
3. ⚖️ **IPv4 vs IPv6 Comparison** - So sánh chi tiết
4. 📜 **IP History** - Lưu & quản lý kết quả

---

## 🎯 Chi tiết các tính năng

### 1. IP Validator (Kiểm tra IP hợp lệ)

**Đường dẫn:** `/cong-cu-mang` → Chọn "IP Validator"

**Chức năng:**
- ✅ Kiểm tra tính hợp lệ của IPv4 và IPv6
- 🔢 Hiển thị dạng Binary, Decimal, Hexadecimal
- 📊 Phân loại IP: Public, Private, Loopback, Link-Local, Multicast
- 🔄 IPv6: Hiển thị cả dạng đầy đủ (expanded) và rút gọn (compressed)

**Ví dụ sử dụng:**
```
IPv4: 192.168.1.1
IPv6: 2001:db8::1
IPv6 Link-Local: fe80::1
IPv6 Loopback: ::1
```

**Kết quả hiển thị:**
- ✅ Trạng thái hợp lệ/không hợp lệ
- 📌 Phiên bản IP (IPv4/IPv6)
- 🏷️ Loại IP (Public/Private/...)
- 🔢 Binary representation
- 🔢 Decimal representation
- 🔢 Hexadecimal representation
- 📝 Expanded/Compressed form (IPv6)

---

### 2. Subnet Calculator (Tính toán Subnet)

**Đường dẫn:** `/cong-cu-mang` → Chọn "Subnet Calculator"

**Chức năng:**
- 🧮 Phân tích CIDR notation (ví dụ: 192.168.1.0/24)
- 📊 Tính toán Network Address, Broadcast Address
- 🎭 Subnet Mask, Wildcard Mask
- 🏠 First Host, Last Host
- 📈 Total Hosts, Usable Hosts
- 🏷️ IP Class (A, B, C, D, E)
- 🔐 IP Type (Public, Private, Loopback, etc.)

**Ví dụ CIDR:**
```
192.168.1.0/24    → 256 địa chỉ (254 usable)
10.0.0.0/8        → 16,777,216 địa chỉ
172.16.0.0/12     → 1,048,576 địa chỉ
192.168.0.0/16    → 65,536 địa chỉ
```

**Công thức tính:**
- **Total Hosts** = 2^(32 - prefix)
- **Usable Hosts** = Total Hosts - 2 (trừ network và broadcast)
- **Subnet Mask** = Chuyển prefix thành dạng dotted decimal
- **Wildcard Mask** = Đảo ngược của subnet mask

---

### 3. IPv4 vs IPv6 Comparison (So sánh)

**Đường dẫn:** `/cong-cu-mang` → Chọn "IPv4 vs IPv6"

**Nội dung so sánh:**

#### 📊 Cơ bản (Basic)
- Độ dài địa chỉ: 32 bits vs 128 bits
- Số lượng địa chỉ: ~4.3 tỷ vs ~340 undecillion
- Định dạng: Decimal vs Hexadecimal

#### ⚙️ Kỹ thuật (Technical)
- Header size: Variable (20-60 bytes) vs Fixed (40 bytes)
- Checksum: Có vs Không
- Fragmentation: Router & Sender vs Chỉ Sender
- NAT: Cần thiết vs Không cần
- Broadcast: Có vs Không (dùng multicast)
- Configuration: Manual/DHCP vs Auto-configuration (SLAAC)

#### 🔒 Bảo mật (Security)
- IPSec: Tùy chọn vs Bắt buộc (built-in)

#### ⚡ Hiệu năng (Performance)
- QoS: Hỗ trợ hạn chế vs Hỗ trợ tốt hơn
- Mobility: Cần Mobile IP vs Built-in support

**Quá trình chuyển đổi:**
1. **Dual Stack** - Chạy cả IPv4 và IPv6 đồng thời
2. **Tunneling** - Đóng gói IPv6 trong IPv4 (6to4, Teredo)
3. **Translation** - Chuyển đổi giữa IPv4 và IPv6 (NAT64, DNS64)

---

### 4. IP History (Lịch sử tra cứu)

**Đường dẫn:** `/cong-cu-mang` → Chọn "Lịch sử"

**Chức năng:**
- 💾 Tự động lưu lịch sử tra cứu (localStorage)
- ⭐ Đánh dấu yêu thích
- 🔍 Tìm kiếm trong lịch sử
- 🏷️ Lọc theo loại công cụ
- 📥 Export lịch sử ra file JSON
- 🗑️ Xóa từng item hoặc xóa tất cả

**Các loại lịch sử được lưu:**
- IP Lookup
- IP Validation
- Subnet Calculation
- Ping
- DNS Lookup
- Port Scan
- WHOIS

**Thống kê:**
- Tổng số tra cứu
- Số lượng yêu thích
- Số loại công cụ đã dùng
- Tra cứu trong 24h qua

---

## 🔧 Cách hoạt động kỹ thuật

### 1. Cách lấy tên miền thành IP

**Sử dụng DNS Resolution:**

```typescript
// File: src/app/api/dns-lookup/route.ts
import { promises as dns } from 'dns';

// Lấy IPv4
const ipv4Addresses = await dns.resolve4('google.com');
// Kết quả: ['142.250.185.46']

// Lấy IPv6
const ipv6Addresses = await dns.resolve6('google.com');
// Kết quả: ['2404:6800:4003:c00::71']

// Lấy cả IPv4 và IPv6
const addresses = await dns.lookup('google.com', { all: true });
```

**Module Node.js sử dụng:**
- `dns.resolve4()` → IPv4 addresses
- `dns.resolve6()` → IPv6 addresses
- `dns.lookup()` → Cả IPv4 và IPv6
- `dns.resolveMx()` → Mail exchange records
- `dns.resolveNs()` → Name server records
- `dns.resolveTxt()` → Text records
- `dns.resolveCname()` → Canonical name records

### 2. Validation IPv4 và IPv6

**File:** `src/utils/ipCalculator.ts`

```typescript
// IPv4 Validation
export function isValidIPv4(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

// IPv6 Validation (hỗ trợ cả dạng đầy đủ và rút gọn)
export function isValidIPv6(ip: string): boolean {
  // Regex phức tạp hỗ trợ tất cả dạng IPv6
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|...)/;
  return ipv6Regex.test(ip);
}
```

### 3. Tính toán Subnet

**Thuật toán:**

```typescript
// 1. Chuyển IP thành số nguyên
function ipv4ToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

// 2. Tính subnet mask
function prefixToSubnetMask(prefix: number): string {
  const mask = ~((1 << (32 - prefix)) - 1);
  return intToIPv4(mask >>> 0);
}

// 3. Tính network address
const networkInt = (ipInt & maskInt) >>> 0;

// 4. Tính broadcast address
const broadcastInt = (networkInt | ~maskInt) >>> 0;

// 5. Tính số hosts
const totalHosts = Math.pow(2, 32 - prefix);
const usableHosts = totalHosts - 2; // Trừ network và broadcast
```

### 4. Xử lý IPv6

**Rút gọn IPv6:**

```typescript
// Ví dụ: 2001:0db8:0000:0000:0000:0000:0000:0001
// → 2001:db8::1

export function compressIPv6(ipv6: string): string {
  // 1. Loại bỏ leading zeros
  // 2. Tìm chuỗi dài nhất của các '0' liên tiếp
  // 3. Thay thế bằng '::'
}
```

**Mở rộng IPv6:**

```typescript
// Ví dụ: 2001:db8::1
// → 2001:0db8:0000:0000:0000:0000:0000:0001

export function expandIPv6(ipv6: string): string {
  // 1. Xử lý '::'
  // 2. Expand mỗi phần thành 4 chữ số
}
```

---

## 📁 Cấu trúc file mới

```
my-app/
├── src/
│   ├── app/
│   │   ├── cong-cu-mang/
│   │   │   └── page.tsx              # Đã cập nhật với 8 tools
│   │   └── ip-tools/
│   │       └── page.tsx              # Trang mới cho IP tools
│   ├── components/
│   │   └── tools/
│   │       ├── IPValidatorTool.tsx        # ✨ MỚI
│   │       ├── SubnetCalculatorTool.tsx   # ✨ MỚI
│   │       ├── IPComparisonTool.tsx       # ✨ MỚI
│   │       └── IPHistoryTool.tsx          # ✨ MỚI
│   ├── utils/
│   │   ├── ipCalculator.ts           # ✨ MỚI - Logic tính toán IP
│   │   └── api.ts                    # Đã cập nhật IPv6 validation
│   └── types/
│       └── index.ts                  # Đã thêm types mới
└── FEATURES_GUIDE.md                 # ✨ MỚI - File này
```

---

## 🎨 UI/UX Features

### Responsive Design
- ✅ Mobile-friendly
- ✅ Tablet-optimized
- ✅ Desktop full-featured

### Dark Theme
- 🌙 Gradient backgrounds
- 🎨 Color-coded tools
- ✨ Smooth animations

### Copy to Clipboard
- 📋 Sao chép mọi giá trị quan trọng
- ✅ Visual feedback khi copy thành công

### Real-time Validation
- ⚡ Kiểm tra input ngay lập tức
- 🚫 Hiển thị lỗi rõ ràng
- ✅ Gợi ý ví dụ

---

## 🔍 Ví dụ sử dụng thực tế

### Scenario 1: Kiểm tra IP của website

```
1. Vào "DNS Lookup"
2. Nhập: google.com
3. Xem A records → Lấy IPv4
4. Vào "IP Validator"
5. Nhập IPv4 vừa lấy
6. Xem chi tiết: Binary, Decimal, Type
```

### Scenario 2: Thiết kế mạng LAN

```
1. Vào "Subnet Calculator"
2. Nhập: 192.168.1.0/24
3. Xem:
   - Network: 192.168.1.0
   - Broadcast: 192.168.1.255
   - Usable: 192.168.1.1 - 192.168.1.254
   - Total: 254 hosts
4. Lưu vào "Lịch sử" để tham khảo sau
```

### Scenario 3: Học về IPv6

```
1. Vào "IPv4 vs IPv6"
2. Đọc so sánh chi tiết
3. Vào "IP Validator"
4. Thử các IPv6 examples:
   - 2001:db8::1
   - fe80::1
   - ::1
5. Xem dạng expanded và compressed
```

---

## 🚀 Cách chạy dự án

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Docker
docker-compose up -d --build
```

---

## 📚 Tài liệu tham khảo

- **IPv4**: RFC 791
- **IPv6**: RFC 2460, RFC 4291
- **CIDR**: RFC 4632
- **Subnetting**: RFC 950

---

## 🎓 Kiến thức bổ sung

### CIDR Notation
- `/8` = Class A (16,777,216 hosts)
- `/16` = Class B (65,536 hosts)
- `/24` = Class C (256 hosts)
- `/32` = Single host

### Private IP Ranges
- **IPv4:**
  - 10.0.0.0/8
  - 172.16.0.0/12
  - 192.168.0.0/16
  
- **IPv6:**
  - fc00::/7 (Unique Local Addresses)
  - fe80::/10 (Link-Local)

### Special Addresses
- **IPv4:**
  - 127.0.0.1 (Loopback)
  - 169.254.0.0/16 (Link-Local)
  - 224.0.0.0/4 (Multicast)
  
- **IPv6:**
  - ::1 (Loopback)
  - fe80::/10 (Link-Local)
  - ff00::/8 (Multicast)

---

## 💡 Tips & Tricks

1. **Sử dụng Quick Examples** - Mỗi tool đều có ví dụ nhanh để test
2. **Đánh dấu yêu thích** - Lưu các tra cứu quan trọng trong History
3. **Export dữ liệu** - Backup lịch sử tra cứu định kỳ
4. **Copy values** - Click icon copy để sao chép nhanh
5. **Filter history** - Lọc theo loại tool để tìm nhanh

---

**Chúc bạn sử dụng hiệu quả! 🎉**

