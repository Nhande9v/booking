**Bước 1: Tạo file Dockerfile**

**Ngay tại thư mục booking này, bạn hãy tạo một file mới tên là Dockerfile (lưu ý: viết hoa chữ D, không có đuôi mở rộng như .txt hay .js). tạo trong frontend**

**Dán toàn bộ nội dung cấu hình chuẩn và tối ưu dưới đây vào file:**



\# Step 1: Build ứng dụng React với Node.js

FROM node:20-alpine AS build



WORKDIR /app



\# Copy package.json và cài đặt dependencies trước để tận dụng Docker cache

COPY package\*.json ./

RUN npm install



\# Copy toàn bộ source code và build ra thư mục tĩnh (dist hoặc build)

COPY . .

RUN npm run build



\# Step 2: Dùng Nginx gọn nhẹ để phục vụ các file tĩnh sau khi build

FROM nginx:alpine



\# Copy các file đã build từ Step 1 sang thư mục gốc của Nginx

\# Lưu ý: Thay "dist" thành "build" nếu dự án của bạn dùng Create React App cũ thay vì Vite

COPY --from=build /app/dist /usr/share/nginx/html



\# Mở cổng 80 của Nginx

EXPOSE 80



\# Chạy Nginx

CMD \["nginx", "-g", "daemon off;"]



**Bước 2: Tạo file .dockerignore trong frontend**

**Tạo thêm một file tên là .dockerignore ngay cạnh file Dockerfile. File này giúp Docker bỏ qua những thư mục nặng không cần thiết khi đóng gói (giống như .gitignore)**

node\_modules

.git

build

dist

.env

**Bước 3: Build "Image" cho app Booking**

**Quay lại cửa sổ Git Bash hiện tại của bạn, gõ lệnh sau để đóng gói app (đừng quên dấu chấm . ở cuối lệnh nhé):**

Vào git bash

docker build -t booking-app .



Quá trình này sẽ mất khoảng 1-2 phút ở lần đầu tiên vì Docker cần tải Node.js, Nginx và cài đặt các thư viện npm install của bạn.



**/////////////////////////** 
đến lượt backend

**Bước 1: Tạo Dockerfile cho thư mục Backend**

**Bạn mở VS Code lên, bấm vào thư mục backend và tạo một file mới tên là Dockerfile nằm ngay trong đó (cùng cấp với package.json của backend).**



Dán đoạn cấu hình chuẩn dành cho Node.js/Express này vào:

FROM node:20-alpine



WORKDIR /app



\# Copy package.json và cài đặt thư viện trước

COPY package\*.json ./

RUN npm install



\# Copy toàn bộ mã nguồn backend vào container

COPY . .



\# Mở cổng mà backend của bạn đang chạy (ví dụ: 5000)

\# Bạn hãy kiểm tra file index.js/server.js xem app.listen(PORT) đang là cổng bao nhiêu nhé

EXPOSE 5000



\# Lệnh khởi chạy server backend

CMD \["npm", "start"]



**Bạn tạo thêm một file .dockerignore ngay trong thư mục backend luôn để bỏ qua node\_modules giống như lúc nãy nhé:**



node\_modules

.git

.env



**Bước 2: Tạo "Nhạc Trưởng" docker-compose.yml**

**Bây giờ, bạn hãy quay trở ra thư mục gốc booking (nơi chứa cả 2 thư mục con frontend và backend). Tạo một file tên là: docker-compose.yml.**



**File này sẽ đóng vai trò như một bản thiết kế tổng thể, ra lệnh cho Docker biết cách build và liên kết cả 2 container lại với nhau:**



version: '3.8'



services:

&#x20; # --- Cấu hình cho phần Backend ---

&#x20; backend-app:

&#x20;   build:

&#x20;     context: ./backend

&#x20;     dockerfile: Dockerfile

&#x20;   container\_name: booking-backend

&#x20;   ports:

&#x20;     - "5000:5000" # Map cổng 5000 từ máy thật vào cổng 5000 của container

&#x20;   restart: always



&#x20; # --- Cấu hình cho phần Frontend ---

&#x20; frontend-app:

&#x20;   build:

&#x20;     context: ./frontend

&#x20;     dockerfile: Dockerfile

&#x20;   container\_name: booking-frontend

&#x20;   ports:

&#x20;     - "3000:80" # Map cổng 3000 từ máy thật vào cổng 80 (Nginx) của container

&#x20;   restart: always

&#x20;   depends\_on:

&#x20;     - backend-app # Ép Docker phải bật Backend lên chạy trước rồi mới bật Frontend sau



**Bước 3: Khởi Chạy Toàn Bộ Hệ Thống Với 1 Lệnh Duy Nhất**

**Bây giờ, bạn dùng Terminal quay trở lại thư mục gốc booking (gõ cd .. nếu đang đứng ở thư mục frontend).**



docker compose up --build -d



up: Bật tất cả các dịch vụ (services) được định nghĩa trong file yaml lên.



\--build: Ép Docker quét lại code và build mới Image cho cả frontend lẫn backend (để đảm bảo cập nhật Dockerfile mới).



\-d: Chạy ngầm ở phông nền để không bị khóa màn hình Terminal.


**////THDB
Tạo theem file nginx.conf trong frontend bởi vì khi mà chạy npm rund dev trong máy thì development còn trong docker nó sẽ chạy npm run build là production**

server {

&#x20;   listen 80;

&#x20;   

&#x20;   location / {

&#x20;       root /usr/share/nginx/html;

&#x20;       index index.html index.htm;

&#x20;       try\_files $uri $uri/ /index.html;

&#x20;   }



&#x20;   # Cấu hình Proxy để chuyển tiếp API sang container backend

&#x20;   location /api/ {

&#x20;       proxy\_pass http://booking-backend:5001; # Trỏ thẳng vào tên container backend trong Docker

&#x20;       proxy\_http\_version 1.1;

&#x20;       proxy\_set\_header Upgrade $http\_upgrade;

&#x20;       proxy\_set\_header Connection 'upgrade';

&#x20;       proxy\_set\_header Host $host;

&#x20;       proxy\_cache\_bypass $http\_upgrade;

&#x20;   }

}

