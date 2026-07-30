# 🐳 3 Task cuối cùng của Giai đoạn 1: Docker

> Hướng dẫn chi tiết cho 3 việc còn lại trong checklist Giai đoạn 1:
> 1. Push image lên Docker Hub
> 2. Viết Dockerfile tối ưu < 200MB
> 3. Hiểu sự khác nhau giữa `CMD` và `ENTRYPOINT`

---

## 📦 Task 1: Push image lên Docker Hub

### Tại sao cần Docker Hub?

Docker Hub giống như **GitHub nhưng cho Docker image**. Khi bạn build image trên máy mình, image chỉ tồn tại local. Để:
- Server khác (EC2, K8s) **kéo về** chạy → cần một nơi lưu trữ chung
- Đồng đội cùng dùng version giống nhau
- CI/CD push image sau khi build xong

→ Docker Hub là registry phổ biến nhất, có gói miễn phí 1 private repo + unlimited public.

### Bước 1: Đăng ký tài khoản Docker Hub

Vào https://hub.docker.com → Sign Up. Nhớ username (vd: `nhannguyen`).

### Bước 2: Login từ terminal

```bash
docker login
# Username: nhannguyen
# Password: ********
```

> Trên Windows nếu báo lỗi `error storing credentials` thì sửa file `~/.docker/config.json`, đổi `"credsStore": "desktop"` thành `"credsStore": ""`.

### Bước 3: Xem image hiện có trên máy

```bash
docker images
```

Bạn sẽ thấy đại loại:
```
REPOSITORY              TAG       IMAGE ID       SIZE
booking-backend-app     latest    abc123def456   245MB
booking-frontend-app    latest    789abc012def   60MB
```

> Tên image phụ thuộc vào tên thư mục. Compose tạo theo format `<thư-mục>_<service>` hoặc `<thư-mục>-<service>`.

### Bước 4: Tag image theo chuẩn Docker Hub

Chuẩn tên image trên Docker Hub là: **`<username>/<repo>:<tag>`**

```bash
# Format: docker tag <tên-cũ> <username>/<tên-mới>:<version>

docker tag booking-backend-app nhannguyen/booking-backend:v1
docker tag booking-frontend-app nhannguyen/booking-frontend:v1

# Tag thêm "latest" để pull mặc định
docker tag booking-backend-app nhannguyen/booking-backend:latest
docker tag booking-frontend-app nhannguyen/booking-frontend:latest
```

> **Tip:** dùng `docker tag` không thực sự copy image, chỉ là tạo "alias" trỏ vào cùng image ID. Image gốc và image mới có cùng IMAGE ID.

### Bước 5: Push lên

```bash
docker push nhannguyen/booking-backend:v1
docker push nhannguyen/booking-backend:latest
docker push nhannguyen/booking-frontend:v1
docker push nhannguyen/booking-frontend:latest
```

Lần đầu push sẽ chậm vì phải upload tất cả layer. Lần 2 trở đi chỉ push layer **đã thay đổi** (Docker thông minh).

### Bước 6: Verify

Vào https://hub.docker.com → Repositories → bạn sẽ thấy 2 repo mới.

Test pull về (xóa local trước):
```bash
docker rmi nhannguyen/booking-backend:v1
docker pull nhannguyen/booking-backend:v1
```

### Quy ước đặt tag chuẩn industry

| Tag | Khi nào dùng |
| --- | ------------ |
| `latest` | Bản mới nhất ổn định (không khuyên dùng cho production) |
| `v1.0.0` | Semantic versioning, chuẩn nhất |
| `1.0.0-alpine` | Variant theo OS |
| `commit-abc123` | Tag theo Git SHA, dùng trong CI/CD |
| `dev`, `staging`, `prod` | Theo môi trường |

**Anti-pattern:** chỉ dùng `latest` trong production. Lý do: không reproducible — bạn không biết chính xác version nào đang chạy.

---

## 🪶 Task 2: Viết Dockerfile tối ưu < 200MB cho backend

### Tại sao cần tối ưu?

| Image to | Image nhỏ |
| -------- | --------- |
| Push/pull chậm | Deploy nhanh |
| Tốn dung lượng registry | Tiết kiệm chi phí |
| Tải nhiều dependency thừa | Bề mặt tấn công nhỏ (security) |
| Container start chậm | Auto-scale phản ứng nhanh |

Nguyên tắc cốt lõi: **chỉ giữ lại đúng những gì runtime cần**.

### Đo image hiện tại

```bash
docker images | grep booking-backend
```

Hiện tại Dockerfile của bạn (`backend/Dockerfile`) tạo image khoảng **240-280MB**. Mục tiêu: dưới 200MB.

### 4 kỹ thuật tối ưu

