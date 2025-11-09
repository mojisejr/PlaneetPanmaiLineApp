# Test Infrastructure Documentation

## Overview

This repository uses Jest with React Testing Library and MSW (Mock Service Worker) for unit testing.

## Test Setup

### Dependencies

- **jest**: Test framework
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM
- **@testing-library/user-event**: User interaction simulation
- **msw**: API mocking for tests
- **ts-jest**: TypeScript support for Jest
- **ts-node**: TypeScript execution for Jest config

### Configuration Files

- `jest.config.ts`: Main Jest configuration
- `jest.setup.ts`: Test environment setup (runs after test framework)
- `jest.polyfills.ts`: Polyfills for Node.js environment (runs before test framework)
- `tests/setup-msw.ts`: MSW mock handlers for external APIs

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPatterns="use-liff"
```

## Test Structure

### Unit Tests

Unit tests use MSW to mock external API calls. No real secrets are required.

**Example test location**: `src/hooks/use-liff.test.ts`

### Mock Handlers

MSW handlers are defined in `tests/setup-msw.ts`:

- LINE JWKS endpoint: `https://api.line.me/oauth2/v2.1/keys`
- LINE token verification: `https://api.line.me/oauth2/v2.1/verify`
- Session API: `/api/auth/line-session`

### Environment Variables

Test environment variables are set in `jest.setup.ts`:

```typescript
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
NEXT_PUBLIC_LIFF_ID=test-liff-id
JWT_SECRET=test-jwt-secret-for-testing-only
```

## CI/CD Integration

### GitHub Actions Workflows

Two separate jobs in `.github/workflows/ci.yml`:

#### 1. Unit Tests Job

- Runs on: All pushes and pull requests
- Uses: Mocked APIs (MSW)
- Secrets: None required (uses mock values)
- Purpose: Validate code changes without external dependencies

```yaml
unit-tests:
  runs-on: ubuntu-latest
  steps:
    - Checkout code
    - Setup Node.js
    - Install dependencies
    - Run linter
    - Run TypeScript check
    - Run unit tests (with MSW mocks)
    - Build application (with mock env vars)
```

#### 2. Integration Tests Job

- Runs on: Staging branch push OR manual workflow dispatch
- Uses: Real secrets from GitHub repository settings
- Secrets: Required (JWT_SECRET, NEXT_PUBLIC_SUPABASE_URL, etc.)
- Purpose: Validate integration with real services

```yaml
integration-tests:
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/staging' || github.event_name == 'workflow_dispatch'
  steps:
    - Checkout code
    - Setup Node.js
    - Install dependencies
    - Validate secrets are present
    - Run integration tests (with real secrets)
    - Build application (with real configuration)
```

### Setting Up Repository Secrets

For integration tests, configure these secrets in GitHub repository settings:

- `JWT_SECRET`: Custom JWT signing secret
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_LIFF_ID`: LINE LIFF application ID
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Writing New Tests

### Component Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { MyComponent } from './my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Hook Tests

```typescript
import { renderHook, waitFor, act } from '@testing-library/react'
import { useMyHook } from './use-my-hook'

describe('useMyHook', () => {
  it('should handle state correctly', async () => {
    const { result } = renderHook(() => useMyHook())
    
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
    
    act(() => {
      result.current.doAction()
    })
    
    expect(result.current.value).toBe('expected')
  })
})
```

### Mocking API Calls

Add new handlers to `tests/setup-msw.ts`:

```typescript
rest.post('/api/new-endpoint', async (req, res, ctx) => {
  const body = await req.json<{ param: string }>()
  
  return res(
    ctx.status(200),
    ctx.json({ success: true, data: 'result' })
  )
})
```

## Common Issues

### TextEncoder/TextDecoder Not Defined

**Solution**: Already handled in `jest.polyfills.ts`

### Response/Request Not Defined

**Solution**: Use MSW v1 which has better Node.js compatibility

### Act Warnings

**Solution**: Wrap state updates in `act()`:

```typescript
act(() => {
  result.current.updateState()
})
```

### Module Not Found

**Solution**: Check `jest.config.ts` has correct `moduleNameMapper`:

```typescript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach`/`afterEach` to reset state
3. **Async**: Always use `waitFor()` for async operations
4. **Mocks**: Mock external dependencies, not internal logic
5. **Coverage**: Aim for high coverage on critical paths
6. **Act**: Wrap React state updates in `act()`

## Troubleshooting

### Tests Pass Locally But Fail in CI

- Check environment variables in CI
- Verify Node.js version matches
- Check for timing issues (increase timeouts)

### MSW Not Intercepting Requests

- Ensure `server.listen()` is called before tests
- Check request URL matches handler pattern exactly
- Verify MSW setup is imported in `jest.setup.ts`

### Flaky Tests

- Use `waitFor()` instead of fixed timeouts
- Increase timeout for slow operations
- Check for race conditions in async code

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
