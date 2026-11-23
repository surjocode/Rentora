# 🛠️ Rentora — Smart Equipment Rental Platform

<p align="center">
  A modern platform for renting, managing, and discovering equipment with a seamless booking and secure payment experience.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## 🌟 Overview

**Rentora** is a full-stack equipment rental platform designed to make equipment renting simple, accessible, and efficient.

It connects renters with equipment owners through an intuitive interface, allowing customers to discover equipment, manage bookings, and complete secure online payments.

With dedicated dashboards and role-based access, Rentora provides a streamlined experience for Renters, Owners, and Administrators.

## ✨ Key Features

### 👤 Authentication & User Experience
- Secure email and password authentication.
- Google authentication.
- Role-based access for Renters, Owners, and Admins.
- Protected dashboard and application routes.
- Responsive and user-friendly interface.

### 🔍 Equipment Discovery
- Browse available equipment.
- Search, filter, and sort equipment.
- View detailed equipment information.
- Explore equipment by category.
- Add equipment to favorites.

### 📦 Equipment Management
- Create and manage equipment listings.
- Update and delete owned listings.
- Admin-controlled equipment approval workflow.
- Separate dashboards for different user roles.

### 📅 Booking & Rental Management
- Book equipment with selected rental dates.
- Choose rental duration and quantity.
- Provide contact and delivery information.
- View paid bookings in My Rentals.
- Track booking and payment statuses.

### 💳 Secure Payment Integration
- Stripe Hosted Checkout integration.
- Secure payment processing.
- Stripe webhook-based payment verification.
- Automatic booking confirmation after successful payment.
- Dedicated payment success and cancellation pages.

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Authentication | Better Auth |
| Payment Gateway | Stripe Checkout |
| Icons | Lucide React |
| Notifications | Sonner / React Toastify |
| API Integration | REST API |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Deployment | Vercel (Frontend) |

## 🏗️ Project Structure

```text
Rentora/
├── app/
│   ├── (public)/
│   ├── dashboard/
│   ├── payment/
│   │   ├── success/
│   │   └── cancel/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
├── hooks/
├── lib/
├── services/
├── public/
├── .env.local
├── next.config.ts
├── package.json
└── tsconfig.json
```

## ⚙️ Getting Started

Follow these steps to run Rentora locally.

### Prerequisites

- Node.js 20 or later
- npm
- Git
- MongoDB database
- Stripe test account

### 1. Clone the Repository

```bash
git clone https://github.com/surjocode/rentora.git
```

### 2. Navigate to the Project

```bash
cd rentora
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> **Security Note:** Never expose Stripe secret keys or other private credentials in frontend environment variables.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💳 Payment Workflow

Rentora uses Stripe Hosted Checkout to provide a secure payment experience.

```text
Customer selects equipment
          ↓
Booking is created
          ↓
Backend creates Checkout Session
          ↓
Customer redirects to Stripe Checkout
          ↓
Customer completes payment
          ↓
Stripe sends webhook event
          ↓
Backend verifies payment
          ↓
Booking becomes confirmed
          ↓
Paid booking appears in My Rentals
```

**Important:** Booking confirmation is handled by the backend after successful webhook verification, not merely by the frontend success page.

## 🔐 Security Highlights

- Authentication and role-based authorization.
- Protected API requests.
- Server-side booking and payment calculations.
- Booking ownership validation.
- Stripe webhook signature verification.
- Environment-based secret management.

## 🚀 Deployment

The frontend is configured for deployment on **Vercel**.

For production deployment:
1. Deploy the backend API to a public hosting service.
2. Configure the production API URL.
3. Add the required environment variables to Vercel.
4. Configure the production Stripe webhook endpoint.
5. Verify the complete booking and payment workflow.

## 👨‍💻 Author

**Piel Mitra**

[![GitHub](https://img.shields.io/badge/GitHub-surjocode-181717?logo=github)](https://github.com/surjocode)

---

<p align="center">
  Built with ❤️ to make equipment rental easier.
</p>

<p align="center">
  <strong>Rentora — Rent Smart. Work Better.</strong>
</p>