# Hướng dẫn tích hợp VNPay Sandbox cho Booking

## 1. Kết quả đã triển khai

Luồng hiện tại:

```text
User tạo Booking pending
Backend giữ phòng 15 phút
User bấm Pay with VNPay
Backend đọc totalPrice từ Booking
Backend tạo URL VNPay có chữ ký HMAC-SHA512
Trình duyệt chuyển tới VNPay Sandbox
VNPay trả trình duyệt về Return URL
VNPay gọi IPN tới Backend
Backend xác minh chữ ký, số tiền và trạng thái
Payment thành paid
Booking thành confirmed
```

Return URL không cập nhật tiền. Chỉ IPN đã xác minh mới được xác nhận Booking.

Tài liệu chính thức:

- https://sandbox.vnpayment.vn/apis/docs/gioi-thieu/
- https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
- https://sandbox.vnpayment.vn/apis/docs/faqs/
- https://sandbox.vnpayment.vn/apis/docs/bang-ma-loi/

## 2. Đăng ký VNPay Sandbox

1. Mở trang tài liệu Sandbox của VNPay.
2. Chọn đăng ký thông tin kết nối cổng thanh toán.
3. Điền thông tin website thử nghiệm.
4. Lấy hai giá trị VNPay cấp:

```text
vnp_TmnCode
vnp_HashSecret
```

Không đưa `vnp_HashSecret` vào frontend hoặc commit lên GitHub.

## 3. Cấu hình Backend

File mẫu đã cập nhật:

```text
backend/.env.example
```

Trong file thật `backend/.env`, thêm:

```env
VNPAY_TMN_CODE=ma_sandbox_vnpay_cap
VNPAY_HASH_SECRET=secret_sandbox_vnpay_cap
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay/return
```

Sau khi sửa `.env`, restart Backend.

## 4. Return URL và IPN khác nhau

### Return URL

```text
http://localhost:5173/payment/vnpay/return
```

VNPay chuyển trình duyệt khách về đây. Return dùng để hiển thị kết quả, nhưng không phải nguồn xác nhận thanh toán vì người dùng có thể sửa URL.

Frontend gửi toàn bộ query Return tới:

```http
GET /api/payments/vnpay/return
Authorization: Bearer <user-token>
```

Backend xác minh chữ ký và chỉ cho owner của Payment xem kết quả.

### IPN URL

```text
https://PUBLIC_BACKEND_DOMAIN/api/payments/vnpay/ipn
```

Đây là request server-to-server từ VNPay. IPN mới cập nhật MongoDB.

VNPay không thể gọi `http://localhost:5001`, vì localhost chỉ tồn tại trên máy của bạn. Khi test local cần dùng tunnel HTTPS như ngrok hoặc Cloudflare Tunnel:

```text
Public URL: https://example-tunnel.ngrok-free.app
IPN URL:    https://example-tunnel.ngrok-free.app/api/payments/vnpay/ipn
```

IPN URL thường được khai báo trong cấu hình merchant Sandbox của VNPay. Nếu IPN không tới Backend, trang Return sẽ hiển thị đang chờ xác nhận và Booking vẫn chưa `confirmed`.

## 5. Payment model

File mới:

```text
backend/src/models/Payment.js
```

Các field chính:

```text
bookingId             Booking được thanh toán
userId                người trả tiền
provider              vnpay
txnRef                 mã giao dịch merchant duy nhất
amount                 snapshot lấy từ Booking
status                 trạng thái lần thử thanh toán
checkoutUrl            URL VNPay đã ký
expiresAt              hạn thanh toán
providerTransactionNo  mã giao dịch VNPay
responseCode           mã phản hồi
transactionStatus      trạng thái giao dịch VNPay
bankCode/cardType      thông tin phương thức
paidAt/failedAt        thời điểm kết quả
```

Payment status:

```text
pending          đang chờ VNPay
paid             IPN xác nhận thành công
failed           thanh toán thất bại
expired          Booking hết thời gian giữ phòng
review_required  tiền thành công nhưng Booking không còn giữ được
refunded         đã hoàn tiền, dành cho bước sau
```

