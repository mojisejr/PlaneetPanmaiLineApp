# LINE User Profile Retrieval System - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LINE Platform                                │
│  ┌──────────────┐         ┌──────────────┐                          │
│  │  LINE App    │────────▶│  LIFF SDK    │                          │
│  └──────────────┘         └──────────────┘                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ liff.getProfile()
                                │ liff.login()
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Next.js 14 Application                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Client Components                         │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  ProfileDisplay Component                           │    │   │
│  │  │  - Shows user avatar, name, status                  │    │   │
│  │  │  - Loading/Error states                             │    │   │
│  │  │  - Action buttons (refresh, logout)                 │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                       ▲                                      │   │
│  │                       │ uses                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  useLineProfile() Hook                              │    │   │
│  │  │  - isAuthenticated, isLoading                       │    │   │
│  │  │  - profile, error, lastUpdated                      │    │   │
│  │  │  - authenticate(), refreshProfile(), logout()       │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                       ▲                                      │   │
│  └───────────────────────┼──────────────────────────────────────┘   │
│                          │ calls                                     │
│  ┌───────────────────────┼──────────────────────────────────────┐   │
│  │                       │    Core Services                      │   │
│  │  ┌────────────────────▼──────────────────────────────────┐  │   │
│  │  │  LineAuthService (Singleton)                         │  │   │
│  │  │  ┌──────────────────────────────────────────────┐   │  │   │
│  │  │  │  State Management                             │   │  │   │
│  │  │  │  - isAuthenticated, isLoading                 │   │  │   │
│  │  │  │  - profile, error, lastUpdated                │   │  │   │
│  │  │  └──────────────────────────────────────────────┘   │  │   │
│  │  │  ┌──────────────────────────────────────────────┐   │  │   │
│  │  │  │  Methods                                      │   │  │   │
│  │  │  │  - authenticate()                             │   │  │   │
│  │  │  │  - refreshProfile()                           │   │  │   │
│  │  │  │  - logout()                                   │   │  │   │
│  │  │  │  - loadFromCache()                            │   │  │   │
│  │  │  │  - cacheProfile()                             │   │  │   │
│  │  │  └──────────────────────────────────────────────┘   │  │   │
│  │  └─────────────────┬────────────────────────────────────┘  │   │
│  │                    │ uses                                   │   │
│  │  ┌─────────────────▼────────────────────────────────────┐  │   │
│  │  │  LiffClient (Wrapper)                                │  │   │
│  │  │  - initialize()                                      │  │   │
│  │  │  - login()                                           │  │   │
│  │  │  - logout()                                          │  │   │
│  │  │  - getProfile()                                      │  │   │
│  │  │  - getAccessToken()                                  │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Server Components                         │   │
│  │                                                               │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  API Route: /api/auth/profile                       │    │   │
│  │  │                                                       │    │   │
│  │  │  GET  - Check if member exists                       │    │   │
│  │  │  POST - Create/update member in database             │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  │                       │                                      │   │
│  │                       │ uses                                 │   │
│  │  ┌─────────────────────────────────────────────────────┐    │   │
│  │  │  Supabase Server Client                             │    │   │
│  │  │  - createClient()                                   │    │   │
│  │  │  - Cookie-based session management                  │    │   │
│  │  └─────────────────────────────────────────────────────┘    │   │
│  └───────────────────────┼──────────────────────────────────────┘   │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             │ SQL queries
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Supabase (PostgreSQL)                           │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  members Table                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  id              UUID PRIMARY KEY                       │  │  │
│  │  │  line_user_id    TEXT UNIQUE NOT NULL                   │  │  │
│  │  │  display_name    TEXT NOT NULL                          │  │  │
│  │  │  is_active       BOOLEAN DEFAULT true                   │  │  │
│  │  │  created_at      TIMESTAMP                              │  │  │
│  │  │  updated_at      TIMESTAMP                              │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      Browser localStorage                            │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  line_profile        JSON (profile data)                     │  │
│  │  line_profile_time   timestamp (cache validation)            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Action: Click "Login with LINE"
                │
                ▼
┌────────────────────────────────────────┐
│  useLineProfile.authenticate()          │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LineAuthService.authenticate()         │
│  1. Check if LIFF is initialized        │
│  2. Call liff.login() if needed         │
│  3. Get profile from LINE               │
│  4. Cache profile (24hr validity)       │
│  5. Update state                        │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LiffClient.getProfile()                │
│  - liff.init()                          │
│  - liff.login() (if not logged in)     │
│  - liff.getProfile()                    │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LINE Platform                          │
│  - User authentication                  │
│  - Profile data retrieval               │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Profile Data Returned                  │
│  {                                      │
│    userId: "U1234...",                  │
│    displayName: "John Doe",             │
│    pictureUrl: "https://...",           │
│    statusMessage: "Hello!"              │
│  }                                      │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  POST /api/auth/profile                 │
│  - Check if member exists               │
│  - Create or update in database         │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Supabase Database                      │
│  - Insert/Update members table          │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Cache Profile                          │
│  - localStorage.setItem()               │
│  - 24-hour expiration                   │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Update UI State                        │
│  - isAuthenticated = true               │
│  - profile = { ... }                    │
│  - Render ProfileDisplay                │
└────────────────────────────────────────┘
```

## Profile Refresh Flow

```
User Action: Click "Refresh"
                │
                ▼
┌────────────────────────────────────────┐
│  useLineProfile.refreshProfile()        │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LineAuthService.refreshProfile()       │
│  1. Get fresh profile from LINE         │
│  2. Update cache                        │
│  3. Update lastUpdated timestamp        │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LiffClient.getProfile()                │
│  - Direct API call to LINE              │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Update Cache & State                   │
│  - New profile data                     │
│  - New timestamp                        │
└────────────────────────────────────────┘
```

## Cache Loading Flow

```
App Mount / Page Load
        │
        ▼
