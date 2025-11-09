// Now safe to import other modules
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_LIFF_ID = 'test-liff-id'
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only'

// Import MSW setup to mock network requests (after polyfills)
import './tests/setup-msw'
