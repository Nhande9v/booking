FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài đặt thư viện trước
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn backend vào container
COPY . .

# Mở cổng mà backend của bạn đang chạy (ví dụ: 5000)
# Bạn hãy kiểm tra file index.js/server.js xem app.listen(PORT) đang là cổng bao nhiêu nhé
EXPOSE 5001

# Lệnh khởi chạy server backend
CMD ["npm", "start"]