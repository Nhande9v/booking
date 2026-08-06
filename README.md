# A.Laura Hotel Booking Platform

A full-stack accommodation booking platform for guests, property providers,
and administrators. The application supports property discovery, room
inventory, reservation holds, reviews, media management, and VNPay Sandbox
payments.

[Live Demo](https://booking-two-iota.vercel.app) | [API Health](https://alaura-booking-api.onrender.com/api/health)

> The demo uses VNPay Sandbox. No real payment is processed. The Render free
> instance may take a short time to wake up after a period of inactivity.

## Highlights

- Role-based workflows for guests, providers, and administrators.
- Hotel and room management with moderation before public publishing.
- Room availability checks, temporary booking holds, and automatic expiration.
- Signed Cloudinary uploads for property and room galleries.
- VNPay Sandbox checkout with signed Return and IPN verification.
- Reviews restricted to eligible completed bookings.
- Property search with Leaflet and OpenStreetMap locations.
- Separate frontend and backend deployments with environment-based CORS.

## User Roles

### Guest

- Search properties and inspect hotel and room details.
- Reserve available rooms for selected dates and guest counts.
- Pay through VNPay Sandbox and track booking status.
- Cancel eligible bookings and review completed stays.

### Provider

- Create properties and upload image galleries.
- Configure rooms, inventory, capacity, prices, and discounts.
- Enable or disable booking availability.
- View reservations for owned properties.

### Administrator

- Review, approve, or reject submitted properties.
- Manage featured listings and property map locations.
- Moderate reviews and inspect published properties.

## Architecture

```text
React + Vite (Vercel)
        |
        | HTTPS / REST API
        v
Node.js + Express (Render)
        |
        +-- MongoDB Atlas       application data
        +-- Cloudinary          image storage
        +-- VNPay Sandbox       payment testing
        +-- OpenStreetMap       map tiles and geocoding
```

The frontend never receives database, Cloudinary, JWT, or VNPay secrets.
Payment confirmation is performed by the backend after validating signed VNPay
callback parameters.

## Technology Stack

**Frontend:** React, Vite, React Router, Tailwind CSS, Axios, Leaflet

**Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs

**Services:** MongoDB Atlas, Cloudinary, VNPay Sandbox, OpenStreetMap

**Delivery:** Docker, Vercel, Render, GitHub

## Repository Structure

```text
booking/
|- frontend/              React and Vite application
|- backend/               Express REST API
|- render.yaml            Render Blueprint
|- docker-compose.yml     local container orchestration
`- README.md
```

## Local Development

### Prerequisites

- Node.js 20 or later
- npm
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account
- VNPay Sandbox credentials for payment testing

### 1. Clone the repository

```bash
git clone https://github.com/Nhande9v/booking.git
cd booking
```

### 2. Configure the backend

Create `backend/.env` from `backend/.env.example` and provide your own values:

```env
PORT=5001
MONGODB_CONNECTIONSTRING=mongodb://localhost:27017/booking
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=booking_signed_images

GEOCODING_USER_AGENT=ALauraBooking/1.0 your-email@example.com
BOOKING_TIME_ZONE=Asia/Ho_Chi_Minh
SAME_DAY_BOOKING_CUTOFF=22:00
BOOKING_EXPIRATION_INTERVAL_MS=60000

VNPAY_TMN_CODE=your_sandbox_tmn_code
VNPAY_HASH_SECRET=your_sandbox_hash_secret
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay/return
```

Never commit `.env` files or expose secret values in frontend variables.

Install dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5001/api`. Readiness is available at
`http://localhost:5001/api/health/ready`.

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Booking and Payment Flow

```text
1. The guest selects dates, rooms, and guest count.
2. The backend validates capacity and overlapping reservations.
3. A pending booking temporarily holds inventory.
4. The backend creates a signed VNPay Sandbox checkout URL.
5. VNPay returns the browser to the frontend after payment.
6. VNPay sends a signed IPN request directly to the backend.
7. The backend verifies signature, amount, and transaction status.
8. Payment becomes paid and the booking becomes confirmed.
```

The Return URL is used for user-facing status. The IPN endpoint is the
server-to-server confirmation channel:

```text
GET /api/payments/vnpay/ipn
```

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend in production mode:

```bash
cd backend
npm start
```

The deployed frontend uses `VITE_API_URL` to reach Render. The backend uses
`FRONTEND_URL` as a comma-separated CORS allowlist, for example:

```env
FRONTEND_URL=http://localhost:5173,https://booking-two-iota.vercel.app
```

## Deployment

- **Frontend:** Vercel, rooted at `frontend/`
- **Backend:** Render Blueprint from `render.yaml`
- **Database:** MongoDB Atlas
- **Media:** Cloudinary

Pushes merged into `main` trigger production deployments. Changes to Vite
environment variables require a new frontend deployment.

## Current Scope

This project is an independently developed portfolio application. VNPay is
integrated against its Sandbox environment; production merchant onboarding,
refund automation, notification delivery, and production-grade monitoring are
outside the current demo scope.
