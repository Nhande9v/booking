# HUONG DAN DEPLOY FRONTEND LEN VERCEL VA BACKEND LEN RENDER

Tai lieu nay ap dung cho repo `booking` hien tai:

```text
booking/
|- frontend/   React + Vite, deploy tren Vercel
|- backend/    Node.js + Express, deploy tren Render
|- render.yaml Render Blueprint
```

## 1. Kien truc sau khi deploy

```text
Browser
  |
  | mo giao dien
  v
Vercel: https://ten-frontend.vercel.app
  |
  | VITE_API_URL
  v
Render: https://ten-backend.onrender.com/api
  |
  +--> MongoDB Atlas
  +--> Cloudinary
  +--> VNPay Sandbox
```

Vercel khong chay backend Express cua repo nay. Render khong phuc vu giao dien React.

## 2. Nhung file da duoc thay doi

### 2.1 `frontend/src/lib/axios.js`

Code cu chon URL theo development/production va co the roi vao duong dan `/api` tren chinh domain frontend:

```js
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "api";
```

Code moi:

```js
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";
```

Tac dung:

- Local khong khai bao env thi van goi `http://localhost:5001/api`.
- Tren Vercel, `VITE_API_URL` se tro den backend Render.
- Khong hard-code domain Render trong source code.

### 2.2 `frontend/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Tac dung: khi mo truc tiep cac URL nhu `/hotel/:id`, `/room/:id`,
`/my-bookings` hoac `/payment/vnpay/return`, Vercel tra ve `index.html` de
React Router xu ly. Neu khong co rewrite nay, refresh mot route con co the bi 404.

### 2.3 `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5001/api
```

Day chi la file mau, khong chua secret. Bien Vite phai co tien to `VITE_` moi
duoc frontend nhin thay.

### 2.4 `backend/src/server.js`

CORS cu chi chap nhan local:

```js
cors({ origin: "http://localhost:5173" })
```

CORS moi doc danh sach domain tu `FRONTEND_URL`. Nhieu domain duoc ngan cach
bang dau phay:

```env
FRONTEND_URL=http://localhost:5173,https://ten-frontend.vercel.app
```

Backend chi cho cac frontend trong danh sach nay goi API tu browser. Request
khong co header `Origin`, vi du health check va VNPay IPN, van duoc phep di qua.

Backend cung co:

```js
app.set("trust proxy", 1);
```

Render dat Express sau reverse proxy. Cau hinh nay giup Express doc dung IP
client tu proxy, can thiet khi tao URL thanh toan VNPay.

### 2.5 `render.yaml`

File Blueprint khai bao:

- thu muc backend la `backend`;
- build bang `npm ci`;
- chay bang `npm start`;
- health check tai `/api/health/ready`;
- cac secret phai nhap trong Render Dashboard;
- cac gia tri khong nhay cam duoc dat san.

Khong dua API secret, JWT secret hoac MongoDB password vao file nay.

## 3. Dieu kien truoc khi deploy

1. Code da duoc push len GitHub.
2. MongoDB Atlas cho phep Render ket noi.
3. Cloudinary da co Cloud name, API Key, API Secret va Upload preset.
4. VNPay Sandbox da cap `TMN Code` va `Hash Secret` neu muon test thanh toan.
5. Khong commit file `.env`.

Trong MongoDB Atlas, vao `Network Access`. De demo nhanh co the tam them:

```text
0.0.0.0/0
```

Day la mo ket noi tu moi IP, nen tai khoan database phai co mat khau manh va chi
co quyen tren database can dung. Production nghiem tuc nen gioi han network theo
ha tang co IP on dinh.

## 4. Deploy backend len Render truoc

1. Dang nhap `https://dashboard.render.com` bang GitHub.
2. Chon `New` -> `Blueprint`.
3. Chon repo `booking`.
4. Render doc file `render.yaml` o thu muc goc.
5. Xac nhan tao service `alaura-booking-api` voi plan Free.
6. Nhap cac bien co `sync: false`.

### 4.1 Bien moi truong tren Render

```env
FRONTEND_URL=http://localhost:5173
MONGODB_CONNECTIONSTRING=mongodb+srv://<user>:<password>@<cluster>/<database>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_UPLOAD_PRESET=booking_signed_images
GEOCODING_USER_AGENT=ALauraBooking/1.0 your-real-email@example.com
VNPAY_TMN_CODE=<sandbox-tmn-code>
VNPAY_HASH_SECRET=<sandbox-hash-secret>
VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay/return
```

`JWT_SECRET` duoc Blueprint tu sinh. Neu database local va Render can dung chung
token trong mot tinh huong dac biet, co the tu dat mot chuoi dai, ngau nhien.

Khong them `PORT`. Render tu cap bien `PORT` va server da doc:

```js
const PORT = process.env.PORT || 5001;
```

### 4.2 Lay URL backend

Sau khi deploy thanh cong, Render cap URL dang:

```text
https://alaura-booking-api.onrender.com
```

Kiem tra:

