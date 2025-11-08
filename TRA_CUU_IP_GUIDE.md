# 📍 Hướng dẫn chức năng Tra cứu IP

## 📂 Cấu trúc file

### 1. **Frontend - Trang Tra cứu IP**
**File:** `src/app/tra-cuu-ip/page.tsx`

**Chức năng:**
- Giao diện tra cứu IP/domain
- Form nhập liệu với validation
- Hiển thị kết quả tra cứu
- Hiển thị bản đồ vị trí
- Copy IP vào clipboard

**Components sử dụng:**
- `IPMap` - Bản đồ hiển thị vị trí (dynamic import)
- Icons từ `lucide-react`: Search, MapPin, Globe, Wifi, Clock, Copy, CheckCircle, Loader2, AlertCircle, Info

---

### 2. **API Route - Proxy IP Info**
**File:** `src/app/api/ip-info/route.ts`

**Chức năng:**
- Nhận request từ client
- Gọi API `ip-api.com` từ server-side
- Xử lý localhost/loopback IP
- Trả về thông tin IP

**Endpoint:**
- `GET /api/ip-info` - Lấy IP công khai của client
- `GET /api/ip-info?ip=8.8.8.8` - Tra cứu IP cụ thể

---

### 3. **API Utilities**
**File:** `src/utils/api.ts`

**Function:** `lookupIP(query: string): Promise<IPInfo>`

**Chức năng:**
- Gọi API route `/api/ip-info?ip={query}`
- Xử lý lỗi
- Map field `query` → `ip`

---

### 4. **Type Definitions**
**File:** `src/types/index.ts`

**Interface:** `IPInfo`

```typescript
export interface IPInfo {
  ip: string;           // Địa chỉ IP
  city: string;         // Thành phố
  region: string;       // Khu vực/Tỉnh
  country: string;      // Quốc gia
  countryCode: string;  // Mã quốc gia (VN, US, etc.)
  lat: number;          // Vĩ độ
  lon: number;          // Kinh độ
  timezone: string;     // Múi giờ
  isp: string;          // Nhà mạng
  org: string;          // Tổ chức
  as: string;           // AS Number
  query: string;        // IP được tra cứu
  status: string;       // Trạng thái (success/fail)
}
```

---

## 🔄 Luồng hoạt động

### 1. **User nhập IP/Domain**
```
User nhập: "8.8.8.8" hoặc "google.com"
  ↓
Validation (isValidIP hoặc isValidDomain)
  ↓
Nếu hợp lệ → Gọi API
Nếu không → Hiển thị lỗi
```

### 2. **Gọi API tra cứu**
```
Frontend: lookupIP("8.8.8.8")
  ↓
API Route: GET /api/ip-info?ip=8.8.8.8
  ↓
Server: fetch("http://ip-api.com/json/8.8.8.8")
  ↓
Response: { query: "8.8.8.8", city: "Mountain View", ... }
  ↓
Map: { ip: "8.8.8.8", city: "Mountain View", ... }
  ↓
Frontend: Hiển thị kết quả
```

### 3. **Xử lý localhost IP**
```
Client IP: ::1 (localhost)
  ↓
API Route kiểm tra: clientIP === '::1'
  ↓
Nếu đúng → targetIP = '' (empty)
  ↓
Gọi: http://ip-api.com/json/ (không có IP)
  ↓
API trả về IP công khai của server
```

---

## 💻 Code chi tiết

### **Frontend - Form tra cứu**

<augment_code_snippet path="my-app/src/app/tra-cuu-ip/page.tsx" mode="EXCERPT">
````typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!query.trim()) return;

  // Validation
  if (!isValidIP(query) && !isValidDomain(query)) {
    setError('Vui lòng nhập địa chỉ IP hoặc tên miền hợp lệ');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    const data = await ipApi.lookupIP(query.trim());
    setIpInfo(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    setIpInfo(null);
  } finally {
    setLoading(false);
  }
};
````
</augment_code_snippet>

---

### **API Route - Xử lý request**

<augment_code_snippet path="my-app/src/app/api/ip-info/route.ts" mode="EXCERPT">
````typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryIP = searchParams.get('ip');

    let targetIP = queryIP;
    if (!targetIP) {
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0];
      
      // Xử lý localhost
      if (!clientIP || clientIP === '::1' || clientIP === '127.0.0.1') {
        targetIP = ''; // Lấy IP công khai
      } else {
        targetIP = clientIP;
      }
    }

    const apiUrl = targetIP 
      ? `http://ip-api.com/json/${targetIP}`
      : `http://ip-api.com/json/`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
````
</augment_code_snippet>

---

### **API Utility - lookupIP function**

