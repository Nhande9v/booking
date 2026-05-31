# Step 1: Build ứng dụng React với Node.js
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json và cài đặt dependencies trước để tận dụng Docker cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code và build ra thư mục tĩnh (dist hoặc build)
COPY . .
RUN npm run build

# Step 2: Dùng Nginx gọn nhẹ để phục vụ các file tĩnh sau khi build
FROM nginx:alpine

# Copy các file đã build từ Step 1 sang thư mục gốc của Nginx
# Lưu ý: Thay "dist" thành "build" nếu dự án của bạn dùng Create React App cũ thay vì Vite
COPY --from=build /app/dist /usr/share/nginx/html
# Thêm dòng này để thay thế file config mặc định của Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Mở cổng 80 của Nginx
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]