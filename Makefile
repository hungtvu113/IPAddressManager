# IP Programming Docker Makefile
# Sử dụng: make <command>

.PHONY: help build up down logs restart status health clean dev prod

# Default target
help:
	@echo "IP Programming Docker Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev      - Chạy ở chế độ development"
	@echo "  make build    - Build Docker images"
	@echo ""
	@echo "Production:"
	@echo "  make up       - Khởi động services"
	@echo "  make down     - Dừng services"
	@echo "  make restart  - Khởi động lại services"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs     - Xem logs"
	@echo "  make status   - Xem trạng thái containers"
	@echo "  make health   - Kiểm tra health"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean    - Dọn dẹp containers và images"
	@echo "  make reset    - Reset hoàn toàn"

# Development
dev:
	@echo "🚀 Khởi động development mode..."
	docker-compose -f docker-compose.dev.yml up -d --build

# Build images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build --no-cache

# Production
up:
	@echo "🚀 Khởi động production services..."
	docker-compose up -d --build

down:
	@echo "🛑 Dừng tất cả services..."
	docker-compose down

restart:
	@echo "🔄 Khởi động lại services..."
	docker-compose restart

# Monitoring
logs:
	@echo "📋 Hiển thị logs..."
	docker-compose logs -f

status:
	@echo "📊 Trạng thái containers:"
	docker-compose ps

health:
	@echo "🏥 Kiểm tra health..."
	@docker-compose ps | grep "Up" && echo "✅ Containers đang chạy" || echo "❌ Có containers không chạy"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Ứng dụng hoạt động" || echo "❌ Ứng dụng không phản hồi"

# Maintenance
clean:
	@echo "🧹 Dọn dẹp containers và images..."
	docker-compose down --remove-orphans
	docker system prune -f
	docker volume prune -f

reset: clean
	@echo "🔄 Reset hoàn toàn..."
	docker-compose down -v --remove-orphans
	docker system prune -a -f
	docker volume prune -f

# Quick commands
install: build up

deploy: up

stop: down
