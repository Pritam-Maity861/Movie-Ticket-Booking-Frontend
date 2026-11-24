# 🎬 CineMate Client (Frontend Application)

[![React 19](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-brown?style=for-the-badge)](https://zustand.docs.pmnd.rs/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)

The **CineMate Client** is a responsive, high-performance Single Page Application (SPA) designed for cinema ticket booking, real-time seat reservation, admin and theater-owner management, and an intelligent AI cinema concierge.

---

## 📑 Table of Contents
1. [Architecture & Tech Stack](#-architecture--tech-stack)
2. [Project Directory Structure](#-project-directory-structure)
3. [Key Features & User Journeys](#-key-features--user-journeys)
4. [AI Concierge & Generative UI Engine](#-ai-concierge--generative-ui-engine)
5. [Authentication & Security Architecture](#-authentication--security-architecture)
6. [Interactive Seat Layout & Booking Flow](#-interactive-seat-layout--booking-flow)
7. [Admin & Theater Owner Dashboards](#-admin--theater-owner-dashboards)
8. [E-Ticket PDF & QR Engine](#-e-ticket-pdf--qr-engine)
9. [Environment Configuration](#-environment-configuration)
10. [Getting Started & Development](#-getting-started--development)

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | **React 19**, **TypeScript 5.9**, **Vite 7** |
| **Styling & UI** | **Tailwind CSS v4**, Lucide React, Material UI (DatePicker) |
| **Routing** | **React Router DOM v7** (Nested layouts, protected role routes) |
| **State Management** | **Zustand v5** (`auth-store.ts`), local component state |
| **Data Fetching & Cache** | **TanStack React Query v5**, **Axios** (with token refresh interceptors) |
| **Media & Generation** | **jsPDF** (client-side PDF generation), **QRCode**, **React Player** |
| **Notifications** | **react-hot-toast** |

---

## 📁 Project Directory Structure

```
client/src/
├── assets/                  # Static graphic assets and logos
├── components/              # Shared reusable UI elements
│   ├── chat/                # AI Chatbot Concierge interface
│   │   ├── AgentChatModal.tsx    # Streaming floating AI chat dialog & Generative UI
│   │   └── MarkdownRenderer.tsx  # Custom markdown parser with CTA action buttons
│   ├── Navbar.tsx           # Global responsive navigation bar
│   ├── Footer.tsx           # Global footer
│   ├── MovieCard.tsx        # Standard movie card with poster & ratings
│   └── LoaderAnimation.tsx  # Centralized loading indicator
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & runtime singletons
│   ├── axios.ts             # Pre-configured Axios instance with automatic token interceptors
│   └── token-manager.ts     # In-memory access token store
├── pages/                   # User and Management application views
│   ├── Home.tsx             # Landing hero, trailer carousel, trending releases
│   ├── Movies.tsx           # Searchable & filterable movie catalog
│   ├── MovieDetails.tsx     # Synopsis, cast credits, duration, trailer preview
│   ├── MovieShowtimes.tsx   # Date selector, theater listing, screen showtimes
│   ├── SeatLayout.tsx       # Live seat grid (Regular/Premium/VIP) with lock timer
│   ├── Checkout.tsx         # Payment overview, Razorpay checkout, countdown timer
│   ├── BookingSuccess.tsx   # Payment confirmation, ticket summary, download button
│   ├── MyBooking.tsx        # User booking history, status badges, PDF download
│   ├── Profile.tsx          # Account settings & profile management
│   ├── Login.tsx            # Sign in / Sign up authentication modal
│   ├── AdminDashboard.tsx   # Admin multi-view parent layout
│   ├── TheaterOwnerDashboard.tsx # Multi-tenant theater owner proposal portal
│   └── admin/               # Dedicated management views (Movies, Theaters, Approvals, etc.)
├── services/                # API communication layers & route guards
│   ├── api/                 # Endpoint modules (auth-ep, movie-ep, booking-ep, ai-chat-ep, etc.)
│   └── ProtectedRoute.tsx   # RBAC route authorization guard
├── store/                   # Global state management
│   └── auth-store.ts        # User authentication & role state
└── utils/                   # Helper functions
    ├── generateTicket.ts    # jsPDF + QRCode ticket generator
    └── ScrollToTop.tsx      # Auto-scroll on route transition
```

---

## 🌟 Key Features & User Journeys

### 1. Movie Discovery & Exploration
- Browse current and upcoming movies with instant keyword search and genre filtering.
- Watch embedded YouTube trailers with `react-player`.
- Inspect detailed credits (cast, directors, billing order, duration, languages).

### 2. Multi-City Theater & Showtime Schedules
- Browse approved cinema locations in cities (e.g., Kolkata, Mumbai, Delhi).
- Filter showtimes by calendar date.
- Inspect auditorium amenities (IMAX, Dolby Atmos, 4DX, Recliners).

### 3. Interactive Real-Time Seat Reservation
- Visual auditorium layout divided into seating tiers (`VIP`, `PREMIUM`, `REGULAR`).
- Dynamic real-time seat lock verification combining backend PostgreSQL states with active Redis memory locks.
- Synchronized **10-minute hold timer** to prevent seat hoarding.

### 4. Seamless Checkout & Payment
- Integration with **Razorpay Checkout SDK**.
- Cryptographically verified payments ensuring zero double-booking.

---

## 🤖 AI Concierge & Generative UI Engine

CineMate includes an **Agentic AI Ticketing Concierge** powered by FastAPI, LangGraph, and Groq:

### Real-Time Streaming Chat (`AgentChatModal.tsx`)
- Connected to `/api/chat?stream=true` using **Server-Sent Events (SSE)**.
- Streaming responses render token-by-token with typing animation.
- Guest mode prompts vs. Authenticated user shortcuts.

### Generative UI Actions
The assistant renders rich interactive interactive cards directly inside the conversation feed:
1. **`BOOKING_HOLD`**:
   - Triggers when the assistant reserves seats on behalf of the user.
   - Shows reserved seat names, 10-minute hold window, and an immediate **"Proceed to Checkout"** CTA.
2. **`TICKET_CARD`**:
   - Triggers when a user requests their confirmed ticket or booking details.
   - Displays movie poster, title, theater, screen, showtime, and seat numbers.
   - **"Download PDF" Button**: Immediately executes `generateTicketPDF` directly inside the browser.
   - **"View Ticket" Button**: Seamlessly navigates to `/booking-success/:bookingId`.

### Markdown Rendering Engine (`MarkdownRenderer.tsx`)
- Automatically detects checkout links (`/checkout/:id`) and formats them into bold primary payment buttons.
- Automatically detects ticket links (`/booking-success/:id`) and formats them into emerald action buttons with ticket icons.
- Prevents external domain hallucinations by enforcing application-relative routes.

---

## 🔒 Authentication & Security Architecture

CineMate implements a production-grade **dual-token authentication mechanism**:

1. **Short-Lived Access Token (15 Minutes)**:
   - Stored purely **in-memory** in `token-manager.ts`.
   - Never stored in `localStorage` or `sessionStorage` to mitigate Cross-Site Scripting (XSS).
2. **Long-Lived Refresh Token (7 Days)**:
   - Stored in a secure, `httpOnly`, `SameSite=Lax` browser cookie.
   - Handled exclusively by the server during rotation.
3. **Silent Re-Authentication & Interceptors**:
   - On initial app boot, `refreshTokenApi()` is executed to restore authentication state seamlessly.
   - Axios request interceptor injects the current access token into the `Authorization: Bearer <token>` header.
   - Axios response interceptor intercepts `401 Unauthorized` errors, automatically requests a fresh token, and replays failed requests transparently.

---

## 🎟️ E-Ticket PDF & QR Engine

When a booking is confirmed, the client can generate and download a cinema ticket instantly without server-side rendering overhead:

- **Library**: `jspdf` & `qrcode`.
- **Dimensions**: Custom `100mm x 180mm` vertical cinema ticket layout.
- **Visuals**: Dark cinema branding (`#141416`), CineMate primary accent (`#F84565`), decorative punch holes, and perforated divider.
- **Dynamic Content**: Movie title, auditorium screen, theater address, date, showtime, and seat labels.
- **Embedded QR Code**: Encodes `BOOKING_ID:<uuid>` for fast scanning at cinema turnstiles.

---

## 🛡️ Admin & Theater Owner Dashboards

### Role-Based Access Control (RBAC)
Protected by `ProtectedRoute.tsx` verifying roles:
- **`USER`**: Personal booking history, seat holding, profile.
- **`THEATER_OWNER`**: Portal for registering theaters, adding screens, and scheduling showtimes subject to approval.
- **`ADMIN` / `SUPER_ADMIN`**: Full platform control, revenue tracking, and the Maker-Checker **Approvals Manager** to vet theater owner requests.

---

## ⚙️ Environment Configuration

Create a `.env` file in the `client/` root directory:

```env
# Node.js Core Backend URL
VITE_API_BASE_URL=http://localhost:8080/api/v1

# FastAPI AI Service URL
VITE_AI_API_URL=http://localhost:8000/api

# Razorpay Public Key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## 🚀 Getting Started & Development

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Production Build & Typecheck
```bash
npm run build
```
Executes `tsc -b` for strict typechecking followed by Vite's production bundler.
