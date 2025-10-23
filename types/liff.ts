import type { Liff } from '@line/liff';

/**
 * LIFF Configuration Interface
 * Defines the structure for LIFF app configuration
 */
export interface LiffConfig {
  liffId: string;
  mock?: boolean;
}

/**
 * LIFF State Interface
 * Represents the current state of LIFF initialization
 */
export interface LiffState {
  isInitialized: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: Error | null;
  profile: LiffProfile | null;
}

/**
 * LIFF Profile Interface
 * User profile information from LINE
 */
export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

/**
 * LIFF Error Types
 */
export enum LiffErrorType {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  NOT_IN_CLIENT = 'NOT_IN_CLIENT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PROFILE_FETCH_FAILED = 'PROFILE_FETCH_FAILED',
}

/**
 * LIFF Error Class
 */
export class LiffError extends Error {
  type: LiffErrorType;

  constructor(type: LiffErrorType, message: string) {
    super(message);
    this.name = 'LiffError';
    this.type = type;
  }
}

/**
 * LIFF Client Interface
 * Provides methods to interact with LIFF SDK
 */
export interface LiffClient {
  liff: Liff | null;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: () => void;
  logout: () => void;
  getProfile: () => Promise<LiffProfile | null>;
  isInClient: () => boolean;
  isLoggedIn: () => boolean;
}
