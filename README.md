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
│   ├── liff/                   # LINE LIFF integration
│   │   ├── client.ts          # LIFF SDK wrapper
│   │   ├── provider.tsx       # React context provider
│   │   └── index.ts           # Public exports
│   └── routing/
│       └── auth-guard.tsx     # Authentication guard
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
- **Auth Guard**: Automatic redirect for unauthenticated users
- **Loading States**: Smooth UX during authentication

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

## 🔒 Authentication Flow

1. User accesses the app
2. LIFF SDK initializes automatically
3. Check authentication status:
   - **Logged In**: Redirect to `/calculator`
   - **Not Logged In**: Redirect to `/login`
4. User clicks "Login with LINE"
5. LINE OAuth flow completes
6. User redirected to calculator

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

- Environment variables for sensitive data
- Server-side authentication validation
- Protected routes with auth guards
- Secure LIFF token handling

## 📄 License

ISC License - See package.json for details

## 👨‍💻 Development

Developed as part of [TASK-017-3] LIFF App Entry Point & Routing

For more information, see `/docs/PRD.md`
