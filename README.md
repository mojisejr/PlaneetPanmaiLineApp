# Planeet Panmai LINE App

Premium Member Calculator for Durian Plant Nursery Sales System

## Overview

This is a Next.js 14 application integrated with LINE LIFF (LINE Front-end Framework) for a members-only durian plant calculator system. The application provides authentication through LINE and manages user profiles with Supabase.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: LINE LIFF v2
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Features

### LINE User Profile Retrieval System (TASK-017-2)

Complete authentication system with:
- ✅ LINE LIFF integration for user authentication
- ✅ Profile caching with 24-hour validity
- ✅ Real-time profile synchronization
- ✅ React Context for global authentication state
- ✅ Loading and error state management
- ✅ Supabase integration for member management
- ✅ API routes for profile validation and sync

## Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/
│   │       └── profile/          # Profile validation & sync
│   ├── profile/                  # Profile demo page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React Components
│   ├── auth/
│   │   └── profile-display.tsx   # Profile display component
│   └── ui/                       # UI Components
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── error-display.tsx
│       └── loading-spinner.tsx
├── hooks/                        # Custom React Hooks
│   └── use-line-profile.ts       # LINE profile hook
├── lib/                          # Utilities & Services
│   ├── auth/
│   │   ├── auth-store.tsx        # React Context provider
│   │   └── line-auth.ts          # Authentication service
│   ├── liff/
│   │   └── client.ts             # LIFF SDK wrapper
│   └── supabase/
│       └── server.ts             # Supabase server client
└── types/                        # TypeScript Types
    └── liff.ts                   # LIFF type definitions
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# LINE LIFF Configuration
NEXT_PUBLIC_LIFF_ID=your_liff_id_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application expects a `members` table in Supabase:

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## Usage

### Basic Authentication Flow

```typescript
import { useLineProfile } from '@/hooks/use-line-profile'

function MyComponent() {
  const {
    isAuthenticated,
    isLoading,
    profile,
    error,
    authenticate,
    refreshProfile,
    logout
  } = useLineProfile()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!isAuthenticated) return <button onClick={authenticate}>Login</button>

  return (
    <div>
      <h1>Welcome, {profile.displayName}!</h1>
      <button onClick={refreshProfile}>Refresh Profile</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Using the Profile Display Component

```typescript
import { ProfileDisplay } from '@/components/auth/profile-display'

function ProfilePage() {
  return (
    <ProfileDisplay 
      showActions={true}
      onProfileChange={(profile) => {
        console.log('Profile updated:', profile)
      }}
    />
  )
}
```

### Using the Auth Context Provider

Wrap your app with `AuthProvider` for global authentication state:

```typescript
import { AuthProvider } from '@/lib/auth/auth-store'

function App({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
```

## API Endpoints

### GET /api/auth/profile

Check if a member exists in the database.

**Query Parameters:**
- `lineUserId` (required): LINE User ID

**Response:**
```json
{
  "exists": true,
  "member": {
    "id": "uuid",
    "line_user_id": "U1234567890abcdef",
    "display_name": "John Doe",
    "is_active": true
  },
  "profile": null
}
```

### POST /api/auth/profile

Create or update a member profile.

**Request Body:**
```json
{
  "userId": "U1234567890abcdef",
  "displayName": "John Doe",
  "pictureUrl": "https://...",
  "statusMessage": "Hello!"
}
```

**Response:**
```json
{
  "success": true,
  "member": { ... },
  "isNew": true
}
```

## Features

### Authentication Service (`lib/auth/line-auth.ts`)

- Singleton pattern for consistent state management
- Profile caching with 24-hour validity
- Automatic LIFF initialization and login
- Error handling and recovery
- localStorage persistence

### LIFF Client (`lib/liff/client.ts`)

- Wrapper around LINE LIFF SDK
- Automatic initialization
- Login/logout management
- Profile retrieval
- Access token management

### Profile Hook (`hooks/use-line-profile.ts`)

- React hook for authentication state
- Loading and error states
- Profile refresh capability
- Cache loading on mount

## Build & Deployment

The project passes all validation checks:
- ✅ Build: `npm run build` - 100% PASS
- ✅ Lint: `npm run lint` - 100% PASS
- ✅ Type Check: `npm run type-check` - 100% PASS

## License

Private project for Planeet Panmai.

## Support

For issues and questions, please contact the development team.