<augment_code_snippet path="my-app/src/utils/api.ts" mode="EXCERPT">
````typescript
lookupIP: async (query: string): Promise<IPInfo> => {
  try {
    const response = await fetch(
      `${API_BASE}/ip-info?ip=${encodeURIComponent(query)}`,
      { method: 'GET', cache: 'no-store' }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Không thể tra cứu IP');
    }

    const data = await response.json();
    
    // Map 'query' field to 'ip' field
    return { ...data, ip: data.query };
  } catch (error: any) {
    console.error('lookupIP error:', error);
    throw error;
  }
}
````
</augment_code_snippet>

---

## 🎯 Các tính năng chính

### 1. **Validation Input**
- ✅ Kiểm tra IPv4 hợp lệ (regex)
- ✅ Kiểm tra IPv6 hợp lệ (regex)
- ✅ Kiểm tra domain hợp lệ (regex)
- ✅ Hiển thị lỗi nếu không hợp lệ

### 2. **Tra cứu IP/Domain**
- ✅ Hỗ trợ IPv4 (8.8.8.8)
- ✅ Hỗ trợ domain (google.com)
- ✅ Hỗ trợ subdomain (www.example.com)
- ✅ Timeout 10 giây

### 3. **Hiển thị kết quả**
- ✅ Địa chỉ IP lớn, rõ ràng
- ✅ Thông tin địa lý (City, Region, Country, Coordinates, Timezone)
- ✅ Thông tin mạng (ISP, Organization, AS Number)
- ✅ Bản đồ tương tác (Leaflet)
- ✅ Copy IP vào clipboard

### 4. **UX/UI**
- ✅ Loading state khi đang tra cứu
- ✅ Error handling với thông báo rõ ràng
- ✅ Nút "Xóa kết quả" để reset
- ✅ Responsive design
- ✅ Animations mượt mà

---

## 🔧 Cách sử dụng

### **1. Truy cập trang**
```
http://localhost:3000/tra-cuu-ip
```

### **2. Nhập IP hoặc Domain**
Ví dụ:
- `8.8.8.8` (Google DNS)
- `1.1.1.1` (Cloudflare DNS)
- `google.com`
- `facebook.com`
- `www.example.com`

### **3. Click "Tra cứu"**
- Hệ thống sẽ gọi API
- Hiển thị loading spinner
- Sau 1-2 giây hiển thị kết quả

### **4. Xem kết quả**
- Địa chỉ IP
- Thông tin địa lý
- Thông tin mạng
- Bản đồ vị trí

---

## 🐛 Xử lý lỗi

### **1. Input không hợp lệ**
```
Error: "Vui lòng nhập địa chỉ IP hoặc tên miền hợp lệ"
```

### **2. API timeout**
```
Error: "Timeout: Không thể kết nối đến API sau 10 giây"
```

### **3. IP không tồn tại**
```
Error: "IP không hợp lệ"
```

### **4. Lỗi server**
```
Error: "Lỗi server khi lấy thông tin IP"
```

---

## 📊 API Response Example

### **Request:**
```
GET /api/ip-info?ip=8.8.8.8
```

### **Response:**
```json
{
  "query": "8.8.8.8",
  "status": "success",
  "country": "United States",
  "countryCode": "US",
  "region": "CA",
  "city": "Mountain View",
  "lat": 37.386,
  "lon": -122.0838,
  "timezone": "America/Los_Angeles",
  "isp": "Google LLC",
  "org": "Google Public DNS",
  "as": "AS15169 Google LLC"
}
```

---

## 🚀 Cải tiến có thể thêm

### **1. Lưu lịch sử tra cứu**
- Tích hợp với `historyManager.ts`
- Lưu vào localStorage
- Hiển thị lịch sử tra cứu gần đây

### **2. Thêm thông tin kỹ thuật**
- Binary, Decimal, Hexadecimal của IP
- IP Type (Public, Private, etc.)
- Reverse DNS lookup

### **3. So sánh nhiều IP**
- Tra cứu nhiều IP cùng lúc
- So sánh khoảng cách địa lý
- So sánh ISP

### **4. Export kết quả**
- Export ra JSON
- Export ra CSV
- Export ra PDF

---

## 📝 Tóm tắt

**Chức năng Tra cứu IP** cho phép người dùng:
1. ✅ Nhập IP hoặc domain
2. ✅ Tra cứu thông tin chi tiết
3. ✅ Xem vị trí trên bản đồ
4. ✅ Copy IP vào clipboard
5. ✅ Xem thông tin địa lý và mạng

**Files chính:**
- `src/app/tra-cuu-ip/page.tsx` - Frontend
- `src/app/api/ip-info/route.ts` - API Route
- `src/utils/api.ts` - API Utilities
- `src/types/index.ts` - Type Definitions

**API sử dụng:**
- `ip-api.com` - Free IP Geolocation API

