# Registration Flow Controller - Integration Guide

## Overview

The Registration Flow Controller is a layout-level component that orchestrates the complete LINE LIFF registration flow with state management, error handling, and smooth transitions.

## Quick Start

### Basic Usage

```tsx
import { RegistrationFlowController } from '@/components/registration/registration-flow-controller'

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <RegistrationFlowController>
          {children}
        </RegistrationFlowController>
      </body>
    </html>
  )
}
```

### With Options

```tsx
import { RegistrationFlowController } from '@/components/registration/registration-flow-controller'
import { useRouter } from 'next/navigation'

export default function AppLayout({ children }) {
  const router = useRouter()

  const handleRegistrationComplete = () => {
    console.log('Registration complete, navigating to calculator...')
    router.push('/calculator')
  }

  return (
    <RegistrationFlowController
      onComplete={handleRegistrationComplete}
      autoHideWelcome={true}
      welcomeDelay={5000}
      className="custom-welcome-styles"
    >
      {children}
    </RegistrationFlowController>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Main app content to render after registration |
| `onComplete` | `() => void` | `undefined` | Callback fired when registration flow completes |
| `autoHideWelcome` | `boolean` | `true` | Auto-hide welcome screen after delay |
| `welcomeDelay` | `number` | `5000` | Delay in milliseconds before auto-hiding welcome (only if `autoHideWelcome` is true) |
| `className` | `string` | `''` | Additional CSS classes for welcome screen |

## Flow States

The controller manages the following states:

1. **initializing**: LIFF SDK is initializing
2. **authenticating**: User is logging in with LINE
3. **registering**: Auto-registration is in progress
4. **success**: Registration completed (shows welcome screen for new users)
5. **ready**: Flow complete, ready to show main app
6. **error**: An error occurred (with retry functionality)

## Using the Hook

Access registration flow state in child components:

```tsx
'use client'

import { useRegistrationFlow } from '@/components/registration/registration-flow-controller'

export function MyComponent() {
  const {
    isReady,
    isNewUser,
    member,
    hasError,
    isRegistering,
  } = useRegistrationFlow()

  if (!isReady) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Welcome {member?.display_name}!</h1>
      {isNewUser && <p>Thank you for joining!</p>}
    </div>
  )
}
```

## Integration with MemberStatusProvider

For full state management, wrap with `MemberStatusProvider`:

```tsx
import { MemberStatusProvider } from '@/lib/context/member-status-context'
import { RegistrationFlowController } from '@/components/registration/registration-flow-controller'

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <MemberStatusProvider>
          <RegistrationFlowController>
            {children}
          </RegistrationFlowController>
        </MemberStatusProvider>
      </body>
    </html>
  )
}
```

## Error Handling

The controller automatically handles errors from:
- LIFF initialization
- LINE authentication
- Auto-registration
- Member data fetching

Users can retry failed operations with the built-in retry button.

## Example: Full Layout Integration

```tsx
// app/layout.tsx
import { MemberStatusProvider } from '@/lib/context/member-status-context'
import { RegistrationFlowController } from '@/components/registration/registration-flow-controller'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <MemberStatusProvider>
          <RegistrationFlowController
            onComplete={() => console.log('User ready!')}
            autoHideWelcome={true}
            welcomeDelay={5000}
          >
            {children}
          </RegistrationFlowController>
        </MemberStatusProvider>
      </body>
    </html>
  )
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│  RegistrationFlowController             │
│  ┌───────────────────────────────────┐  │
│  │ State Orchestration               │  │
│  │ - useLiff (LIFF SDK)              │  │
│  │ - useLineProfile (Auth)           │  │
│  │ - useMemberStatus (Global State)  │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ Flow States                       │  │
│  │ initializing → authenticating →   │  │
│  │ registering → success/ready       │  │
│  └───────────────────────────────────┘  │
│                                          │
│  ┌───────────────────────────────────┐  │
│  │ UI Components                     │  │
│  │ - LoadingSpinner                  │  │
│  │ - RegistrationWelcome             │  │
│  │ - ErrorDisplay                    │  │
│  │ - Children (Main App)             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Testing

The component includes comprehensive tests covering:
- All flow states and transitions
- Error handling and retry logic
- Props and configuration options
- Hook functionality
- Accessibility compliance

Run tests (when test framework is set up):
```bash
npm test registration-flow-controller
```

## Thai Language Support

All user-facing messages are in Thai:
- Loading states: "กำลังเริ่มต้นระบบ...", "กำลังยืนยันตัวตน...", "กำลังลงทะเบียน..."
- Error messages: "เกิดข้อผิดพลาด"
- Retry counter: "ความพยายามครั้งที่ X"
- Waiting messages: "กรุณารอสักครู่"

## Mobile-First Design

The controller is optimized for LINE WebView:
- Responsive layouts for small screens
- Large touch targets (44px minimum)
- Proper contrast ratios (WCAG 2.1 AA)
- Reduced motion support

## Performance

- Memoized state calculations
- Optimized re-renders with useCallback and useMemo
- Lazy evaluation of error messages
- Efficient state transitions

## Troubleshooting

**Issue**: Controller stuck in "initializing"
- Check LIFF configuration in environment variables
- Verify LIFF ID is correct
- Ensure app is opened within LINE

**Issue**: Error state persists after retry
- Check network connectivity
- Verify Supabase configuration
- Check browser console for detailed errors

**Issue**: Welcome screen doesn't auto-hide
- Ensure `autoHideWelcome` is set to `true`
- Check `welcomeDelay` value
- Verify `onComplete` callback is defined

## Best Practices

1. **Always wrap with MemberStatusProvider** for full state management
2. **Set onComplete callback** to navigate to main app
3. **Use welcomeDelay appropriately** (3-5 seconds recommended)
4. **Monitor error patterns** to improve user experience
5. **Test on actual LINE app** for accurate behavior

## Related Components

- `RegistrationWelcome`: Welcome screen UI component
- `MemberStatusProvider`: Global member state context
- `useLiff`: LIFF SDK hook
- `useLineProfile`: Authentication hook
- `LoadingSpinner`: Loading indicator
- `ErrorDisplay`: Error message component
