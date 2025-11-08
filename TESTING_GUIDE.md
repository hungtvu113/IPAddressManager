# 🧪 Hướng dẫn Test các tính năng mới

## 🚀 Khởi động ứng dụng

```bash
cd my-app
npm install
npm run dev
```

Truy cập: `http://localhost:3000`

---

## ✅ Test Case 1: IP Validator

### Bước 1: Truy cập công cụ
1. Vào `http://localhost:3000/cong-cu-mang`
2. Click vào **"IP Validator"** (màu cyan)

### Bước 2: Test IPv4

**Test case 1.1: IPv4 Public**
```
Input: 8.8.8.8
Expected:
- ✅ Valid
- Version: IPv4
- Type: Public
- Binary: 00001000.00001000.00001000.00001000
- Decimal: 134744072
- Hex: 0x08080808
```

**Test case 1.2: IPv4 Private**
```
Input: 192.168.1.1
Expected:
- ✅ Valid
- Version: IPv4
- Type: Private
- Binary: 11000000.10101000.00000001.00000001
```

**Test case 1.3: IPv4 Loopback**
```
Input: 127.0.0.1
Expected:
- ✅ Valid
- Version: IPv4
- Type: Loopback
```

**Test case 1.4: IPv4 Invalid**
```
Input: 256.1.1.1
Expected:
- ❌ Invalid
- Error message hiển thị
```

### Bước 3: Test IPv6

**Test case 1.5: IPv6 Full**
```
Input: 2001:0db8:0000:0000:0000:0000:0000:0001
Expected:
- ✅ Valid
- Version: IPv6
- Type: Public
- Compressed: 2001:db8::1
- Expanded: 2001:0db8:0000:0000:0000:0000:0000:0001
```

**Test case 1.6: IPv6 Compressed**
```
Input: 2001:db8::1
Expected:
- ✅ Valid
- Version: IPv6
- Compressed: 2001:db8::1
- Expanded: 2001:0db8:0000:0000:0000:0000:0000:0001
```

**Test case 1.7: IPv6 Loopback**
```
Input: ::1
Expected:
- ✅ Valid
- Version: IPv6
- Type: Loopback
- Expanded: 0000:0000:0000:0000:0000:0000:0000:0001
```

**Test case 1.8: IPv6 Link-Local**
```
Input: fe80::1
Expected:
- ✅ Valid
- Version: IPv6
- Type: Link-Local
```

### Bước 4: Test Copy to Clipboard
1. Click vào icon copy bên cạnh bất kỳ giá trị nào
2. Icon sẽ chuyển thành checkmark (✓)
3. Paste vào notepad để verify

---

## ✅ Test Case 2: Subnet Calculator

### Bước 1: Truy cập công cụ
1. Vào `http://localhost:3000/cong-cu-mang`
2. Click vào **"Subnet Calculator"** (màu indigo)

### Bước 2: Test CIDR /24

**Test case 2.1: Class C Network**
```
Input: 192.168.1.0/24
Expected:
- CIDR: 192.168.1.0/24
- Network Address: 192.168.1.0
- Broadcast Address: 192.168.1.255
- Subnet Mask: 255.255.255.0
- Wildcard Mask: 0.0.0.255
- First Host: 192.168.1.1
- Last Host: 192.168.1.254
- Total Hosts: 256
- Usable Hosts: 254
- IP Class: C
- IP Type: Private
```

### Bước 3: Test CIDR /8

**Test case 2.2: Class A Network**
```
Input: 10.0.0.0/8
Expected:
- Network Address: 10.0.0.0
- Broadcast Address: 10.255.255.255
- Subnet Mask: 255.0.0.0
- Wildcard Mask: 0.255.255.255
- Total Hosts: 16,777,216
- Usable Hosts: 16,777,214
- IP Class: A
```

### Bước 4: Test CIDR /16

**Test case 2.3: Class B Network**
```
Input: 172.16.0.0/12
Expected:
- Network Address: 172.16.0.0
- Broadcast Address: 172.31.255.255
- Subnet Mask: 255.240.0.0
- Total Hosts: 1,048,576
- Usable Hosts: 1,048,574
- IP Class: B
```

### Bước 5: Test CIDR /32

