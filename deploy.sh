#!/bin/bash

# IP Programming Docker Deployment Script
# Tác giả: IP Programming Team
# Mô tả: Script tự động deploy ứng dụng IP Programming với Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker chưa được cài đặt. Vui lòng cài đặt Docker trước."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước."
        exit 1
    fi
    
    print_success "Docker và Docker Compose đã sẵn sàng"
}

# Build and deploy
deploy() {
    print_info "Bắt đầu deployment IP Programming..."
    
    # Stop existing containers
    print_info "Dừng các container hiện tại..."
    docker-compose down --remove-orphans || true
    
    # Remove old images (optional)
    print_info "Xóa images cũ..."
    docker image prune -f || true
    
    # Build new images
    print_info "Build Docker images..."
    docker-compose build --no-cache
    
    # Start services
    print_info "Khởi động services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_info "Đợi services khởi động..."
    sleep 10
    
    # Check health
    check_health
}

# Check application health
check_health() {
    print_info "Kiểm tra tình trạng ứng dụng..."
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Containers đang chạy"
    else
        print_error "Có containers không chạy được"
        docker-compose logs
        exit 1
    fi
    
    # Check application response
    sleep 5
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Ứng dụng đang hoạt động tại http://localhost:3000"
    else
        print_warning "Ứng dụng có thể chưa sẵn sàng, vui lòng kiểm tra logs"
    fi
    
    # Check nginx (if enabled)
    if curl -f http://localhost > /dev/null 2>&1; then
        print_success "Nginx reverse proxy đang hoạt động tại http://localhost"
    else
        print_info "Nginx không được cấu hình hoặc chưa sẵn sàng"
    fi
}

# Show logs
show_logs() {
    print_info "Hiển thị logs..."
    docker-compose logs -f
}

# Stop services
stop() {
    print_info "Dừng tất cả services..."
    docker-compose down
    print_success "Đã dừng tất cả services"
}

# Restart services
restart() {
    print_info "Khởi động lại services..."
    docker-compose restart
    check_health
}

# Show status
status() {
    print_info "Trạng thái services:"
    docker-compose ps
}

# Main script
case "$1" in
    "deploy")
        check_docker
        deploy
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "status")
        status
        ;;
    "health")
        check_health
        ;;
    *)
        echo "Sử dụng: $0 {deploy|logs|stop|restart|status|health}"
        echo ""
        echo "Các lệnh:"
        echo "  deploy  - Build và deploy ứng dụng"
        echo "  logs    - Xem logs của ứng dụng"
        echo "  stop    - Dừng tất cả services"
        echo "  restart - Khởi động lại services"
        echo "  status  - Xem trạng thái services"
        echo "  health  - Kiểm tra tình trạng ứng dụng"
        exit 1
        ;;
esac