#### 1. Dùng base image nhỏ
- `node:20` → ~1.1GB ❌
- `node:20-slim` → ~240MB
- `node:20-alpine` → ~180MB ✅
- `gcr.io/distroless/nodejs20` → ~150MB ✅✅ (production grade)

#### 2. Multi-stage build
Tách giai đoạn build và runtime — image cuối không chứa build tools.

#### 3. Chỉ cài production dependencies
- `npm install` → cài cả `devDependencies` (nodemon, eslint, jest...)
- `npm ci --omit=dev` → chỉ cài deps cần thiết → giảm ~50-100MB

#### 4. Tận dụng Docker layer cache
Copy `package.json` **trước**, `RUN npm ci`, rồi mới copy source. Khi chỉ sửa code, layer `npm ci` không bị invalidate → build siêu nhanh.

### Dockerfile production tối ưu

Sửa file `backend/Dockerfile.prod` thành:

```dockerfile
# syntax=docker/dockerfile:1.7

# ============================================================
# Stage 1: Cài dependencies production
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package.json package-lock.json ./

# npm ci nhanh và deterministic hơn npm install
# --omit=dev: bỏ devDependencies (nodemon...)
RUN npm ci --omit=dev && npm cache clean --force

# ============================================================
# Stage 2: Runtime - image nhẹ
# ============================================================
FROM node:20-alpine AS runtime
WORKDIR /app

# Dumb-init xử lý signal đúng cách (Ctrl+C, docker stop)
RUN apk add --no-cache dumb-init

# Tạo user non-root cho bảo mật
RUN addgroup -S app && adduser -S app -G app

# Copy node_modules từ stage deps (đã loại dev deps)
COPY --from=deps --chown=app:app /app/node_modules ./node_modules

# Copy source code
COPY --chown=app:app . .

# Chạy bằng user không có quyền root
USER app

# Khai báo port (chỉ là document, không tự mở)
EXPOSE 5001

# Set env mặc định
ENV NODE_ENV=production

# ENTRYPOINT + CMD: dumb-init làm PID 1, node là process con
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
```

### Build và đo size

```bash
# Build từ Dockerfile.prod
docker build -f backend/Dockerfile.prod -t booking-backend:prod backend/

# Đo size
docker images booking-backend:prod
```

Kết quả mong đợi: **~150-180MB** ✅

### So sánh trước/sau

```bash
# Build cả 2 để so sánh
docker build -f backend/Dockerfile -t booking-backend:dev backend/
docker build -f backend/Dockerfile.prod -t booking-backend:prod backend/

docker images | grep booking-backend
```

Sẽ thấy đại loại:
```
booking-backend   prod   180MB    ← gọn nhẹ
booking-backend   dev    285MB    ← béo hơn nhiều
```

### Bonus: Phân tích layer

```bash
docker history booking-backend:prod
```

Lệnh này hiện size của TỪNG layer. Bạn sẽ thấy `node_modules` thường là layer to nhất.