```text
https://alaura-booking-api.onrender.com/api/health
https://alaura-booking-api.onrender.com/api/health/ready
```

Ket qua mong doi:

```json
{
  "status": "ready",
  "database": "connected"
}
```

Neu `/ready` tra `503`, thuong la sai `MONGODB_CONNECTIONSTRING` hoac MongoDB
Atlas chua cho phep network.

## 5. Deploy frontend len Vercel

1. Dang nhap `https://vercel.com` bang GitHub.
2. Chon `Add New` -> `Project`.
3. Import repo `booking`.
4. Dat `Root Directory` la `frontend`.
5. Vercel thuong tu nhan Vite. Kiem tra:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Them Environment Variable cho Production, Preview va Development:

```env
VITE_API_URL=https://alaura-booking-api.onrender.com/api
```

Khong bo dau `/api`. Khong them dau `/` o cuoi.

7. Bam Deploy.
8. Ghi lai domain Vercel, vi du:

```text
https://alaura-booking.vercel.app
```

Vite dong gia tri env vao bundle tai luc build. Neu sua `VITE_API_URL`, phai
Redeploy frontend.

## 6. Cap nhat Render sau khi co domain Vercel

Vao Render -> service backend -> Environment va sua:

```env
FRONTEND_URL=https://alaura-booking.vercel.app
VNPAY_RETURN_URL=https://alaura-booking.vercel.app/payment/vnpay/return
```

Neu van muon frontend local goi backend Render:

```env
FRONTEND_URL=http://localhost:5173,https://alaura-booking.vercel.app
```

Luu bien moi truong va de Render restart/redeploy service.

## 7. Cau hinh VNPay Sandbox

Hai URL co vai tro khac nhau:

```text
Return URL:
https://alaura-booking.vercel.app/payment/vnpay/return

IPN URL:
https://alaura-booking-api.onrender.com/api/payments/vnpay/ipn
```

- Return URL dua trinh duyet cua khach ve frontend sau thanh toan.
- IPN URL de server VNPay goi truc tiep backend va xac nhan giao dich.
- Backend chi danh dau booking `confirmed` khi xu ly thong bao server hop le.
- Khong dung Return URL thay cho IPN URL.

Sau khi doi `VNPAY_RETURN_URL`, URL thanh toan cu da tao co the van mang Return
URL cu. Hay huy booking test cu hoac tao checkout moi.

### Luu y voi Render Free

Render Free co the ngu sau 15 phut khong co request. Lan goi dau co the cham.
Dieu nay chap nhan duoc cho do an va VNPay Sandbox, nhung IPN production can
backend on dinh, khong nen phu thuoc vao instance ngu.

## 8. Checklist kiem tra sau deploy

### Backend

- `/api/health` tra 200.
- `/api/health/ready` tra database connected.
- Render logs khong lo secret.
- Dang nhap tra token binh thuong.
- Upload Cloudinary thanh cong.

### Frontend

- Mo trang chu khong bi trang trang.
- Refresh `/hotel/:id` khong bi Vercel 404.
- Network request di den domain `onrender.com/api`.
- Khong co loi CORS trong Console.
- Dang nhap va tai lai trang van hoat dong.

### Booking va VNPay

- Tao booking tao trang thai `pending`.
- Nut Pay with VNPay tao duoc payment URL.
- Thanh toan bang the Sandbox quay ve domain Vercel.
- VNPay IPN den route Render.
- Payment chuyen sang `paid` va Booking chuyen sang `confirmed` khi thanh cong.

## 9. Loi thuong gap

### CORS

```text
Origin ... is not allowed by CORS
```

Kiem tra `FRONTEND_URL` tren Render phai dung chinh xac protocol va domain:

```text
https://alaura-booking.vercel.app
```

Khong dung `http` cho domain Vercel va khong them path `/api` vao
`FRONTEND_URL`.

### Frontend van goi localhost

Kiem tra `VITE_API_URL` tren Vercel, sau do Redeploy. Bien Vite khong thay doi
bundle cu neu chi Save ma khong build lai.

### Render deploy sai thu muc

Voi Blueprint, `rootDir` da la `backend`. Neu tao Web Service bang tay, dat:

```text
Root Directory: backend
Build Command: npm ci
Start Command: npm start
```

### VNPay bao sai chu ky

Kiem tra `VNPAY_TMN_CODE` va `VNPAY_HASH_SECRET` cung thuoc mot tai khoan
Sandbox. Khong them dau nhay quanh gia tri tren Dashboard va khong dua secret
vao frontend.

## 10. Khi doi domain rieng

Neu sau nay doi Vercel sang `https://alaura.vn`, cap nhat:

```env
# Render
FRONTEND_URL=https://alaura.vn
VNPAY_RETURN_URL=https://alaura.vn/payment/vnpay/return
```

Sau do cap nhat Return URL tren VNPay. Domain backend rieng cung phai duoc cap
nhat trong `VITE_API_URL` tren Vercel va IPN URL tren VNPay.
