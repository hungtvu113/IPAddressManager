@echo off
REM IP Programming Docker Deployment Script for Windows
REM Tác giả: IP Programming Team
REM Mô tả: Script tự động deploy ứng dụng IP Programming với Docker

setlocal enabledelayedexpansion

REM Colors (limited in Windows CMD)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Functions
:print_info
echo %INFO% %~1
goto :eof

:print_success
echo %SUCCESS% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

REM Check if Docker is installed
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker chưa được cài đặt. Vui lòng cài đặt Docker Desktop trước."
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker Compose chưa được cài đặt. Vui lòng cài đặt Docker Compose trước."
    exit /b 1
)

call :print_success "Docker và Docker Compose đã sẵn sàng"
goto :eof

REM Build and deploy
:deploy
call :print_info "Bắt đầu deployment IP Programming..."

REM Stop existing containers
call :print_info "Dừng các container hiện tại..."
docker-compose down --remove-orphans

REM Remove old images (optional)
call :print_info "Xóa images cũ..."
docker image prune -f

REM Build new images
call :print_info "Build Docker images..."
docker-compose build --no-cache

REM Start services
call :print_info "Khởi động services..."
docker-compose up -d

REM Wait for services to be ready
call :print_info "Đợi services khởi động..."
timeout /t 10 /nobreak >nul

REM Check health
call :check_health
goto :eof

REM Check application health
:check_health
call :print_info "Kiểm tra tình trạng ứng dụng..."

REM Check if containers are running
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    call :print_error "Có containers không chạy được"
    docker-compose logs
    exit /b 1
) else (
    call :print_success "Containers đang chạy"
)

REM Wait a bit more
timeout /t 5 /nobreak >nul

REM Check application response
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    call :print_warning "Ứng dụng có thể chưa sẵn sàng, vui lòng kiểm tra logs"
) else (
    call :print_success "Ứng dụng đang hoạt động tại http://localhost:3000"
)

REM Check nginx (if enabled)
curl -f http://localhost >nul 2>&1
if errorlevel 1 (
    call :print_info "Nginx không được cấu hình hoặc chưa sẵn sàng"
) else (
    call :print_success "Nginx reverse proxy đang hoạt động tại http://localhost"
)
goto :eof

REM Show logs
:show_logs
call :print_info "Hiển thị logs..."
docker-compose logs -f
goto :eof

REM Stop services
:stop
call :print_info "Dừng tất cả services..."
docker-compose down
call :print_success "Đã dừng tất cả services"
goto :eof

REM Restart services
:restart
call :print_info "Khởi động lại services..."
docker-compose restart
call :check_health
goto :eof

REM Show status
:status
call :print_info "Trạng thái services:"
docker-compose ps
goto :eof

REM Main script
if "%1"=="deploy" (
    call :check_docker
    call :deploy
) else if "%1"=="logs" (
    call :show_logs
) else if "%1"=="stop" (
    call :stop
) else if "%1"=="restart" (
    call :restart
) else if "%1"=="status" (
    call :status
) else if "%1"=="health" (
    call :check_health
) else (
    echo Sử dụng: %0 {deploy^|logs^|stop^|restart^|status^|health}
    echo.
    echo Các lệnh:
    echo   deploy  - Build và deploy ứng dụng
    echo   logs    - Xem logs của ứng dụng
    echo   stop    - Dừng tất cả services
    echo   restart - Khởi động lại services
    echo   status  - Xem trạng thái services
    echo   health  - Kiểm tra tình trạng ứng dụng
    exit /b 1
)
