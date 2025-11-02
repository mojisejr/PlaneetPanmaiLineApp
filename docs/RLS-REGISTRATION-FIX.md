# RLS Registration Fix - Technical Documentation

## Problem Statement

When logging in as a user, the app attempted to register the user in the `members` table via client-side Supabase using the anon key. However, due to Row Level Security (RLS) policies enabled on the `members` table, unauthenticated requests were blocked with error 42501:

```
{
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"members\""
}
```

This caused an infinite retry loop in the auto-registration logic, as the client kept retrying the insert and failing due to RLS.

## Root Cause

1. RLS policy (see `lib/supabase/migrations/004_enable_rls.sql`) requires authenticated Supabase JWT with proper claims
2. The app authenticates with LINE (LIFF) but not with Supabase Auth, so no valid Supabase session/JWT is present
3. Client-side registration used the anon key, which was blocked by RLS
4. No retry limit was enforced, causing infinite loops

## Solution

Migrated member registration from client-side operations to server-side API route with admin privileges:

### 1. Created Admin Supabase Client (`lib/supabase/admin.ts`)

```typescript
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

**Security**: Uses `service_role` key to bypass RLS. Only used in server-side API routes, never exposed to client.

### 2. Updated API Route (`app/api/auth/profile/route.ts`)

- POST endpoint now uses `createAdminClient()` instead of regular client
- Bypasses RLS policies for member registration/update
- Returns detailed error messages for debugging

### 3. Updated Auto-Registration Service (`lib/services/auto-registration.ts`)

**Key Changes**:
- Calls `/api/auth/profile` POST endpoint instead of direct Supabase insert
- Added retry limit: **3 attempts maximum** (prevents infinite loops)
- Implements exponential backoff: 1s, 2s, 4s delays between retries
- Detects RLS errors and stops retrying (indicates configuration issue)
- Improved error handling with user-friendly Thai messages

**Retry Logic**:
```typescript
for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ userId, displayName })
    })
    // ... handle response
  } catch (error) {
    // Check for RLS errors - don't retry
    if (error.includes('row-level security')) break
    
    // Exponential backoff
    await delay(RETRY_DELAY_MS * Math.pow(2, attempt))
  }
}
```

## Security Considerations

### What Changed
- Member registration now uses service_role key (admin access) via server API
- RLS policies remain enabled and enforced for all other operations
- Client-side operations continue to use anon key with RLS protection

### What Stays Secure
- Service_role key is only accessible in server-side API routes (Next.js server components)
- RLS policies still protect members table for SELECT/UPDATE operations
- No direct client access to service_role key
- Admin operations limited to registration/update only

### Best Practices Followed
1. ✅ Service role key stored in environment variable (`SUPABASE_SERVICE_ROLE_KEY`)
2. ✅ Admin client only created in server-side API routes
3. ✅ RLS policies remain enabled (no open anon inserts)
4. ✅ Retry limits prevent abuse/DoS
5. ✅ Detailed server-side logging for audit trail

## Testing Checklist

### Manual Testing
- [ ] New user can successfully register via LINE login
- [ ] Existing user data is updated on subsequent logins
- [ ] Registration completes within 3 attempts for normal cases
- [ ] No infinite retry loops in browser console/logs
- [ ] Error messages are displayed in Thai for users
- [ ] RLS errors (if any) are logged and stop retrying

### Verification Steps
1. Log in as new LINE user
2. Check browser console for registration success log
3. Verify member row created in Supabase `members` table
4. Log out and log in again - should update existing member
5. Check no RLS error 42501 appears in logs

### Edge Cases
- [ ] Network failure during registration - retries up to 3 times
- [ ] Supabase timeout - exponential backoff works correctly
- [ ] Missing service_role key - API returns meaningful error
- [ ] Invalid LINE profile data - validation error returned

## Migration Notes

### For Developers
- No changes required to client-side code consuming auto-registration
- Existing `useLineProfile()` hook works as before
- Error handling improved automatically

### For Deployment
- ⚠️ **CRITICAL**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in production environment
- Verify environment variable is available to Next.js server runtime
- Monitor server logs for any admin client initialization errors

### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (for client operations)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (for admin registration - server only)
```

## Monitoring & Logging

### Success Logs
```
[AutoRegistrationService] User registered successfully via API
[API] Member created successfully: {userId: "...", action: "created"}
```

### Error Logs to Watch
```
[AutoRegistrationService] RLS error detected - this should not happen with API route
[API] Failed to create member: {error details}
[AutoRegistrationService] All registration attempts failed
```

### Metrics to Track
- Registration success rate (should be >99%)
- Average retry attempts (should be 1 for most cases)
- RLS errors after fix (should be 0)
- API response time for registration (<500ms expected)

## Rollback Plan

If issues occur after deployment:

1. **Immediate Rollback**: Revert to previous commit
2. **Temporary Fix**: Disable auto-registration and manual user creation
3. **Debug**: Check environment variables and Supabase connectivity
4. **Re-deploy**: Fix issues and re-deploy with monitoring

## Related Files

- `lib/supabase/admin.ts` - Admin client factory
- `app/api/auth/profile/route.ts` - Registration API endpoint
- `lib/services/auto-registration.ts` - Auto-registration service
- `lib/supabase/migrations/004_enable_rls.sql` - RLS policies
- `hooks/use-line-profile.ts` - React hook integration

## References

- [Issue #X: RLS blocks client-side registration](../../../issues/X)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
