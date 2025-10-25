/**
 * Praneet Panmai Branding Configuration
 * 
 * Central branding constants for consistent brand identity across the application.
 * Designed for 35+ farmers and gardeners with age-appropriate accessibility settings.
 */

export const BRANDING = {
  // Thai primary branding
  THAI_NAME: 'ปราณีต พันธุ์ไม้ จันทบุรี',
  THAI_SHORT_NAME: 'ปราณีต พันธุ์ไม้',
  THAI_DESCRIPTION: 'แพลตฟอร์มสมาชิกสำหรับเกษตรกรและผู้ปลูกต้นไม้มืออาชีพ',
  THAI_TAGLINE: 'สมัครสมาชิกปราณีต พันธุ์ไม้วันนี้!',
  
  // English secondary branding
  ENGLISH_NAME: 'Praneet Panmai Chanthaburi',
  ENGLISH_SHORT_NAME: 'Praneet Panmai',
  ENGLISH_DESCRIPTION: 'Members Platform for Farmers & Gardeners',
  
  // SEO keywords
  SEO_KEYWORDS: [
    'ราคาต้นไม้ จันทบุรี',
    'ปลูกต้นทุเรียน',
    'สมาชิกเกษตรกร',
    'คำนวณราคาพันธุ์ไม้',
    'เกษตรกรจันทบุรี',
    'ต้นทุเรียนพันธุ์ดี',
    'ร้านพันธุ์ไม้ จันทบุรี',
    'ราคาต้นพันธุ์'
  ] as string[],
  
  // Contact and business info
  BUSINESS_LOCATION: 'จันทบุรี',
  BUSINESS_PROVINCE: 'Chanthaburi',
  TARGET_AUDIENCE: 'เกษตรกรและผู้ปลูกต้นไม้ อายุ 35+',
  
  // Age-appropriate design settings
  ACCESSIBILITY: {
    MIN_TOUCH_TARGET: 48, // px - Increased from standard 44px for better accessibility
    MIN_BODY_FONT: 16,    // px - Minimum readable body text
    MIN_HEADER_FONT: 18,  // px - Minimum readable header text
    HIGH_CONTRAST: true,  // Ensure 4.5:1 contrast ratio
    PREFER_LIST_MENUS: true, // Traditional list over app grid for better UX
  }
} as const

/**
 * Member tier configuration
 */
export const MEMBER_TIERS = {
  PREMIUM: {
    label: 'สมาชิกพรีเมียม',
    labelEn: 'Premium Member',
    badgeColor: 'gold',
    benefits: [
      'เครื่องมือคำนวณราคาต้นไม้',
      'ราคาพิเศษสำหรับสมาชิก',
      'คู่มือการปลูกต้นไม้',
      'พยากรณ์อากาศสำหรับเกษตร',
      'ติดต่อผู้เชี่ยวชาญ'
    ]
  },
  REGULAR: {
    label: 'สมาชิกทั่วไป',
    labelEn: 'Regular Member',
    badgeColor: 'silver',
    benefits: [
      'ดูรายการพันธุ์ไม้',
      'ข้อมูลราคาอ้างอิง',
      'เข้าถึงคู่มือพื้นฐาน'
    ]
  }
} as const

/**
 * Color palette for branding
 */
export const BRAND_COLORS = {
  // Primary green (agricultural theme)
  PRIMARY: {
    light: '#86efac',  // green-300
    main: '#22c55e',   // green-500
    dark: '#15803d',   // green-700
  },
  // Accent colors
  ACCENT: {
    gold: '#fbbf24',   // amber-400 for premium
    earth: '#92400e',  // amber-900 for grounding
  },
  // Semantic colors
  SUCCESS: '#10b981', // emerald-500
  WARNING: '#f59e0b', // amber-500
  ERROR: '#ef4444',   // red-500
} as const

/**
 * Typography settings
 */
export const TYPOGRAPHY = {
  // Font families (Thai-friendly)
  FONT_FAMILY: {
    primary: 'system-ui, -apple-system, sans-serif',
    thai: '"Sukhumvit Set", "Noto Sans Thai", sans-serif',
  },
  // Font sizes (age-appropriate)
  FONT_SIZE: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px (minimum body)
    lg: '1.125rem',  // 18px (minimum header)
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  // Line heights for readability
  LINE_HEIGHT: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const
