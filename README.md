# Hướng dẫn khởi chạy phần mềm Quản lý Học phí

Chào mừng bạn! Dưới đây là cách đơn giản nhất để bắt đầu sử dụng phần mềm.

## 1. Yêu cầu duy nhất
Máy tính của bạn cần cài đặt sẵn **Docker Desktop**.

## 2. Các bước khởi chạy
1. Mở thư mục dự án này trên máy tính.
2. Mở cửa sổ dòng lệnh (Terminal hoặc CMD) tại đây.
3. Gõ lệnh duy nhất sau rồi ấn Enter:
   ```bash
   docker compose up --build -d
   ```
4. Chờ một lát để hệ thống tự động thiết lập mọi thứ.

## 3. Cách truy cập
Sau khi lệnh trên chạy xong, bạn mở trình duyệt web (Chrome, Edge...) và truy cập vào các địa chỉ sau:

*   **Trang quản lý (Giao diện):** [http://localhost:5173](http://localhost:5173)
*   **Hệ thống xử lý (Máy chủ):** [http://localhost:3000](http://localhost:3000)

## 4. Để dừng phần mềm
Khi không dùng nữa, bạn gõ lệnh sau:
```bash
docker compose down
```

---
*Chúc bạn làm việc hiệu quả!*