Hoặc dùng tool **`dive`** (https://github.com/wagoodman/dive):
```bash
dive booking-backend:prod
```
→ Giao diện đẹp như Total Commander, xem được file nào tốn dung lượng.

### Update `docker-compose.yml` để dùng Dockerfile.prod

```yaml
backend-app:
  build:
    context: ./backend
    dockerfile: Dockerfile.prod   # 👈 đổi thành Dockerfile.prod
  # ... các config khác
```

---

## 🎯 Task 3: Phân biệt CMD và ENTRYPOINT

Đây là **câu hỏi phỏng vấn DevOps kinh điển**. Hai chỉ thị trông giống nhau nhưng vai trò khác hẳn.

### Định nghĩa ngắn gọn

| Chỉ thị | Vai trò |
| ------- | ------- |
| `ENTRYPOINT` | "Tên" của container — nó **luôn chạy**, không thể bị bỏ qua |
| `CMD` | "Tham số mặc định" cho ENTRYPOINT — có thể **override** từ command line |

### Cách Docker thực sự gọi

Khi bạn `docker run`, Docker chạy lệnh thực tế là:
```
[ENTRYPOINT] [CMD]
```

Nếu bạn truyền thêm tham số khi `docker run`:
```
docker run my-image arg1 arg2
```
→ `arg1 arg2` **thay thế** `CMD`, **không** thay thế `ENTRYPOINT`.

### So sánh thực tế

#### Ví dụ 1: Chỉ có CMD

```dockerfile
FROM alpine
CMD ["echo", "Hello"]
```

```bash
docker run myimg                  # → "Hello"
docker run myimg echo "Bye"       # → "Bye"   (CMD bị override hoàn toàn)
docker run myimg ls /             # → liệt kê file (chạy ls thay vì echo)
```

→ Linh hoạt nhưng **dễ bị "phá"** khi user truyền nhầm.

#### Ví dụ 2: Chỉ có ENTRYPOINT

```dockerfile
FROM alpine
ENTRYPOINT ["echo", "Hello"]
```

```bash
docker run myimg                  # → "Hello"
docker run myimg "Bye"            # → "Hello Bye"   (Bye được gắn thêm vào sau)
docker run myimg ls /             # → "Hello ls /"  (ls không chạy được)
```

→ Container "đóng vai" lệnh `echo` cố định.

#### Ví dụ 3: Kết hợp (BEST PRACTICE)

```dockerfile
FROM alpine
ENTRYPOINT ["echo", "Hello"]
CMD ["World"]
```

```bash
docker run myimg                  # → "Hello World"
docker run myimg "Vietnam"        # → "Hello Vietnam"  (CMD được override)
```

→ Container có "behavior cố định" (echo) nhưng "tham số mặc định" có thể đổi.

### Áp dụng vào dự án Booking

Dockerfile hiện tại của bạn:
```dockerfile
CMD ["npm", "start"]
```

→ Có thể chạy `docker run booking-backend bash` để vào shell debug, **bypass** npm start.
→ Tốt cho dev, không tốt cho prod.

Dockerfile production tốt hơn:
```dockerfile
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
```

→ `dumb-init` luôn là PID 1 (xử lý signal đúng), không thể bypass.
→ Mặc định chạy server, nhưng có thể `docker run booking-backend node debug.js` để chạy script khác (CMD bị override).

### 2 cú pháp cần phân biệt

#### Exec form (KHUYẾN KHÍCH) - dùng JSON array
```dockerfile
CMD ["node", "src/server.js"]
ENTRYPOINT ["dumb-init", "--"]
```
- Chạy trực tiếp binary, không qua shell
- Signal (Ctrl+C, SIGTERM) đến đúng process Node
- **Phải dùng dấu "" (kép), không dùng '' (đơn)** — JSON yêu cầu dấu kép

#### Shell form - dùng string
```dockerfile
CMD node src/server.js
```
- Bị Docker tự động bọc thành `/bin/sh -c "node src/server.js"`
- → Process Node là **con** của shell, signal không đến được
- → `docker stop` phải đợi 10 giây timeout rồi force kill
- **Tránh dùng** trừ khi bạn cần shell features (pipe, env expansion)

### Rule of thumb

| Tình huống | Dùng |
| ---------- | ---- |
| Container chạy 1 app cố định (web server, daemon) | `ENTRYPOINT ["app"] + CMD ["default-args"]` |
| Image như công cụ CLI (như `node:alpine` để chạy script bất kỳ) | Chỉ `CMD` |
| Image utility chạy 1 lệnh duy nhất | Chỉ `ENTRYPOINT` |
| Cho phép override hoàn toàn | Chỉ `CMD` |
| Bảo vệ behavior, không cho user tự do | Có `ENTRYPOINT` |

### 3 dạng câu hỏi phỏng vấn hay gặp

**Q1:** "CMD và ENTRYPOINT khác nhau thế nào?"
**A:** ENTRYPOINT là lệnh chính bắt buộc chạy, CMD là tham số mặc định có thể override. Khi cả hai có mặt, Docker chạy lệnh `ENTRYPOINT + CMD`.

**Q2:** "Tại sao dùng exec form thay vì shell form?"
**A:** Exec form chạy binary trực tiếp làm PID 1, nhận được signal từ Docker (như SIGTERM khi `docker stop`). Shell form bọc qua `/bin/sh -c`, signal không truyền tới app → graceful shutdown không hoạt động.

**Q3:** "PID 1 vấn đề là gì?"
**A:** Trong Linux, PID 1 chịu trách nhiệm reap zombie process và xử lý signal. Node.js không được thiết kế làm PID 1 → bug. Giải pháp: dùng `dumb-init` hoặc `tini` làm PID 1, app chạy như con.

---

## ✅ Checklist hoàn thành Giai đoạn 1

Sau khi xong 3 task này, bạn nên đánh dấu:

- [ ] Đã có tài khoản Docker Hub và push được image
- [ ] Đã dùng `docker tag` và hiểu cấu trúc tên image
- [ ] Đã viết `Dockerfile.prod` multi-stage và đo được image < 200MB
- [ ] Đã so sánh size trước/sau bằng `docker images`
- [ ] Hiểu rõ khi nào dùng CMD, khi nào dùng ENTRYPOINT, khi nào kết hợp
- [ ] Hiểu sự khác biệt exec form vs shell form

Sau bước này, bạn đã sẵn sàng cho **Giai đoạn 2: Git workflow + GitHub** rồi đó.