┌────────────────────────────────────────┐
│  useLineProfile() useEffect             │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  LineAuthService.loadFromCache()        │
│  1. Get from localStorage               │
│  2. Check timestamp                     │
│  3. Validate (< 24 hours)               │
└─────────────┬──────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
   Valid Cache   Expired/None
        │           │
        ▼           ▼
┌─────────────┐ ┌──────────────┐
│ Load Profile│ │ Set Loading  │
│ from Cache  │ │ to false     │
└─────────────┘ └──────────────┘
```

## Component Hierarchy

```
App (Root Layout)
│
├── AuthProvider (React Context)
│   │
│   └── ProfilePage
│       │
│       └── ProfileDisplay
│           │
│           ├── Card
│           │   ├── CardHeader
│           │   │   ├── CardTitle (with CheckCircle icon)
│           │   │   └── CardDescription (last updated)
│           │   │
│           │   └── CardContent
│           │       ├── Avatar
│           │       │   ├── AvatarImage
│           │       │   └── AvatarFallback
│           │       │
│           │       └── Buttons
│           │           ├── RefreshButton
│           │           └── LogoutButton
│           │
│           ├── LoadingSpinner (when loading)
│           │
│           └── ErrorDisplay (on error)
```

## Data Flow

### State Management

```
LineAuthService (Singleton)
        │
        │ manages
        │
        ▼
    AuthState {
        isAuthenticated: boolean
        isLoading: boolean
        profile: LineUserProfile | null
        error: Error | null
        lastUpdated: Date | null
    }
        │
        │ exposed via
        │
        ▼
useLineProfile() Hook
        │
        │ consumed by
        │
        ▼
React Components
        │
        │ render
        │
        ▼
    User Interface
```

### Cache Strategy

```
┌──────────────────────────────────────┐
│  Cache Lifecycle                     │
│                                      │
│  1. Login                            │
│     ├─▶ Fetch from LINE              │
│     ├─▶ Save to localStorage         │
│     └─▶ Set timestamp                │
│                                      │
│  2. App Load                         │
│     ├─▶ Read from localStorage       │
│     ├─▶ Check timestamp              │
│     ├─▶ If < 24hrs: Use cache       │
│     └─▶ If ≥ 24hrs: Clear cache     │
│                                      │
│  3. Refresh                          │
│     ├─▶ Fetch from LINE              │
│     ├─▶ Update localStorage          │
│     └─▶ Update timestamp             │
│                                      │
│  4. Logout                           │
│     ├─▶ Clear localStorage           │
│     └─▶ Reset state                  │
└──────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│  Security Layers                        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  LINE Platform                    │ │
│  │  - OAuth 2.0 Authentication       │ │
│  │  - LIFF ID Validation             │ │
│  └───────────────────────────────────┘ │
│                │                        │
│                ▼                        │
│  ┌───────────────────────────────────┐ │
│  │  Next.js Application              │ │
│  │  - Environment Variable Isolation │ │
│  │  - Server/Client Separation       │ │
│  └───────────────────────────────────┘ │
│                │                        │
│                ▼                        │
│  ┌───────────────────────────────────┐ │
│  │  Supabase                         │ │
│  │  - Row Level Security (RLS)       │ │
│  │  - Cookie-based Sessions          │ │
│  │  - Service Role Key Protection    │ │
│  └───────────────────────────────────┘ │
│                │                        │
│                ▼                        │
│  ┌───────────────────────────────────┐ │
│  │  Browser Storage                  │ │
│  │  - Profile data only (no tokens)  │ │
│  │  - 24-hour expiration             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## API Endpoints

```
/api/auth/profile
│
├── GET
│   ├── Input: ?lineUserId=U1234...
│   ├── Process:
│   │   └── Query Supabase for member
│   └── Output:
│       └── { exists: true, member: {...}, profile: null }
│
└── POST
    ├── Input: { userId, displayName, pictureUrl, statusMessage }
    ├── Process:
    │   ├── Check if member exists
    │   ├── If new: INSERT into members
    │   └── If exists: UPDATE members
    └── Output:
        └── { success: true, member: {...}, isNew: false }
```

## File Dependencies

```
components/auth/profile-display.tsx
    ├── hooks/use-line-profile.ts
    │   └── lib/auth/line-auth.ts
    │       └── lib/liff/client.ts
    │           └── @line/liff
    │
    ├── components/ui/loading-spinner.tsx
    ├── components/ui/error-display.tsx
    ├── components/ui/button.tsx
    ├── components/ui/card.tsx
    └── components/ui/avatar.tsx

app/api/auth/profile/route.ts
    ├── lib/supabase/server.ts
    │   └── @supabase/ssr
    └── types/liff.ts

lib/auth/auth-store.tsx
    └── hooks/use-line-profile.ts
```

## Technology Stack Dependencies

```
┌─────────────────────────────────┐
│  Core Framework                 │
│  - Next.js 14.2.33              │
│  - React 18.3.1                 │
│  - TypeScript 5.x               │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Authentication                 │
│  - @line/liff 2.23.1            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Database                       │
│  - @supabase/ssr 0.5.1          │
│  - @supabase/supabase-js 2.45.4 │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  UI & Styling                   │
│  - Tailwind CSS 3.4.14          │
│  - Lucide React 0.451.0         │
└─────────────────────────────────┘
```

---

**Architecture Version**: 1.0  
**Last Updated**: October 23, 2025  
**Task**: TASK-017-2 - LINE User Profile Retrieval System
