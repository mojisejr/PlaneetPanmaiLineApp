# 🌱 Praneet Panmai LINE App

ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Premium Member Calculator)

## 🎯 Project Overview

A LINE LIFF (LINE Front-end Framework) application for durian plant nursery calculator and member management system. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with LIFF provider
│   ├── page.tsx                 # Main entry point
│   ├── (auth)/                  # Public routes
│   │   ├── layout.tsx          # Auth layout
│   │   └── login/              # Login page
│   │       └── page.tsx
│   └── (dashboard)/             # Protected routes
│       ├── layout.tsx          # Dashboard layout
│       └── calculator/         # Calculator page
│           └── page.tsx
├── components/                  # React components
│   └── layout/
│       └── app-layout.tsx      # Reusable app layout
├── lib/                        # Core libraries
│   ├── auth/                   # Authentication utilities
│   │   └── middleware.ts      # Server-side auth middleware
│   ├── liff/                   # LINE LIFF integration
│   │   ├── client.ts          # LIFF SDK wrapper
│   │   ├── provider.tsx       # React context provider
│   │   └── index.ts           # Public exports
│   └── routing/
│       └── auth-guard.tsx     # Client-side authentication guard
├── middleware.ts               # Next.js Edge middleware
└── public/                     # Static assets
```

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

The development server will start at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

- **LIFF Integration**: Seamless LINE authentication
- **Route Groups**: Separate public (auth) and protected (dashboard) routes
- **Server-Side Middleware**: Edge middleware for route protection
- **Client-Side Auth Guard**: Automatic redirect for unauthenticated users
- **Loading States**: Smooth UX during authentication
- **Double-Layer Protection**: Both server and client-side authentication guards

### App Structure

- **Entry Point** (`app/page.tsx`): Automatic routing based on auth state
- **Login Page** (`app/(auth)/login/page.tsx`): LINE login interface
- **Calculator** (`app/(dashboard)/calculator/page.tsx`): Protected member-only calculator
- **Layouts**: Nested layouts for auth and dashboard sections

### LIFF Client (`lib/liff/client.ts`)

```typescript
import { liffClient } from '@/lib/liff'

## 🎨 Design System

### Mobile-First Approach

- **Minimum Width**: 320px (LINE WebView compatible)
- **Touch Targets**: 44px minimum for elderly users
- **Color Contrast**: 4.5:1 minimum ratio
- **Thai Language**: Optimized font loading

### Responsive Breakpoints

```css
xs: 320px   /* LINE WebView minimum */
sm: 375px   /* Standard mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Component System

Built with shadcn/ui for consistency and accessibility:
- Modern, accessible components
- Customizable with Tailwind CSS
- TypeScript support
- Dark mode ready

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# LINE LIFF
NEXT_PUBLIC_LIFF_ID=your_liff_id
LINE_CHANNEL_ACCESS_TOKEN=your_channel_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=your_app_url
NODE_ENV=development
```

### Authentication Middleware (`middleware.ts` & `lib/auth/middleware.ts`)

Server-side authentication middleware runs on the Edge runtime:

```typescript
// Automatically protects routes at the server level
// Configured in middleware.ts

// Protected routes: /calculator, /calculator/*
// Auth routes: /login (redirects if already authenticated)
// Public routes: / (accessible to all)

// Features:
// - LIFF authentication state validation
// - Protocol-aware redirects (HTTP/HTTPS)
// - Return URL preservation for post-login redirects
// - No authentication bypass possible
```

## 🔒 Authentication Flow

### Server-Side (Middleware - First Layer)
1. User accesses any route
2. Next.js Edge middleware intercepts the request
3. Checks for LIFF authentication cookies (`liff.access_token` or `auth.session`)
4. Protected routes without authentication → Redirect to `/login` with return URL
5. Auth routes with authentication → Redirect to `/calculator`
6. Allowed requests proceed to client-side

### Client-Side (LIFF + AuthGuard - Second Layer)
1. LIFF SDK initializes automatically
2. Check authentication status:
   - **Logged In**: Render protected content
   - **Not Logged In**: Redirect to `/login`
3. User clicks "Login with LINE"
4. LINE OAuth flow completes
5. LIFF sets authentication cookies
6. User redirected to calculator (or return URL)

### Double-Layer Protection
- **Server-Side Middleware**: Fast edge protection, prevents unauthorized access at network level
- **Client-Side Guards**: Smooth UX with loading states and profile management
- **Cookie-Based Auth**: LIFF tokens stored in cookies for server-side validation

### Code Quality

Automated linting and formatting:
- ESLint for code quality
- Prettier for consistent formatting
- TypeScript compiler checks

## 📱 LINE LIFF Integration

This app is designed to run within LINE's WebView environment:

1. **Authentication**: LINE LIFF SDK handles user authentication
2. **Profile Access**: Access to LINE user profile (ID, name, picture)
3. **Rich Menu**: Integrated with LINE's Rich Menu for navigation
4. **QR Code**: Supports QR code scanning for member registration

## 🔐 Security

- **Environment variables** for sensitive data (never exposed)
- **Server-side middleware** for route protection at Edge runtime
- **Client-side auth guards** for additional protection layer
- **Secure LIFF token handling** via cookies
- **Double-layer authentication**: Server + Client protection
- **No authentication bypass possible**
- **Return URL preservation** for secure post-login redirects
- **Protocol-aware redirects** (HTTP/HTTPS handling)

## 📚 Documentation

- [PRD (Product Requirements Document)](./docs/PRD.md)
- [Database Schema Context](./docs/database-schema-context.md)
- [Issue Templates](./docs/)

## 🤝 Contributing

This is a private project. For team members:

1. Create feature branch from `staging`
2. Follow commit message format
3. Ensure all tests pass
4. Submit PR for review

## 📄 License

Private - All Rights Reserved

Development History:
- [TASK-017-3] LIFF App Entry Point & Routing
- [TASK-032-2] Authentication Middleware Implementation

- Next.js team for the amazing framework
- shadcn for the beautiful component library
- LINE Corporation for LIFF platform
- Supabase for backend infrastructure