Một Booking có thể có nhiều lần thử Payment sau khi lần trước failed, nhưng partial unique index chỉ cho một Payment `pending` tại một thời điểm.

## 6. VNPay signing service

File mới:

```text
backend/src/services/payment/vnpayService.js
```

### `getConfig`

Đọc credential từ env. Nếu thiếu TMN code hoặc secret, API trả 503 thay vì tạo URL sai.

### `buildQuery`

Loại giá trị rỗng, sắp xếp key theo alphabet và URL encode. Chuỗi này được dùng cho cả URL và chữ ký để tránh hai cách encode khác nhau.

### `sign`

```js
crypto
  .createHmac("sha512", secret)
  .update(query, "utf8")
  .digest("hex");
```

VNPay API 2.1.0 dùng HMAC-SHA512.

### `formatVnpayDate`

Chuyển thời gian sang GMT+7 theo dạng:

```text
yyyyMMddHHmmss
```

Không phụ thuộc timezone của máy server production.

### `createVnpayPaymentUrl`

Tạo các tham số:

```text
vnp_Version=2.1.0
vnp_Command=pay
vnp_TmnCode
vnp_Amount=totalPrice * 100
vnp_CreateDate
vnp_ExpireDate
vnp_CurrCode=VND
vnp_IpAddr
vnp_Locale
vnp_OrderInfo
vnp_OrderType=170000
vnp_ReturnUrl
vnp_TxnRef
vnp_SecureHash
```

Mã `170000` là nhóm Khách sạn và Du lịch theo bảng mã VNPay.

VNPay yêu cầu amount nhân 100. Booking 980.000 VND được gửi:

```text
vnp_Amount=98000000
```

### `verifyVnpayCallback`

Loại `vnp_SecureHash`, dựng lại chuỗi ký và so sánh bằng `crypto.timingSafeEqual`.

## 7. Checkout controller

File:

```text
backend/src/controllers/paymentController.js
```

API:

```http
POST /api/payments/vnpay/checkout
Authorization: Bearer <user-token>

{
  "bookingId": "...",
  "locale": "vn"
}
```

`createVnpayCheckout` kiểm tra:

1. Role phải là user.
2. Booking ID hợp lệ.
3. Booking thuộc user.
4. Booking đang pending.
5. Thời gian giữ phòng chưa hết.
6. Amount đạt tối thiểu 5.000 VND.
7. Nếu đã có Payment pending còn hạn thì trả lại URL cũ.

Frontend không gửi amount. Backend dùng:

```js
booking.totalPrice
```

Sau khi tạo Payment:

```text
Payment.status = pending
Booking.paymentStatus = pending
```

## 8. IPN controller

API public cho VNPay gọi:

```http
GET /api/payments/vnpay/ipn
```

`handleVnpayIpn` xử lý:

1. Xác minh chữ ký.
2. Tìm Payment bằng `vnp_TxnRef`.
3. So sánh amount VNPay với amount trong MongoDB.
4. Kiểm tra Payment đã xử lý chưa.
5. Dùng MongoDB transaction để cập nhật Payment và Booking cùng nhau.

Thành công khi đồng thời:

```text
vnp_ResponseCode = 00
vnp_TransactionStatus = 00
```

Nếu Booking còn pending và chưa hết hạn:

```text
Payment.status = paid
Booking.status = confirmed
Booking.paymentStatus = paid
Booking.expiresAt = null
```

Nếu tiền thành công nhưng Booking đã expired/cancelled:

```text
Payment.status = review_required
Booking.paymentStatus = review_required
```

Không tự confirm phòng vì inventory có thể đã được bán cho người khác. Production cần nhân viên xử lý hoặc refund.

IPN idempotent: callback lặp lại cho Payment đã xử lý trả mã đã xác nhận, không cộng tiền hay confirm lần hai.

## 9. Expiration job đã cập nhật

File:

```text
backend/src/services/bookingExpirationService.js
```

Job giờ xử lý Booking có payment status:

