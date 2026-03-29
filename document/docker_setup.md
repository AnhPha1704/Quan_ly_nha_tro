# Tài liệu Hướng dẫn Đóng gói và Triển khai với Docker

Tài liệu này chi tiết cách hệ thống Quản lý Nhà trọ được đóng gói thành các Container riêng biệt sử dụng Docker Compose, tuân thủ đúng yêu cầu của đồ án.

## 1. Kiến trúc Hệ thống (Architecture)

Hệ thống được chia thành 3 container (dịch vụ) hoạt động độc lập nhưng có sự liên kết chặt chẽ:

| Container | Vai trò | Công nghệ |
| :--- | :--- | :--- |
| **`app` (nextjs-app)** | Xử lý logic ứng dụng và render giao diện. | Next.js (Node.js) |
| **`web` (nginx-proxy)** | Máy chủ Web điều phối yêu cầu (Reverse Proxy). | Nginx Alpine |
| **`db` (postgres-db)** | Cơ sở dữ liệu lưu trữ thông tin nhà trọ. | PostgreSQL 15 |

---

## 2. Chi tiết các thành phần đóng gói

### 2.1. Container Ứng dụng (App)
Mã nguồn Next.js được đóng gói bằng **Dockerfile** sử dụng cơ chế **Multi-stage build** để tối ưu dung lượng ảnh (image):
- **Giai đoạn 1 (deps)**: Cài đặt các thư viện cần thiết.
- **Giai đoạn 2 (builder)**: Biên dịch mã nguồn (Build) sang dạng tĩnh.
- **Giai đoạn 3 (runner)**: Chạy ứng dụng trong môi trường tối giản (Alpine) với chế độ `standalone`.

### 2.2. Container Web Server (Nginx)
Nginx được cấu hình trong tệp `nginx.conf` đóng vai trò là "cổng vào" duy nhất của hệ thống:
- Tiếp nhận yêu cầu từ trình duyệt ở cổng 80.
- Chuyển tiếp (Proxy) các yêu cầu đến container `app` ở cổng 3000.
- Cấu hình nén Gzip để tăng tốc độ tải trang.
- Quản lý bộ nhớ đệm (Cache) cho các file tĩnh của Next.js.

### 2.3. Container Cơ sở dữ liệu (Database)
Sử dụng PostgreSQL 15 để đảm bảo hiệu suất và tính bảo mật:
- Dữ liệu được lưu trữ trong **Docker Volumes** (`postgres_data`) để đảm bảo không bị mất khi container bị xóa hoặc khởi động lại.
- Chỉ cho phép kết nối nội bộ từ container `app` qua mạng Docker.

---

## 3. Hướng dẫn Triển khai

### Bước 1: Chuẩn bị môi trường
Đảm bảo máy tính của bạn đã cài đặt **Docker Desktop**.

### Bước 2: Khởi động hệ thống
Mở terminal tại thư mục gốc của dự án và chạy lệnh:
```bash
docker-compose up -d --build
```
Lệnh này sẽ:
1. Xây dựng image cho ứng dụng Next.js.
2. Tải các image Nginx và PostgreSQL từ Docker Hub.
3. Khởi tạo mạng nội bộ (`app-network`) để các container giao tiếp với nhau.
4. Chạy toàn bộ hệ thống dưới chế độ chạy ngầm (`-d`).

### Bước 3: Truy cập ứng dụng
Sau khi hệ thống khởi động xong:
- Truy cập ứng dụng tại: `http://localhost` (Cổng mặc định của Nginx).
- Cơ sở dữ liệu có thể truy cập nội bộ tại cổng `5432`.

---

## 4. Các lệnh quản lý hữu ích

- **Xem trạng thái các container**: `docker-compose ps`
- **Xem log của hệ thống**: `docker-compose logs -f`
- **Dừng hệ thống**: `docker-compose down`
- **Cập nhật lại mã nguồn**: `docker-compose up -d --build app`

> [!IMPORTANT]
> Toàn bộ quá trình triển khai này hoàn toàn tự động hóa. Bạn không cần cài đặt Node.js hay PostgreSQL trực tiếp trên máy thật, mọi thứ đều chạy cô lập và an toàn bên trong Docker.
