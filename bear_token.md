# Tổng quan flow token và Bearer trong dự án

## 1) File quan trọng

- `backend/src/controllers/authController.js`  
  Nơi tạo JWT khi login, và xử lý reset-password.

- `backend/src/utils/verifyToken.js`  
  Middleware bắt buộc xác thực token.

- `backend/src/utils/optionalVerifyToken.js`  
  Middleware xác thực tùy chọn, cho route công khai nhưng có thể biết user nếu đã login.

- `backend/src/utils/verifyProvider.js`  
  Kiểm tra user có role provider/admin hay không.

- `backend/src/utils/verifyAdmin.js`  
  Kiểm tra user có role admin không.

- `backend/src/server.js`  
  Cấu hình CORS, cookie parser, mount routes.

- `backend/src/routes/authRouters.js`  
  Định nghĩa route auth.

- `frontend/src/lib/axios.js`  
  Gắn header Authorization cho mọi request từ frontend.

- `frontend/src/pages/Login.jsx`  
  Xử lý login và lưu token vào localStorage.

- `frontend/src/context/AuthContext.jsx`  
  Quản lý state user và lưu user vào localStorage.

---

## 2) Flow login sinh token

Trong `backend/src/controllers/authController.js`, khi user login:

- backend tìm user theo username
- kiểm tra password bằng bcrypt
- nếu đúng thì gọi:

```js
jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
)
```

- trả về response JSON chứa `token`
- đồng thời set cookie `access_token`

Nội dung quan trọng:

- token chứa payload: `id` và `role`
- thời hạn: 7 ngày
- chữ ký: `JWT_SECRET`

Ví dụ format token:

```http
Authorization: Bearer <jwt_token>
```

---

## 3) Flow frontend gửi Bearer token

Trong `frontend/src/lib/axios.js`, axios interceptor làm việc như sau:

```js
const token = localStorage.getItem("token");
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

Nói cách khác, mọi request từ frontend sẽ tự động có header:

```http
Authorization: Bearer xxx
```

Đây là cách "Bearer token" được gửi lên server.

---

## 4) Flow backend kiểm tra token

Trong `backend/src/utils/verifyToken.js`, middleware chạy theo thứ tự:

1. Lấy header `Authorization`
2. Tách ra phần token:
   - Header dạng `Authorization: Bearer abc123`
   - code lấy `abc123`
3. Nếu không có header thì kiểm tra cookie `access_token`
4. Nếu không có token nào => trả 401
5. `jwt.verify(token, process.env.JWT_SECRET)`
6. Nếu token hợp lệ:
   - gán `req.user = user`
   - `next()`
7. Nếu token sai/hết hạn:
   - trả 403

Điểm quan trọng: đây là middleware bắt buộc cho route cần login.

---

## 5) Flow route cần quyền provider/admin

Sau khi `verifyToken` chạy xong, `req.user` đã có:

- `req.user.id`
- `req.user.role`

Các file:

- `backend/src/utils/verifyProvider.js`
- `backend/src/utils/verifyAdmin.js`

chỉ kiểm tra `req.user.role`:

- `provider` hoặc `admin` được vào route provider
- `admin` mới vào route admin

Ví dụ route trong `backend/src/routes/hotelRouters.js` hoặc `backend/src/routes/bookingRouters.js`:

- `verifyToken` => bắt buộc login
- `verifyProvider` => kiểm tra quyền host
- `verifyAdmin` => kiểm tra quyền admin

---

## 6) Flow optional auth

Trong `backend/src/utils/optionalVerifyToken.js`:

- nếu không có token: cho phép đi tiếp
- nếu có token hợp lệ: gán `req.user`
- dùng cho route xem chi tiết public nhưng có thể customize theo trạng thái user đã login hay chưa

Ví dụ route “xem hotel / room có thể public” nhưng nếu user đã login thì biết thêm thông tin user.

---

## 7) Flow login trên frontend

Trong `frontend/src/pages/Login.jsx`:

- gọi `api.post("/auth/login", credentials)`
- nếu server trả về `res.data.token`
- frontend lưu vào localStorage:

```js
localStorage.setItem("token", res.data.token);
```

- đồng thời cập nhật `AuthContext`

Sau đó, mọi request từ axios đều tự thêm Bearer token.

---

## 8) Cách chạy theo từng luồng

### Luồng A: User login

1. Frontend gửi username/password
2. Backend kiểm tra user
3. Backend tạo JWT
4. Frontend lưu token vào localStorage
5. Tất cả request sau này có header `Authorization: Bearer ...`

### Luồng B: Request cần login

1. Client gọi API
2. Axios gắn `Authorization: Bearer ...`
3. Backend chạy `verifyToken`
4. Nếu hợp lệ: tiếp tục xử lý controller
5. Nếu không: `401/403`

### Luồng C: Route provider

1. User login
2. token có role `provider`/`admin`
3. `verifyToken` chạy
4. `verifyProvider` kiểm tra quyền
5. nếu không đủ quyền => chặn

### Luồng D: Route admin

1. `verifyToken`
2. `verifyAdmin`
3. chỉ admin được vào

### Luồng E: Public route nhưng có login tùy chọn

1. `optionalVerifyToken`
2. nếu token hợp lệ => gán `req.user`
3. nếu không có => bỏ qua

---

## 9) Lưu ý quan trọng

> Dự án này dùng 2 dạng token:
> - JWT Bearer cho auth của user
> - reset token cho quên mật khẩu, nằm trong URL và database, không phải Bearer

Reset-password nằm ở:

- `backend/src/controllers/authController.js`
- `backend/src/routes/authRouters.js`

nó khác hẳn với JWT auth của login.

---

## 10) Bearer là gì?

`Bearer` không phải là “mình tự sáng tạo ra”. Đây là standard của HTTP Authorization.

Khi viết:

```js
config.headers.Authorization = `Bearer ${token}`;
```

tức là:

- `Authorization` là header chuẩn
- `Bearer` là scheme xác định kiểu token
- `${token}` là JWT thực tế

Server sẽ đọc như sau:

```js
const authHeader = req.headers.authorization;
const token = authHeader.split(" ")[1];
```

Nếu header là:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

thì `split(" ")[1]` sẽ lấy phần sau `Bearer`, đó chính là JWT.

---

## 11) Tóm tắt ngắn

- Login => sinh JWT
- Frontend lưu token
- Mỗi request gắn `Authorization: Bearer ...`
- Backend đọc token và `jwt.verify()`
- Nếu hợp lệ thì tiếp tục xử lý
- Nếu không hợp lệ thì 401/403

---

## 12) Dòng code quan trọng nhất

```js
config.headers.Authorization = `Bearer ${token}`;
```

Đây là câu mà frontend đang nói với backend:

> “Tôi đang gửi JWT theo chuẩn Bearer để xác thực người dùng.”

