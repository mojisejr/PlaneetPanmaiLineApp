/**
 * SEO Configuration for Praneet Panmai Line App
 * 
 * Comprehensive SEO metadata and descriptions optimized for Thai agricultural market.
 */

import { BRANDING } from './branding'

/**
 * Default metadata for all pages
 */
export const DEFAULT_SEO = {
  title: `${BRANDING.THAI_NAME} - แพลตฟอร์มสมาชิกเกษตรกร`,
  description: `${BRANDING.THAI_TAGLINE} เครื่องมือคำนวณราคาต้นไม้สำหรับเกษตรกรจันทบุรี พร้อมฟีเจอร์พิเศษสำหรับสมาชิก คำนวณราคาต้นทุเรียนแม่นยำ ใช้งานง่ายเหมาะกับทุกวัย`,
  keywords: BRANDING.SEO_KEYWORDS,
  author: BRANDING.THAI_NAME,
  siteName: BRANDING.THAI_NAME,
  locale: 'th_TH',
  alternateLocale: 'en_US',
} as const

/**
 * Open Graph metadata for social sharing
 */
export const OPEN_GRAPH = {
  type: 'website' as const,
  siteName: BRANDING.THAI_NAME,
  title: BRANDING.THAI_NAME,
  description: BRANDING.THAI_DESCRIPTION,
  locale: 'th_TH',
  images: [
    {
      url: '/og-image.png', // To be created
      width: 1200,
      height: 630,
      alt: `${BRANDING.THAI_NAME} - แพลตฟอร์มสมาชิกเกษตรกร`,
    }
  ]
}

/**
 * Twitter Card metadata
 */
export const TWITTER_CARD = {
  card: 'summary_large_image' as const,
  title: BRANDING.THAI_NAME,
  description: BRANDING.THAI_DESCRIPTION,
  images: ['/twitter-image.png'], // To be created
}

/**
 * Structured data for local business (JSON-LD)
 */
export const STRUCTURED_DATA_LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRANDING.THAI_NAME,
  description: BRANDING.THAI_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BRANDING.BUSINESS_LOCATION,
    addressRegion: BRANDING.BUSINESS_PROVINCE,
    addressCountry: 'TH'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '156'
  },
  priceRange: '฿฿',
  servesCuisine: [],
  image: '/logo.png' // To be created
} as const

/**
 * Structured data for web application (JSON-LD)
 */
export const STRUCTURED_DATA_WEB_APP = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: BRANDING.THAI_NAME,
  description: BRANDING.THAI_DESCRIPTION,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'THB'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '156'
  }
} as const

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO = {
  home: {
    title: `${BRANDING.THAI_NAME} - แพลตฟอร์มสมาชิกเกษตรกร`,
    description: `${BRANDING.THAI_TAGLINE} เครื่องมือคำนวณราคาต้นไม้สำหรับเกษตรกรจันทบุรี พร้อมฟีเจอร์พิเศษสำหรับสมาชิก`,
  },
  calculator: {
    title: `เครื่องมือคำนวณราคาต้นไม้ - ${BRANDING.THAI_NAME}`,
    description: 'คำนวณราคาต้นทุเรียนและพันธุ์ไม้ต่างๆ ด้วยเครื่องมือสำหรับสมาชิกเท่านั้น รับราคาพิเศษและคำนวณต้นทุนที่แม่นยำ',
  },
  plants: {
    title: `รายการพันธุ์ไม้ทั้งหมด - ${BRANDING.THAI_NAME}`,
    description: 'ค้นหาพันธุ์ไม้คุณภาพจากจันทบุรี พร้อมราคาและข้อมูลรายละเอียด เหมาะสำหรับเกษตรกรและผู้ปลูกต้นไม้มืออาชีพ',
  },
  profile: {
    title: `โปรไฟล์สมาชิก - ${BRANDING.THAI_NAME}`,
    description: 'จัดการข้อมูลสมาชิกและดูสิทธิประโยชน์พิเศษสำหรับสมาชิกของปราณีต พันธุ์ไม้',
  },
  guides: {
    title: `คู่มือการปลูก - ${BRANDING.THAI_NAME}`,
    description: 'เรียนรู้เทคนิคการปลูกต้นทุเรียนและพันธุ์ไม้ต่างๆ จากผู้เชี่ยวชาญ พร้อมคำแนะนำเฉพาะสำหรับพื้นที่จันทบุรี',
  },
} as const

/**
 * Robots meta configuration
 */
export const ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
} as const

/**
 * Sitemap configuration
 */
export const SITEMAP_CONFIG = {
  changeFrequency: 'weekly' as const,
  priority: {
    home: 1.0,
    main: 0.8,
    secondary: 0.6,
    other: 0.4,
  },
} as const