**Test case 2.4: Single Host**
```
Input: 8.8.8.8/32
Expected:
- Network Address: 8.8.8.8
- Broadcast Address: 8.8.8.8
- Subnet Mask: 255.255.255.255
- Total Hosts: 1
- Usable Hosts: 0 (hoặc 1)
```

### Bước 6: Test Invalid CIDR

**Test case 2.5: Invalid Format**
```
Input: 192.168.1.0
Expected:
- ❌ Error: "CIDR notation không hợp lệ"
```

```
Input: 192.168.1.0/33
Expected:
- ❌ Error: "CIDR notation không hợp lệ"
```

---

## ✅ Test Case 3: IPv4 vs IPv6 Comparison

### Bước 1: Truy cập công cụ
1. Vào `http://localhost:3000/cong-cu-mang`
2. Click vào **"IPv4 vs IPv6"** (màu pink)

### Bước 2: Test Filters

**Test case 3.1: Filter "Tất cả"**
- Click "Tất cả"
- Verify: Hiển thị tất cả 12+ dòng so sánh

**Test case 3.2: Filter "Cơ bản"**
- Click "Cơ bản"
- Verify: Chỉ hiển thị các dòng có tag "Cơ bản"
  - Độ dài địa chỉ
  - Số lượng địa chỉ
  - Định dạng

**Test case 3.3: Filter "Kỹ thuật"**
- Click "Kỹ thuật"
- Verify: Hiển thị các dòng về header, checksum, fragmentation, etc.

**Test case 3.4: Filter "Bảo mật"**
- Click "Bảo mật"
- Verify: Hiển thị dòng về IPSec

**Test case 3.5: Filter "Hiệu năng"**
- Click "Hiệu năng"
- Verify: Hiển thị dòng về QoS, Mobility

### Bước 3: Verify Content

**Test case 3.6: Check Comparison Data**
- Verify IPv4 column có màu xanh dương
- Verify IPv6 column có màu xanh lá
- Verify ưu điểm có icon ✓
- Verify nhược điểm có icon ✗

### Bước 4: Check Migration Info

**Test case 3.7: Migration Methods**
- Verify hiển thị 3 phương pháp:
  1. Dual Stack
  2. Tunneling
  3. Translation

---

## ✅ Test Case 4: IP History

### Bước 1: Truy cập công cụ
1. Vào `http://localhost:3000/cong-cu-mang`
2. Click vào **"Lịch sử"** (màu yellow)

### Bước 2: Test Empty State

**Test case 4.1: No History**
- Verify: Hiển thị "Chưa có lịch sử tra cứu"
- Verify: Icon History lớn ở giữa

### Bước 3: Create History

**Test case 4.2: Add History Items**
1. Quay lại và sử dụng IP Validator với `8.8.8.8`
2. Sử dụng Subnet Calculator với `192.168.1.0/24`
3. Sử dụng DNS Lookup với `google.com`
4. Quay lại "Lịch sử"
5. Verify: Hiển thị 3 items

### Bước 4: Test Favorite

**Test case 4.3: Toggle Favorite**
1. Click icon sao (⭐) trên một item
2. Verify: Icon chuyển thành màu vàng và filled
3. Click lại lần nữa
4. Verify: Icon quay về trạng thái ban đầu

### Bước 5: Test Filter

**Test case 4.4: Filter by Type**
1. Click "Validation"
2. Verify: Chỉ hiển thị IP Validator items
3. Click "Subnet"
4. Verify: Chỉ hiển thị Subnet Calculator items
5. Click "Yêu thích"
6. Verify: Chỉ hiển thị items đã đánh dấu sao

### Bước 6: Test Search

**Test case 4.5: Search**
1. Nhập "8.8.8.8" vào search box
2. Verify: Chỉ hiển thị items có "8.8.8.8"
3. Xóa search
4. Verify: Hiển thị lại tất cả

### Bước 7: Test Delete

**Test case 4.6: Delete Single Item**
1. Click icon trash (🗑️) trên một item
2. Verify: Item bị xóa khỏi danh sách

**Test case 4.7: Delete All**
1. Click "Xóa tất cả"
2. Verify: Hiển thị confirm dialog
3. Click OK
4. Verify: Tất cả items bị xóa

### Bước 8: Test Export