```text
unpaid
pending
failed
```

Khi hết hạn:

```text
Booking.status = expired
Payment pending = expired
```

Nếu IPN thành công tới muộn, controller vẫn ghi nhận thành `review_required`.

Job cũng xóa các slot giữ phòng trong collection:

```text
roomreservations
```

Điều này giúp phòng được mở lại sau khi Booking `pending` hết hạn.

## 9.1. Liên quan giữa VNPay và chống đặt trùng

Phòng được giữ ngay khi tạo Booking `pending`, không chờ thanh toán VNPay thành công.

Luồng an toàn:

```text
User tạo Booking pending
Backend tạo RoomReservation bằng transaction
User đi thanh toán VNPay
IPN thành công -> Booking confirmed
IPN thất bại hoặc user không trả tiền -> Booking pending hết hạn
Expiration job xóa RoomReservation
```

Nếu nhiều user cùng thanh toán/đặt cùng một phòng cuối, chỉ user tạo được `RoomReservation` trước mới có Booking để đi VNPay. Các user còn lại bị chặn từ bước tạo Booking với HTTP `409`.

Nếu IPN thành công tới sau khi Booking đã `expired`, Payment chuyển `review_required`; hệ thống không tự confirm Booking vì slot phòng đã được mở lại và có thể đã được người khác giữ.

## 10. Frontend

### MyBookings

File:

```text
frontend/src/pages/MyBookings.jsx
```

Booking pending hiển thị:

```text
Pay with VNPay
Continue payment
```

Khi bấm, frontend gọi checkout API rồi:

```js
window.location.assign(response.data.paymentUrl);
```

### VnpayReturn

File mới:

```text
frontend/src/pages/VnpayReturn.jsx
```

Route:

```text
/payment/vnpay/return
```

Trang hiển thị một trong các trạng thái:

```text
paid
failed
pending
review_required
```

Trang không cập nhật database.

## 11. Cách test thành công

### Chuẩn bị

1. Thêm credential Sandbox vào `backend/.env`.
2. Tạo HTTPS tunnel tới port 5001.
3. Khai báo IPN URL public trong Sandbox.
4. Restart Backend.
5. Đăng nhập role user.
6. Tạo Booking mới.

### Thanh toán

Trong My Bookings, bấm `Pay with VNPay`.

Thông tin thẻ test thành công chính thức của VNPay:

```text
Ngân hàng:       NCB
Số thẻ:          9704198526191432198
Tên chủ thẻ:     NGUYEN VAN A
Ngày phát hành:  07/15
OTP:             123456
```

Đây chỉ là thẻ Sandbox, không phải thẻ thật.

### Kiểm tra MongoDB

Collection `payments`:

```text
status = paid
responseCode = 00
transactionStatus = 00
providerTransactionNo có giá trị
paidAt có giá trị
```

Collection `bookings`:

```text
status = confirmed
paymentStatus = paid
expiresAt = null
```

## 12. Test thất bại và bảo mật

Các trường hợp cần thử:

```text
User khác thanh toán Booking -> 403
Booking expired tạo checkout -> 409
Sửa vnp_Amount trong callback -> RspCode 04
Sửa chữ ký -> RspCode 97
Gửi IPN thành công hai lần -> không xử lý lần hai
Hủy thanh toán trên VNPay -> Payment failed
IPN tới sau khi Booking expired -> review_required
```

Không log hoặc commit:

```text
VNPAY_HASH_SECRET
JWT_SECRET
MongoDB connection string
```

## 13. Phần còn thiếu trước production thật

- Merchant VNPay production và domain HTTPS thật.
- QueryDR để đối soát giao dịch khi IPN không chắc chắn.
- Refund API và chính sách hủy.
- Admin page xử lý `review_required`.
- Log/audit Payment và cảnh báo vận hành.
- Automated integration tests cho callback.
- Worker/queue riêng thay cho interval khi chạy nhiều instance.

Không đổi URL Sandbox thành production trước khi ký hợp đồng và hoàn thành test case VNPay.
