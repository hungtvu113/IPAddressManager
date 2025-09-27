# Sử dụng Python 3.9 slim image
FROM python:3.9-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy requirements và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ source code
COPY . .

# Tạo thư mục cho database
RUN mkdir -p /app/data

# Expose port 5000
EXPOSE 5000

# Thiết lập environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Chạy ứng dụng
CMD ["python", "app.py"]
