from flask import Flask, render_template, request, jsonify
import ipaddress
import sqlite3
import os
import requests
import json
from datetime import datetime

app = Flask(__name__)

# Tạo database
def init_db():
    conn = sqlite3.connect('ip_manager.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ip_addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Route chính
@app.route('/')
def index():
    return render_template('index.html')

# API: Kiểm tra IP hợp lệ
@app.route('/api/validate-ip', methods=['POST'])
def validate_ip():
    data = request.get_json()
    ip = data.get('ip', '')
    
    try:
        ip_obj = ipaddress.ip_address(ip)
        return jsonify({
            'valid': True,
            'ip': str(ip_obj),
            'version': ip_obj.version,
            'is_private': ip_obj.is_private,
            'is_global': ip_obj.is_global,
            'is_loopback': ip_obj.is_loopback,
            'type': 'IPv4' if ip_obj.version == 4 else 'IPv6'
        })
    except ValueError:
        return jsonify({'valid': False, 'error': 'IP address không hợp lệ'})

# API: Tính toán subnet
@app.route('/api/subnet-calc', methods=['POST'])
def subnet_calc():
    data = request.get_json()
    network = data.get('network', '')
    
    try:
        net = ipaddress.ip_network(network, strict=False)
        return jsonify({
            'valid': True,
            'network': str(net),
            'network_address': str(net.network_address),
            'broadcast_address': str(net.broadcast_address),
            'netmask': str(net.netmask),
            'num_addresses': net.num_addresses,
            'hosts': [str(ip) for ip in list(net.hosts())[:10]]  # Chỉ hiển thị 10 host đầu
        })
    except ValueError:
        return jsonify({'valid': False, 'error': 'Network không hợp lệ'})

# API: Lưu IP address
@app.route('/api/save-ip', methods=['POST'])
def save_ip():
    data = request.get_json()
    ip = data.get('ip', '')
    description = data.get('description', '')
    
    try:
        # Validate IP
        ipaddress.ip_address(ip)
        
        conn = sqlite3.connect('ip_manager.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO ip_addresses (ip_address, description) VALUES (?, ?)', 
                      (ip, description))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'IP đã được lưu thành công'})
    except ValueError:
        return jsonify({'success': False, 'error': 'IP address không hợp lệ'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API: Lấy danh sách IP
@app.route('/api/get-ips', methods=['GET'])
def get_ips():
    try:
        conn = sqlite3.connect('ip_manager.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM ip_addresses ORDER BY created_at DESC')
        rows = cursor.fetchall()
        conn.close()
        
        ips = []
        for row in rows:
            ips.append({
                'id': row[0],
                'ip_address': row[1],
                'description': row[2],
                'created_at': row[3]
            })
        
        return jsonify({'success': True, 'ips': ips})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API: Xóa IP
@app.route('/api/delete-ip/<int:ip_id>', methods=['DELETE'])
def delete_ip(ip_id):
    try:
        conn = sqlite3.connect('ip_manager.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ip_addresses WHERE id = ?', (ip_id,))
        conn.commit()
        conn.close()

        return jsonify({'success': True, 'message': 'IP đã được xóa'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API: IP Geolocation
@app.route('/api/ip-geolocation', methods=['POST'])
def ip_geolocation():
    data = request.get_json()
    ip = data.get('ip', '')

    if not ip:
        return jsonify({'success': False, 'error': 'IP address không được để trống'})

    try:
        # Validate IP first
        ipaddress.ip_address(ip)

        # Skip geolocation for private IPs
        ip_obj = ipaddress.ip_address(ip)
        if ip_obj.is_private or ip_obj.is_loopback:
            return jsonify({
                'success': True,
                'ip': ip,
                'location': {
                    'country': 'N/A',
                    'region': 'N/A',
                    'city': 'N/A',
                    'latitude': 0,
                    'longitude': 0,
                    'isp': 'Private/Local Network',
                    'organization': 'Private Network',
                    'timezone': 'N/A'
                },
                'message': 'IP private/local - không có thông tin địa lý'
            })

        # Try multiple geolocation APIs for better reliability
        apis_to_try = [
            {
                'name': 'ipapi.co',
                'url': f'https://ipapi.co/{ip}/json/',
                'parser': lambda data: {
                    'country': data.get('country_name', 'Unknown'),
                    'region': data.get('region', 'Unknown'),
                    'city': data.get('city', 'Unknown'),
                    'latitude': data.get('latitude', 0),
                    'longitude': data.get('longitude', 0),
                    'isp': data.get('org', 'Unknown'),
                    'organization': data.get('org', 'Unknown'),
                    'timezone': data.get('timezone', 'Unknown')
                },
                'success_check': lambda data: data and not data.get('error') and data.get('country_name')
            },
            {
                'name': 'ipinfo.io',
                'url': f'https://ipinfo.io/{ip}/json',
                'parser': lambda data: {
                    'country': data.get('country', 'Unknown'),
                    'region': data.get('region', 'Unknown'),
                    'city': data.get('city', 'Unknown'),
                    'latitude': data.get('loc', '0,0').split(',')[0] if data.get('loc') else 0,
                    'longitude': data.get('loc', '0,0').split(',')[1] if data.get('loc') else 0,
                    'isp': data.get('org', 'Unknown'),
                    'organization': data.get('org', 'Unknown'),
                    'timezone': data.get('timezone', 'Unknown')
                },
                'success_check': lambda data: data and not data.get('error') and data.get('country')
            },
            {
                'name': 'ip-api.com',
                'url': f'http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city,lat,lon,isp,org,timezone',
                'parser': lambda data: {
                    'country': data.get('country', 'Unknown'),
                    'region': data.get('regionName', 'Unknown'),
                    'city': data.get('city', 'Unknown'),
                    'latitude': data.get('lat', 0),
                    'longitude': data.get('lon', 0),
                    'isp': data.get('isp', 'Unknown'),
                    'organization': data.get('org', 'Unknown'),
                    'timezone': data.get('timezone', 'Unknown')
                },
                'success_check': lambda data: data and data.get('status') == 'success'
            }
        ]

        for api in apis_to_try:
            try:
                response = requests.get(api['url'], timeout=10)
                if response.status_code == 200:
                    geo_data = response.json()

                    if api['success_check'](geo_data):
                        location_data = api['parser'](geo_data)
                        return jsonify({
                            'success': True,
                            'ip': ip,
                            'location': location_data,
                            'source': api['name']
                        })
            except Exception as e:
                print(f"API {api['name']} failed: {e}")
                continue

        return jsonify({'success': False, 'error': 'Không thể tra cứu vị trí từ tất cả các API'})

    except ValueError:
        return jsonify({'success': False, 'error': 'IP address không hợp lệ'})
    except requests.RequestException:
        return jsonify({'success': False, 'error': 'Lỗi kết nối mạng'})
    except Exception as e:
        return jsonify({'success': False, 'error': f'Lỗi server: {str(e)}'})

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