**Test case 4.8: Export History**
1. Tạo lại một vài history items
2. Click "Export"
3. Verify: File JSON được download
4. Mở file và verify format:
```json
[
  {
    "id": "...",
    "timestamp": 1234567890,
    "type": "validation",
    "query": "8.8.8.8",
    "result": {...},
    "favorite": false
  }
]
```

### Bước 9: Test Statistics

**Test case 4.9: Statistics Display**
- Verify: Hiển thị 4 thống kê:
  1. Tổng số
  2. Yêu thích
  3. Loại công cụ
  4. Hôm nay

---

## ✅ Test Case 5: Integration Tests

### Test case 5.1: DNS → IP Validator Flow
1. Vào DNS Lookup
2. Nhập `google.com`
3. Copy một IPv4 address từ kết quả
4. Vào IP Validator
5. Paste IPv4 address
6. Verify: Validation thành công

### Test case 5.2: IP Validator → Subnet Calculator Flow
1. Vào IP Validator
2. Validate `192.168.1.1`
3. Nhớ IP này
4. Vào Subnet Calculator
5. Nhập `192.168.1.0/24`
6. Verify: IP `192.168.1.1` nằm trong dải First Host - Last Host

### Test case 5.3: Multiple Tools → History Flow
1. Sử dụng 3-4 tools khác nhau
2. Vào History
3. Verify: Tất cả đều được lưu
4. Filter theo từng loại
5. Verify: Filter hoạt động đúng

---

## ✅ Test Case 6: Responsive Design

### Test case 6.1: Mobile View (375px)
1. Mở DevTools (F12)
2. Chọn iPhone SE hoặc resize về 375px
3. Test tất cả tools
4. Verify:
   - Layout chuyển sang 1 column
   - Buttons vẫn clickable
   - Text vẫn đọc được
   - No horizontal scroll

### Test case 6.2: Tablet View (768px)
1. Resize về 768px
2. Verify:
   - Layout chuyển sang 2 columns
   - Cards hiển thị đẹp

### Test case 6.3: Desktop View (1920px)
1. Resize về 1920px
2. Verify:
   - Layout 4 columns
   - Tất cả content hiển thị tốt

---

## ✅ Test Case 7: Error Handling

### Test case 7.1: Invalid Input
- IP Validator: `abc.def.ghi.jkl` → Error
- Subnet Calculator: `192.168.1.0/abc` → Error

### Test case 7.2: Empty Input
- IP Validator: (empty) → Disable button
- Subnet Calculator: (empty) → Disable button

### Test case 7.3: Network Error
- Disconnect internet
- Try DNS Lookup
- Verify: Error message hiển thị

---

## ✅ Test Case 8: Performance

### Test case 8.1: Large History
1. Tạo 50+ history items
2. Verify: Scroll smooth
3. Test search
4. Test filter
5. Verify: No lag

### Test case 8.2: Quick Examples
1. Click quick example buttons nhiều lần
2. Verify: Response nhanh
3. No delay

---

## 📊 Expected Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| IP Validator IPv4 | ✅ | Tất cả test cases pass |
| IP Validator IPv6 | ✅ | Hỗ trợ đầy đủ compressed/expanded |
| Subnet Calculator | ✅ | Tính toán chính xác |
| IPv4 vs IPv6 | ✅ | Hiển thị đầy đủ thông tin |
| History Management | ✅ | CRUD operations hoạt động |
| Copy to Clipboard | ✅ | Tất cả values có thể copy |
| Responsive Design | ✅ | Mobile, Tablet, Desktop OK |
| Error Handling | ✅ | Errors hiển thị rõ ràng |

---

## 🐛 Known Issues (Nếu có)

*Hiện tại chưa phát hiện issues. Nếu bạn tìm thấy bug, vui lòng ghi chú tại đây.*

---

## 📝 Notes

1. **LocalStorage**: Lịch sử được lưu trong browser, xóa cache sẽ mất dữ liệu
2. **IPv6**: Một số ISP chưa hỗ trợ IPv6, DNS lookup có thể không trả về AAAA records
3. **CIDR**: Hiện tại chỉ hỗ trợ IPv4 CIDR, IPv6 CIDR sẽ được thêm sau

---

**Happy Testing! 🎉**

