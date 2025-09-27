#!/usr/bin/env python3
"""
Test script để kiểm tra các tính năng cơ bản của IP Address Manager
"""

import ipaddress
import sys

def test_ip_validation():
    """Test IP validation functionality"""
    print("🔍 Testing IP Validation...")
    
    test_cases = [
        "192.168.1.1",      # Valid IPv4
        "10.0.0.1",         # Valid IPv4 private
        "8.8.8.8",          # Valid IPv4 public
        "::1",              # Valid IPv6 loopback
        "2001:db8::1",      # Valid IPv6
        "256.256.256.256",  # Invalid IPv4
        "invalid_ip",       # Invalid format
        ""                  # Empty string
    ]
    
    for ip in test_cases:
        try:
            ip_obj = ipaddress.ip_address(ip)
            print(f"  ✅ {ip} -> Valid {ip_obj.version}v{ip_obj.version} ({'Private' if ip_obj.is_private else 'Public'})")
        except ValueError:
            print(f"  ❌ {ip} -> Invalid")
    
    print()

def test_subnet_calculation():
    """Test subnet calculation functionality"""
    print("🧮 Testing Subnet Calculation...")
    
    test_networks = [
        "192.168.1.0/24",
        "10.0.0.0/16", 
        "172.16.0.0/12",
        "192.168.1.0/30",
        "invalid/24"
    ]
    
    for network in test_networks:
        try:
            net = ipaddress.ip_network(network, strict=False)
            print(f"  ✅ {network}:")
            print(f"     Network: {net.network_address}")
            print(f"     Broadcast: {net.broadcast_address}")
            print(f"     Netmask: {net.netmask}")
            print(f"     Hosts: {net.num_addresses}")
        except ValueError:
            print(f"  ❌ {network} -> Invalid network")
    
    print()

def test_database_operations():
    """Test database operations"""
    print("📝 Testing Database Operations...")
    
    import sqlite3
    import os
    
    # Tạo test database
    test_db = "test_ip_manager.db"
    
    try:
        conn = sqlite3.connect(test_db)
        cursor = conn.cursor()
        
        # Tạo bảng
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ip_addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Test insert
        cursor.execute('INSERT INTO ip_addresses (ip_address, description) VALUES (?, ?)', 
                      ('192.168.1.1', 'Test IP'))
        
        # Test select
        cursor.execute('SELECT * FROM ip_addresses')
        rows = cursor.fetchall()
        
        if rows:
            print(f"  ✅ Database operations working - Found {len(rows)} record(s)")
        else:
            print("  ❌ Database operations failed - No records found")
        
        conn.commit()
        conn.close()
        
        # Cleanup
        if os.path.exists(test_db):
            os.remove(test_db)
            
    except Exception as e:
        print(f"  ❌ Database error: {e}")
    
    print()

def main():
    """Main test function"""
    print("🚀 IP Address Manager - Test Suite")
    print("=" * 50)
    
    test_ip_validation()
    test_subnet_calculation()
    test_database_operations()
    
    print("✅ All tests completed!")
    print("\n📋 Demo Features Summary:")
    print("  🔍 IP Validation (IPv4/IPv6)")
    print("  🧮 Subnet Calculation") 
    print("  📝 IP Address Management")
    print("  🐳 Docker Containerization")
    print("  🌐 Web Interface")
    
    print("\n🚀 To run the demo:")
    print("  1. docker-compose up --build")
    print("  2. Open http://localhost:5000")

if __name__ == "__main__":
    main()
