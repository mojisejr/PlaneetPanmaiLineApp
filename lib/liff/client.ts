import liff from '@line/liff';
import type { LiffClient, LiffProfile, LiffConfig } from '@/types/liff';
import { LiffError, LiffErrorType } from '@/types/liff';
import { getLiffConfig, validateLiffConfig, liffLogger } from './config';

/**
 * LIFF Client Implementation
 * Manages LINE LIFF SDK initialization and operations
 */
class LiffClientImpl implements LiffClient {
  public liff = liff;
  public isInitialized = false;
  private config: LiffConfig | null = null;

  /**
   * Initialize LIFF SDK
   * Must be called before using any LIFF features
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      liffLogger.log('LIFF already initialized');
      return;
    }

    try {
      // Get and validate configuration
      this.config = getLiffConfig();
      validateLiffConfig(this.config);

      liffLogger.log('Initializing LIFF with ID:', this.config.liffId);

      // Initialize LIFF SDK
      const initConfig: { liffId: string } = {
        liffId: this.config.liffId,
      };
      
      await liff.init(initConfig);

      this.isInitialized = true;
      liffLogger.log('LIFF initialized successfully');

      // Log additional info in development
      if (liffLogger.enabled) {
        liffLogger.log('Is in client:', this.isInClient());
        liffLogger.log('Is logged in:', liff.isLoggedIn());
        liffLogger.log('OS:', liff.getOS());
        liffLogger.log('Language:', liff.getLanguage());
      }
    } catch (error) {
      this.isInitialized = false;
      liffLogger.error('LIFF initialization failed:', error);
      
      throw new LiffError(
        LiffErrorType.INITIALIZATION_FAILED,
        `Failed to initialize LIFF: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Login to LINE
   * Redirects user to LINE login if not logged in
   */
  login(): void {
    if (!this.isInitialized) {
      throw new LiffError(
        LiffErrorType.INITIALIZATION_FAILED,
        'LIFF is not initialized. Call initialize() first.'
      );
    }

    try {
      liffLogger.log('Attempting login...');
      liff.login();
    } catch (error) {
      liffLogger.error('Login failed:', error);
      throw new LiffError(
        LiffErrorType.LOGIN_FAILED,
        `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Logout from LINE
   */
  logout(): void {
    if (!this.isInitialized) {
      throw new LiffError(
        LiffErrorType.INITIALIZATION_FAILED,
        'LIFF is not initialized. Call initialize() first.'
      );
    }

    try {
      liffLogger.log('Logging out...');
      liff.logout();
      liffLogger.log('Logged out successfully');
    } catch (error) {
      liffLogger.error('Logout failed:', error);
    }
  }

  /**
   * Get user profile from LINE
   * @returns User profile or null if not logged in
   */
  async getProfile(): Promise<LiffProfile | null> {
    if (!this.isInitialized) {
      throw new LiffError(
        LiffErrorType.INITIALIZATION_FAILED,
        'LIFF is not initialized. Call initialize() first.'
      );
    }

    if (!liff.isLoggedIn()) {
      liffLogger.warn('User is not logged in');
      return null;
    }

    try {
      liffLogger.log('Fetching user profile...');
      const profile = await liff.getProfile();
      
      const liffProfile: LiffProfile = {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };

      liffLogger.log('Profile fetched successfully:', liffProfile);
      return liffProfile;
    } catch (error) {
      liffLogger.error('Failed to fetch profile:', error);
      throw new LiffError(
        LiffErrorType.PROFILE_FETCH_FAILED,
        `Failed to fetch profile: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if running in LINE client
   * @returns true if in LINE app, false if in external browser
   */
  isInClient(): boolean {
    if (!this.isInitialized) {
      return false;
    }

    return liff.isInClient();
  }

  /**
   * Check if user is logged in
   * @returns true if logged in
   */
  isLoggedIn(): boolean {
    if (!this.isInitialized) {
      return false;
    }

    return liff.isLoggedIn();
  }

  /**
   * Get LIFF context information
   */
  getContext() {
    if (!this.isInitialized) {
      return null;
    }

    return liff.getContext();
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    if (!this.isInitialized || !liff.isLoggedIn()) {
      return null;
    }

    return liff.getAccessToken();
  }
}

/**
 * Singleton instance of LIFF client
 */
export const liffClient: LiffClient = new LiffClientImpl();

/**
 * Export LIFF client as default
 */
export default liffClient;
