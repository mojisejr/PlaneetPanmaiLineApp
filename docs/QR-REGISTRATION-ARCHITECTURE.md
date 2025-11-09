# QR Registration Route Architecture

## Overview

This document describes the QR registration route architecture implemented to fix the infinite loop issue (#106) by isolating registration logic from component mounting race conditions.

## Problem Solved

The original infinite loop was caused by multiple registration calls happening simultaneously from:
- `hooks/use-line-profile.ts:25` - autoRegister() function
- `hooks/use-line-profile.ts:127` - checkRegistration() function
- `components/calculator/calculator-layout.tsx:49` - Component mount
- `app/profile/page.tsx` - Multiple authentication triggers

## Solution Architecture

### 1. Dedicated Registration Route
- **Route**: `/qr-scan-member`
- **Purpose**: Isolated registration for QR code scans
- **Method**: POST with LINE profile data
- **Features**: Request deduplication, input validation, comprehensive error handling

### 2. API Endpoint
- **Endpoint**: `/api/qr/qr-scan-member`
- **GET**: Check if user exists
- **POST**: Auto-register new users
- **Security**: Service role for RLS bypass, input validation with Zod

### 3. Registration Flow
1. User scans QR code → Opens `/qr-scan-member`
2. LIFF authentication → Gets LINE profile
3. Check registration status via API
4. Auto-register if needed
5. Redirect to calculator/profile

## Implementation Details

### Files Created/Modified

#### New Files
- `app/api/qr/qr-scan-member/route.ts` - API endpoint for registration
- `app/qr-scan-member/page.tsx` - QR registration page

#### Modified Files
- `hooks/use-line-profile.ts` - Removed all registration logic
- `components/calculator/calculator-layout.tsx` - Removed registration calls

### API Endpoints

#### GET /api/qr/qr-scan-member?lineUserId={id}
```typescript
Response: {
  exists: boolean,
  member?: Member,
  needsRegistration: boolean
}
```

#### POST /api/qr/qr-scan-member
```typescript
Request: {
  lineUserId: string,
  displayName: string,
  pictureUrl?: string
}

Response: {
  success: boolean,
  member?: Member,
  action: 'created' | 'already_exists',
  message: string
}
```

## Safety Features

1. **Request Deduplication**: Prevents concurrent registrations for same user
2. **Input Validation**: Zod schemas for all inputs
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Security**: Service role for bypassing RLS only during registration
5. **Race Condition Prevention**: Isolated registration logic prevents race conditions

## Usage

### For QR Code Registration
1. Generate QR code pointing to: `{APP_URL}/qr-scan-member`
2. User scans QR code
3. System handles registration automatically
4. User redirected to appropriate page

### Integration with Existing Components
- Components no longer trigger registration
- Registration only happens via QR route
- Existing authentication flow unchanged
- Calculator and profile pages work independently

## Benefits

1. **Eliminates Infinite Loop**: No race conditions from multiple registration calls
2. **Clear User Flow**: Dedicated registration path for QR scans
3. **Maintainable**: Isolated registration logic
4. **Scalable**: Can handle high registration volumes
5. **Secure**: Proper validation and error handling

## Testing

1. Test QR registration flow end-to-end
2. Test existing user scenario
3. Test error handling scenarios
4. Verify no infinite loops in components
5. Load test for concurrent registrations

## Migration Notes

- Old registration calls have been removed from components
- Existing users remain unaffected
- New registration flow is backward compatible
- No database changes required