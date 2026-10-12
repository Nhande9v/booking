# Hướng dẫn Host quản lý Booking và xử lý hết hạn

## 1. Phạm vi đã làm

Đã hoàn thành ba bước:

```text
Host bật/tắt nhận Booking
Host xem Booking của Property mình
Booking pending tự chuyển expired khi hết thời gian giữ phòng
```

Chưa tích hợp cổng thanh toán và webhook. Không có đoạn code giả đánh dấu `paid`.

## 2. Bật/tắt Booking ở hai cấp

### Hotel model

File:

```text
backend/src/models/Hotel.js
```

Đã thêm:

```js
bookingEnabled: { type: Boolean, default: true }
```

Nếu bằng `false`, toàn bộ Room của Hotel ngừng nhận Booking mới.

### Room model

File:

```text
backend/src/models/Room.js
```

Đã thêm trường giống Hotel. Nếu Room bằng `false`, chỉ loại Room đó bị đóng.

### Vì sao cần hai cấp?

```text
Hotel đóng -> sửa chữa, tạm ngừng toàn Property
Room đóng  -> bảo trì hoặc ngừng bán riêng một loại Room
```

Booking cũ không bị xóa khi Host tắt công tắc. Công tắc chỉ chặn Booking mới.

## 3. API thay đổi trạng thái nhận Booking

### Hotel

```http
PATCH /api/hotels/:id/booking-availability
Authorization: Bearer <provider-token>

{
  "bookingEnabled": false
}
```

Controller: `setHotelBookingEnabled` trong `hotelController.js`.

Backend kiểm tra:

- body phải là boolean;
- Hotel tồn tại;
- người gọi là owner hoặc Admin;
- Hotel phải `active`.

### Room

```http
PATCH /api/rooms/:id/booking-availability

{
  "bookingEnabled": false
}
```

Controller: `setRoomBookingEnabled` trong `roomController.js`.

Backend tìm Hotel từ `room.hotelId` rồi kiểm tra ownership. Host không thể đóng Room của Host khác bằng cách sửa ID.

## 4. API tạo Booking đã thay đổi

File:

```text
backend/src/controllers/bookingController.js
```

`createBooking` kiểm tra thêm:

```js
if (
  hotel.bookingEnabled === false ||
  room.bookingEnabled === false
) {
  throw createError(
    409,
    "This room is not currently accepting bookings."
  );
}
```

Dùng so sánh `=== false` để dữ liệu Hotel/Room cũ chưa có field vẫn được xem là đang mở. Khi document được cập nhật, MongoDB sẽ lưu field rõ ràng.

Frontend chỉ khóa form để hỗ trợ người dùng. Backend mới là lớp bảo vệ thật vì request có thể được gửi bằng Postman.

## 5. Giao diện Host bật/tắt Booking

### HostHotelRooms

File:

```text
frontend/src/pages/HostHotelRooms.jsx
```

Đã thêm:

- nút `Bookings on/off` cho toàn Property;
- nút `View bookings`;
- hàm `toggleHotelBookings`;
- hàm `toggleRoomBookings`.

Các nút chỉ xuất hiện khi Hotel `active`.

### RoomCard

File:

```text
frontend/src/components/host/RoomCard.jsx
```

Mỗi Room hiển thị:

```text
Accepting bookings
Bookings paused
```

Nút biểu tượng Power gọi callback từ `HostHotelRooms`. RoomCard chỉ hiển thị; page chịu trách nhiệm gọi API và cập nhật state.

### RoomPage của khách

File:

```text
frontend/src/pages/RoomPage.jsx
```

API Room trả thêm `propertyBookingEnabled`. Form bị khóa nếu Hotel hoặc Room đóng nhận Booking.

## 6. Host xem Booking

### Backend API

```http
GET /api/bookings/host?hotelId=...&status=all&page=1&limit=10
```

Controller: `getHostBookings`.

Quyền:

```text
Provider -> chỉ Hotel do mình sở hữu
Admin    -> mọi Hotel
User     -> bị verifyProvider chặn
```

Status filter hợp lệ:

```text
all
pending
confirmed
completed
cancelled
expired
```

API populate thông tin khách và Room cần thiết, có phân trang.

### Frontend page

File mới:

```text
frontend/src/pages/HostBookings.jsx
```

Route:

```text
/host/hotels/:hotelId/bookings
```

Trang hiển thị:

- ảnh và tên Room;
- tên/email khách;
- số khách và số Room;
- ngày check-in/check-out;
- Booking status;
- Payment status;
- tổng tiền snapshot;
- bộ lọc status và phân trang.

Host hiện chỉ xem, chưa tự chuyển `paid` hoặc `confirmed`.

## 7. Booking hết hạn

### Booking model

Đã thêm status:

```text
expired
```

và field:

```js
expiredAt: { type: Date, default: null }
```

Không đổi thành `cancelled`, vì hai ý nghĩa khác nhau:

```text
cancelled -> khách chủ động hủy
expired   -> hết 15 phút giữ phòng
```

### Expiration service

File mới:

```text
backend/src/services/bookingExpirationService.js
```

`expirePendingBookings` dùng một lệnh `updateMany`:

```text
status = pending
paymentStatus = unpaid
expiresAt <= hiện tại
```

Sau đó cập nhật:

```text
status = expired
expiredAt = hiện tại
expiresAt = null
```

Booking không bị xóa để giữ lịch sử.

### `startBookingExpirationJob`

Job chạy ngay khi Backend khởi động và sau đó chạy theo interval.

Biến môi trường:

```env
BOOKING_EXPIRATION_INTERVAL_MS=60000
```

Mặc định kiểm tra mỗi 60 giây. Giá trị tối thiểu trong code là 10 giây để tránh cấu hình nhầm gây query liên tục.

`timer.unref()` giúp timer không giữ Node process sống khi server cần tắt.

### Index hỗ trợ job

```js
bookingSchema.index({ status: 1, expiresAt: 1 });
```

Index giúp query tìm pending Booking hết hạn nhanh hơn khi collection lớn.

## 7.1. Chống đặt trùng khi nhiều khách bấm cùng lúc

Đã bổ sung lớp giữ chỗ atomic bằng collection:

```text
backend/src/models/RoomReservation.js
```

Mỗi booking tạo ra các reservation theo từng đêm và từng slot phòng:

```text
roomId
date
unit
bookingId
```

Unique index:

```js
roomReservationSchema.index(
  { roomId: 1, date: 1, unit: 1 },
  { unique: true }
);
```

Ý nghĩa:

```text
Cùng một Room type
Cùng một ngày
Cùng một unit phòng
Chỉ được một Booking giữ
```

Khi user tạo Booking, backend vẫn kiểm tra số phòng còn trống bằng các Booking `pending` chưa hết hạn và `confirmed`. Sau đó backend mở MongoDB transaction:

```text
Tạo Booking pending
Tạo RoomReservation cho từng đêm
Commit transaction
```

Nếu 5 người cùng bấm đặt 1 phòng cuối cùng:

```text
Request thắng trước -> tạo Booking pending và RoomReservation thành công
Các request còn lại -> đụng unique index và nhận 409
```

Frontend không được xem là lớp chống đặt trùng. Lớp bảo vệ thật nằm ở database unique index và backend transaction.

Khi Booking hết hạn hoặc bị khách hủy, hệ thống xóa các `RoomReservation` của Booking đó để phòng được mở lại:

```text
expired/cancelled -> delete RoomReservation
confirmed          -> giữ RoomReservation để phòng vẫn bị chiếm
```

Lưu ý vận hành: production nên chạy MongoDB replica set để transaction hoạt động đúng chuẩn. MongoDB Atlas hỗ trợ sẵn. Nếu chạy local bằng standalone MongoDB, code có fallback không dùng transaction để bạn vẫn test được, nhưng môi trường production không nên phụ thuộc vào fallback này.

## 8. Server startup

File:

```text
backend/src/server.js
```

Sau khi kết nối MongoDB, server gọi:

```js
startBookingExpirationJob();
```

Job chỉ bắt đầu sau khi database đã kết nối.

## 9. Cách test

### Test công tắc Hotel

1. Đăng nhập Provider owner.
2. Mở Room management của Hotel active.
3. Bấm `Bookings on` để chuyển thành off.
4. Dùng tài khoản user thử Reserve Room.
5. Backend phải trả `409`.
6. Bật lại và thử lại.

### Test công tắc Room

1. Chỉ tắt một Room.
2. Room đó phải bị khóa form.
3. Room khác cùng Hotel vẫn đặt được.

### Test quyền Host

1. Provider A mở URL Booking của Hotel Provider B.
2. API phải trả `403`.
3. Provider A vẫn xem được Hotel của chính mình.

### Test expiration nhanh

Trong môi trường development, tạo Booking rồi sửa tạm `expiresAt` trong MongoDB thành thời điểm quá khứ. Chờ tối đa interval cấu hình.

Kết quả:

```text
status: expired
expiredAt: có giá trị
expiresAt: null
```

Booking expired không còn chiếm tồn phòng.

## 10. Payment và webhook chưa làm

Hai bước tiếp theo là:

```text
Tích hợp một payment provider thật
Xác nhận Booking bằng webhook có verify signature
```

Chưa thể triển khai production chính xác khi chưa chọn Stripe, VNPay hoặc MoMo và chưa có merchant/test credentials.

Không được thêm endpoint để Frontend tự gửi `paymentStatus: paid`. Sau này chỉ webhook hợp lệ mới được chuyển:

```text
Payment -> paid
Booking -> confirmed
```

Với nhiều Backend instance, expiration interval trong mỗi instance vẫn idempotent nhờ điều kiện `status: pending`. Tuy nhiên production lớn nên chuyển scheduled job sang worker/queue riêng để vận hành và theo dõi tốt hơn.
