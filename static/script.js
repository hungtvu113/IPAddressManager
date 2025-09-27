// Tab functionality
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Ẩn tất cả tab content
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    
    // Bỏ active class từ tất cả tab buttons
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    // Hiển thị tab được chọn và đánh dấu button active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Validate IP Address
async function validateIP() {
    const ip = document.getElementById('ip-input').value.trim();
    const resultDiv = document.getElementById('ip-result');
    
    if (!ip) {
        showResult(resultDiv, 'Vui lòng nhập IP address', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/validate-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip })
        });
        
        const data = await response.json();
        
        if (data.valid) {
            const ipInfo = `
                <h3>✅ IP Address hợp lệ</h3>
                <div class="ip-info">
                    <div class="ip-info-item">
                        <strong>IP:</strong> ${data.ip}
                    </div>
                    <div class="ip-info-item">
                        <strong>Phiên bản:</strong> ${data.type}
                    </div>
                    <div class="ip-info-item">
                        <strong>Private:</strong> ${data.is_private ? 'Có' : 'Không'}
                    </div>
                    <div class="ip-info-item">
                        <strong>Global:</strong> ${data.is_global ? 'Có' : 'Không'}
                    </div>
                    <div class="ip-info-item">
                        <strong>Loopback:</strong> ${data.is_loopback ? 'Có' : 'Không'}
                    </div>
                </div>
            `;
            showResult(resultDiv, ipInfo, 'success');
        } else {
            showResult(resultDiv, `❌ ${data.error}`, 'error');
        }
    } catch (error) {
        showResult(resultDiv, '❌ Lỗi kết nối đến server', 'error');
    }
}

// Calculate Subnet
async function calculateSubnet() {
    const network = document.getElementById('network-input').value.trim();
    const resultDiv = document.getElementById('subnet-result');
    
    if (!network) {
        showResult(resultDiv, 'Vui lòng nhập network (VD: 192.168.1.0/24)', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/subnet-calc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ network: network })
        });
        
        const data = await response.json();
        
        if (data.valid) {
            const hostsDisplay = data.hosts.length > 0 ? 
                `<div class="ip-info-item">
                    <strong>Một số host:</strong> ${data.hosts.join(', ')}${data.num_addresses > 10 ? '...' : ''}
                </div>` : '';
            
            const subnetInfo = `
                <h3>🧮 Thông tin Subnet</h3>
                <div class="ip-info">
                    <div class="ip-info-item">
                        <strong>Network:</strong> ${data.network}
                    </div>
                    <div class="ip-info-item">
                        <strong>Network Address:</strong> ${data.network_address}
                    </div>
                    <div class="ip-info-item">
                        <strong>Broadcast Address:</strong> ${data.broadcast_address}
                    </div>
                    <div class="ip-info-item">
                        <strong>Netmask:</strong> ${data.netmask}
                    </div>
                    <div class="ip-info-item">
                        <strong>Số địa chỉ:</strong> ${data.num_addresses}
                    </div>
                    ${hostsDisplay}
                </div>
            `;
            showResult(resultDiv, subnetInfo, 'success');
        } else {
            showResult(resultDiv, `❌ ${data.error}`, 'error');
        }
    } catch (error) {
        showResult(resultDiv, '❌ Lỗi kết nối đến server', 'error');
    }
}

// Save IP Address
async function saveIP() {
    const ip = document.getElementById('save-ip-input').value.trim();
    const description = document.getElementById('save-desc-input').value.trim();
    
    if (!ip) {
        alert('Vui lòng nhập IP address');
        return;
    }
    
    try {
        const response = await fetch('/api/save-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip, description: description })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ IP đã được lưu thành công!');
            document.getElementById('save-ip-input').value = '';
            document.getElementById('save-desc-input').value = '';
            loadIPs(); // Tải lại danh sách
        } else {
            alert(`❌ ${data.error}`);
        }
    } catch (error) {
        alert('❌ Lỗi kết nối đến server');
    }
}

// Load IP List
async function loadIPs() {
    const listDiv = document.getElementById('ip-list');
    
    try {
        const response = await fetch('/api/get-ips');
        const data = await response.json();
        
        if (data.success) {
            if (data.ips.length === 0) {
                listDiv.innerHTML = '<p>Chưa có IP nào được lưu.</p>';
                return;
            }
            
            let html = '<h3>📋 Danh sách IP đã lưu</h3>';
            data.ips.forEach(ip => {
                html += `
                    <div class="ip-item">
                        <div class="ip-details">
                            <h4>${ip.ip_address}</h4>
                            <p>${ip.description || 'Không có mô tả'}</p>
                            <p><small>Lưu lúc: ${new Date(ip.created_at).toLocaleString('vi-VN')}</small></p>
                        </div>
                        <button class="delete-btn" onclick="deleteIP(${ip.id})">🗑️ Xóa</button>
                    </div>
                `;
            });
            listDiv.innerHTML = html;
        } else {
            listDiv.innerHTML = `<p class="error">❌ ${data.error}</p>`;
        }
    } catch (error) {
        listDiv.innerHTML = '<p class="error">❌ Lỗi kết nối đến server</p>';
    }
}

// Delete IP
async function deleteIP(id) {
    if (!confirm('Bạn có chắc muốn xóa IP này?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/delete-ip/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ IP đã được xóa!');
            loadIPs(); // Tải lại danh sách
        } else {
            alert(`❌ ${data.error}`);
        }
    } catch (error) {
        alert('❌ Lỗi kết nối đến server');
    }
}

// Helper function to show results
function showResult(element, message, type) {
    element.innerHTML = message;
    element.className = `result ${type}`;
}

