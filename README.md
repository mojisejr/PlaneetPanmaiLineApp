# 🌱 ปราณีต พันธุ์ไม้ จันทบุรี (Praneet Panmai LINE App)

แพลตฟอร์มสมาชิกสำหรับเกษตรกรและผู้ปลูกต้นไม้มืออาชีพ

**Members Platform for Farmers & Gardeners - Premium Calculator**

## 🎯 Project Overview

A LINE LIFF (LINE Front-end Framework) application designed for **ปราณีต พันธุ์ไม้ จันทบุรี** - a premium members-only platform for farmers and gardeners in Chanthaburi, Thailand. Features a plant price calculator with age-appropriate design optimized for users aged 35+.

### Key Features

- 🧮 **Plant Price Calculator** - Calculate prices for durian and other plants
- 🌱 **Product Catalog** - Browse available plants with detailed information
- 📊 **Production Summary** - Track planting costs and yields
- 💰 **Cost Recording** - Manage expenses and budgets
- 📚 **Growing Guides** - Learn cultivation techniques
- 🌤️ **Weather Forecast** - Agricultural weather information
- 💬 **Support Contact** - Direct communication with experts
- ⚙️ **Settings** - Manage profile and preferences

### Target Audience

- **Primary Users**: Farmers and gardeners aged 35+
- **Location**: Chanthaburi Province, Thailand
- **Language**: Thai (primary), English (secondary)
- **Device**: Mobile-first, optimized for LINE WebView

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

```
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with SEO metadata
│   ├── page.tsx                 # Landing page with branding
│   └── liff/                    # LIFF authentication pages
├── components/                  # React components
│   ├── header/                  # Branding components
│   │   └── brand-header.tsx    # Consistent page headers
│   ├── navigation/              # Navigation components
│   │   └── simplified-menu.tsx # Age-appropriate menu
│   ├── profile/                 # User profile components
│   │   └── premium-profile-card.tsx # Credit card-style profile
│   └── ui/                      # UI primitives
│       └── age-appropriate-button.tsx # Large touch buttons
├── lib/                         # Core libraries
│   ├── config/                  # Configuration files
│   │   ├── branding.ts         # Brand constants & accessibility
│   │   └── seo.ts              # SEO metadata & Open Graph
│   ├── auth/                    # Authentication utilities
│   ├── liff/                    # LINE LIFF integration
│   └── supabase/                # Database operations
├── public/                      # Static assets
│   └── manifest.json           # PWA manifest with branding
└── middleware.ts                # Next.js Edge middleware
```

### Branding Configuration

The application uses centralized branding configuration:

- **`lib/config/branding.ts`**: Brand names, colors, typography, accessibility settings
- **`lib/config/seo.ts`**: SEO metadata, Open Graph, Twitter cards, structured data

### Key Features

- **LIFF Integration**: Seamless LINE authentication
- **Age-Appropriate Design**: 48px touch targets, 16px+ text, high contrast
- **Thai Language First**: Optimized for Thai farmers and gardeners
- **Premium Member Experience**: Credit card-style profiles, tier-based benefits
- **Simplified Navigation**: 6-8 essential features to reduce cognitive load
- **PWA Support**: Installable web app with manifest.json

## 🎨 Design System

### Age-Appropriate Design (35+ Users)

**ปราณีต พันธุ์ไม้** features a specialized design system optimized for elderly farmers and gardeners:

#### Typography
- **Minimum Body Text**: 16px (readable for all ages)
- **Minimum Header Text**: 18px (clear hierarchy)
- **Font Family**: Thai-friendly system fonts (Sukhumvit Set, Noto Sans Thai)
- **Line Height**: 1.5 - 1.75 for improved readability

#### Touch Targets
- **Minimum Size**: 48px (exceeds WCAG 2.1 AA standard of 44px)
- **Button Padding**: Generous spacing for easy tapping
- **Component Spacing**: Ample whitespace to prevent mis-taps
- **Active Feedback**: Visual scale animation on press

#### Visual Design
- **High Contrast**: 4.5:1 minimum color contrast ratio
- **Primary Color**: Green (#22c55e) - Agricultural theme
- **Premium Colors**: Gold gradient for premium members
- **Clear Icons**: Large emoji icons with text labels
- **Traditional Layout**: List menus instead of app grids

### Mobile-First Approach

- **Minimum Width**: 320px (LINE WebView compatible)
- **Touch Targets**: 48px minimum for elderly users
- **Color Contrast**: 4.5:1 minimum ratio
- **Thai Language**: Optimized font loading
- **Load Time**: ≤3 seconds on 4G/5G networks

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

Built with shadcn/ui and custom age-appropriate components:

#### Core Components
- **`<AgeAppropriateButton>`** - 48px minimum touch targets with large text
- **`<PremiumProfileCard>`** - Credit card-style member profile with gradient backgrounds
- **`<SimplifiedMenu>`** - Traditional list navigation with 6-8 essential features
- **`<BrandHeader>`** - Consistent branding across all pages
- **`<CompactMenu>`** - Bottom navigation for mobile (4 key features)

#### Component Features
- Modern, accessible components
- Customizable with Tailwind CSS
- TypeScript support throughout
- Dark mode ready (when implemented)
- Age-appropriate sizing and spacing

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
- [Task Issue Template](./docs/TASK-ISSUE-TEMP.md)
- [Context Issue Template](./docs/ISSUE-TEMP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Development Guidelines](./CLAUDE.md)

## 🎨 Branding

**Business Name**: ปราณีต พันธุ์ไม้ จันทบุรี (Praneet Panmai Chanthaburi)

**Brand Colors**:
- Primary: Green (#22c55e) - Agricultural theme
- Premium: Gold (#fbbf24) - Premium tier badge
- Accent: Amber (#92400e) - Earthy grounding

**Accessibility Standards**:
- WCAG 2.1 AA compliant
- Minimum 48px touch targets
- 4.5:1 color contrast ratio
- Large, readable Thai typography

**Target Load Time**: ≤3 seconds on 4G/5G networks

## 🏆 Member Tiers

### Premium Members (สมาชิกพรีเมียม)
- Plant price calculator access
- Special member pricing
- Growing guides
- Weather forecasts
- Expert consultation

### Regular Members (สมาชิกทั่วไป)
- Browse plant catalog
- Reference pricing
- Basic guides

## 🤝 Contributing

This is a private project. For team members:

1. **Create feature branch** from `staging`
2. **Follow commit message format**: `feat:`, `fix:`, `docs:`, etc.
3. **Ensure all validations pass**:
   - `npm run build` (0 errors, 0 warnings)
   - `npm run lint` (0 new violations)
   - `npx tsc --noEmit` (TypeScript compilation)
4. **Submit PR** targeting `staging` branch (NEVER `main` directly)
5. **Test on LINE WebView** before deployment

### Development Workflow

```bash
# Start from staging
git checkout staging && git pull origin staging

# Create feature branch
git checkout -b feature/task-XXX-description

# Make changes and commit
git add .
git commit -m "feat: implement feature"

# Push and create PR
git push origin feature/task-XXX-description
```

## 📄 License

Private - All Rights Reserved

## 🙏 Acknowledgments

Development History:
- [TASK-037-1] Praneet Panmai Branding System Implementation
- [TASK-032-2] Authentication Middleware Implementation
- [TASK-017-3] LIFF App Entry Point & Routing

Built with:
- Next.js team for the amazing framework
- shadcn for the beautiful component library
- LINE Corporation for LIFF platform
- Supabase for backend infrastructure
- Thai farmers and gardeners for inspiration
