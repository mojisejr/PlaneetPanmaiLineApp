# Praneet Panmai Line App - Premium Member Calculator

ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Members-only Calculator) ผ่าน LIFF สำหรับร้านต้นทุเรียน

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v3
- **LINE Integration**: @line/liff v2
- **Database**: Supabase PostgreSQL
- **Authentication**: LINE LIFF Native Auth

## 📁 Project Structure

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

## 🔧 Setup

### Prerequisites

1. Node.js 18+ 
2. npm or yarn
3. LINE Developers Account
4. Supabase Account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your environment variables
# NEXT_PUBLIC_LIFF_ID - Get from LINE Developers Console
# NEXT_PUBLIC_SUPABASE_URL - Get from Supabase Dashboard
# NEXT_PUBLIC_SUPABASE_ANON_KEY - Get from Supabase Dashboard
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🎯 Features

### Authentication & Routing

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

// Initialize LIFF
await liffClient.init()

// Check login status
const isLoggedIn = liffClient.isLoggedIn()

// Get user profile
const profile = await liffClient.getProfile()

// Login
await liffClient.login()

// Logout
liffClient.logout()
```

### LIFF Provider (`lib/liff/provider.tsx`)

```typescript
import { useLiff } from '@/lib/liff'

function MyComponent() {
  const { isLoggedIn, profile, isLoading, login, logout } = useLiff()
  
  // Use LIFF state in your components
}
```

### Auth Guard (`lib/routing/auth-guard.tsx`)

```typescript
import { AuthGuard } from '@/lib/routing/auth-guard'

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true}>
      {/* Your protected content */}
    </AuthGuard>
  )
}
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

## 📱 Mobile Optimization

- Mobile-first responsive design
- Optimized for LINE WebView
- Touch-friendly UI elements
- Fast loading performance

## ✅ Validation

All quality checks pass:

```bash
✅ npm run build     # ZERO errors or warnings
✅ npm run lint      # ZERO violations (warnings only)
✅ npm run type-check # TypeScript compilation success
```

## 🔐 Security

- **Environment variables** for sensitive data (never exposed)
- **Server-side middleware** for route protection at Edge runtime
- **Client-side auth guards** for additional protection layer
- **Secure LIFF token handling** via cookies
- **Double-layer authentication**: Server + Client protection
- **No authentication bypass possible**
- **Return URL preservation** for secure post-login redirects
- **Protocol-aware redirects** (HTTP/HTTPS handling)

## 📄 License

ISC License - See package.json for details

## 👨‍💻 Development

Development History:
- [TASK-017-3] LIFF App Entry Point & Routing
- [TASK-032-2] Authentication Middleware Implementation

For more information, see `/docs/PRD.md`