// Global map variable
let map;
let marker;

// Initialize Leaflet Map - Copy from working simple-map-test.html
function initMap() {
    try {
        console.log('Initializing map...');

        // Clear any existing map
        if (map) {
            map.remove();
            map = null;
        }

        // Wait for container to be visible
        const mapContainer = document.getElementById('map');
        if (!mapContainer || mapContainer.offsetWidth === 0) {
            console.log('Map container not ready, retrying...');
            setTimeout(initMap, 500);
            return;
        }

        // Default to Vietnam center
        const defaultLocation = [16.0583, 108.2772];

        // Create map exactly like in simple-map-test.html
        map = L.map('map').setView(defaultLocation, 6);

        // Add tiles exactly like in simple-map-test.html
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Force resize after creation
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
                console.log('Map initialized and resized successfully');
            }
        }, 100);

    } catch (error) {
        console.error('Map initialization failed:', error);
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8d7da; color: #721c24;">❌ Map initialization failed</div>';
        }
    }
}

// IP Geolocation function
async function getIPLocation() {
    const ip = document.getElementById('geo-ip-input').value.trim();
    const resultDiv = document.getElementById('geo-result');
    const mapContainer = document.getElementById('map-container');

    if (!ip) {
        showResult(resultDiv, 'Vui lòng nhập IP address', 'error');
        return;
    }

    try {
        const response = await fetch('/api/ip-geolocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip: ip })
        });

        const data = await response.json();

        if (data.success) {
            const location = data.location;

            // Display location info
            const locationInfo = `
                <h3>🌍 Thông tin vị trí IP: ${data.ip}</h3>
                <div class="ip-info">
                    <div class="ip-info-item">
                        <strong>🏳️ Quốc gia:</strong> ${location.country}
                    </div>
                    <div class="ip-info-item">
                        <strong>🏙️ Vùng/Tỉnh:</strong> ${location.region}
                    </div>
                    <div class="ip-info-item">
                        <strong>🌆 Thành phố:</strong> ${location.city}
                    </div>
                    <div class="ip-info-item">
                        <strong>📍 Tọa độ:</strong> ${location.latitude}, ${location.longitude}
                    </div>
                    <div class="ip-info-item">
                        <strong>🌐 ISP:</strong> ${location.isp}
                    </div>
                    <div class="ip-info-item">
                        <strong>🏢 Tổ chức:</strong> ${location.organization}
                    </div>
                    <div class="ip-info-item">
                        <strong>🕐 Múi giờ:</strong> ${location.timezone}
                    </div>
                </div>
            `;

            showResult(resultDiv, locationInfo, 'success');

            // Show map if coordinates are available
            if (location.latitude && location.longitude && location.latitude !== 0) {
                mapContainer.style.display = 'block';
                showLocationOnMap(location.latitude, location.longitude, data.ip, location.city, location.country);
            } else {
                mapContainer.style.display = 'none';
                if (data.message) {
                    showResult(resultDiv, locationInfo + `<p style="margin-top: 15px; color: #856404;"><em>${data.message}</em></p>`, 'success');
                }
            }
        } else {
            showResult(resultDiv, `❌ ${data.error}`, 'error');
            mapContainer.style.display = 'none';
        }
    } catch (error) {
        showResult(resultDiv, '❌ Lỗi kết nối đến server', 'error');
        mapContainer.style.display = 'none';
    }
}

// Show location on map - Copy exact logic from simple-map-test.html
function showLocationOnMap(lat, lng, ip, city, country) {
    try {
        console.log('Showing location on map:', lat, lng);

        // Ensure map is initialized
        if (!map) {
            console.log('Map not initialized, initializing...');
            initMap();
            setTimeout(() => showLocationOnMap(lat, lng, ip, city, country), 1000);
            return;
        }

        const location = [parseFloat(lat), parseFloat(lng)];

        // Validate coordinates
        if (isNaN(location[0]) || isNaN(location[1])) {
            console.error('Invalid coordinates:', lat, lng);
            return;
        }

        // Remove existing marker
        if (marker) {
            map.removeLayer(marker);
        }

        // Center map
        map.setView(location, 10);

        // Add marker
        marker = L.marker(location).addTo(map);

        // Add popup - exactly like simple-map-test.html
        marker.bindPopup(`
            <div style="padding: 10px;">
                <h4>📍 IP: ${ip}</h4>
                <p><strong>Location:</strong> ${city}, ${country}</p>
                <p><strong>Coordinates:</strong> ${lat}, ${lng}</p>
            </div>
        `).openPopup();

        console.log('Location displayed successfully');

    } catch (error) {
        console.error('Error showing location on map:', error);
    }
}

// Load IPs when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Auto load IPs when switching to manage tab
    const manageTab = document.querySelector('[onclick="openTab(event, \'manage-tab\')"]');
    manageTab.addEventListener('click', function() {
        setTimeout(loadIPs, 100);
    });

    // Initialize map when geolocation tab is clicked - Copy from simple-map-test.html logic
    const geoTab = document.querySelector('[onclick="openTab(event, \'geolocation-tab\')"]');
    geoTab.addEventListener('click', function() {
        console.log('Geolocation tab clicked');
        setTimeout(() => {
            if (typeof L !== 'undefined') {
                if (!map) {
                    console.log('Initializing map on tab click');
                    initMap();
                } else {
                    // Force resize if map already exists
                    console.log('Resizing existing map');
                    map.invalidateSize();
                }
            }
        }, 200); // Increased delay to ensure tab is fully visible
    });
});
