/**
 * Product Card Component Tests
 * 
 * Unit tests for ProductCard component covering:
 * - Rendering with product data
 * - Accessibility features
 * - User interactions
 * - Loading states
 * - Responsive design
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ProductCard, ProductCardSkeleton } from './product-card'
import type { ProductWithPricing } from '@/lib/types/product-ui'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className }: any) => (
    <img src={src} alt={alt} className={className} data-fill={fill} />
  ),
}))

// Test data
const mockProduct: ProductWithPricing = {
  id: 'prod-001',
  variety_name: 'ทุเรียนหมอนทอง',
  size: 'กลาง (40-50 ซม.)',
  plant_shape: 'กระโดง',
  base_price: 1500,
  is_available_in_store: true,
  image_url: 'https://example.com/durian.jpg',
  description: 'ทุเรียนพันธุ์ดี คุณภาพเยี่ยม',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  price_tiers: [
    {
      id: 'tier-001',
      product_id: 'prod-001',
      min_quantity: 1,
      max_quantity: 4,
      special_price: 1500,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'tier-002',
      product_id: 'prod-001',
      min_quantity: 5,
      max_quantity: 9,
      special_price: 1400,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'tier-003',
      product_id: 'prod-001',
      min_quantity: 10,
      max_quantity: null,
      special_price: 1300,
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ],
}

const mockReferenceProduct: ProductWithPricing = {
  ...mockProduct,
  id: 'prod-002',
  is_available_in_store: false,
  variety_name: 'ทุเรียนกระดุมทอง',
}

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render product information correctly', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('ทุเรียนหมอนทอง')).toBeInTheDocument()
      expect(screen.getByText(/กลาง \(40-50 ซม\.\)/)).toBeInTheDocument()
      expect(screen.getByText(/กระโดง/)).toBeInTheDocument()
      expect(screen.getByText('ทุเรียนพันธุ์ดี คุณภาพเยี่ยม')).toBeInTheDocument()
    })

    it('should display "มีในร้าน" badge for available products', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('มีในร้าน')).toBeInTheDocument()
    })

    it('should display "ราคาอ้างอิง" badge for reference products', () => {
      render(<ProductCard product={mockReferenceProduct} />)

      expect(screen.getByText('ราคาอ้างอิง')).toBeInTheDocument()
    })

    it('should format price in Thai Baht', () => {
      render(<ProductCard product={mockProduct} />)

      // Check if price is formatted (฿1,500 or similar Thai format)
      expect(screen.getByText(/1,500/)).toBeInTheDocument()
    })

    it('should display price tiers information', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText(/ราคาตามปริมาณ:/)).toBeInTheDocument()
      expect(screen.getByText(/1-4 ต้น/)).toBeInTheDocument()
      expect(screen.getByText(/5-9 ต้น/)).toBeInTheDocument()
    })

    it('should render product image when image_url is provided', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByAltText('รูปภาพ ทุเรียนหมอนทอง')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/durian.jpg')
    })

    it('should show placeholder when image_url is null', () => {
      const productNoImage = { ...mockProduct, image_url: null }
      render(<ProductCard product={productNoImage} />)

      expect(screen.getByText('ไม่มีรูปภาพ')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = jest.fn()
      render(<ProductCard product={mockProduct} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(handleClick).toHaveBeenCalledWith(mockProduct)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should support keyboard interaction (Enter key)', () => {
      const handleClick = jest.fn()
      render(<ProductCard product={mockProduct} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(handleClick).toHaveBeenCalledWith(mockProduct)
    })

    it('should support keyboard interaction (Space key)', () => {
      const handleClick = jest.fn()
      render(<ProductCard product={mockProduct} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ' })

      expect(handleClick).toHaveBeenCalledWith(mockProduct)
    })

    it('should not be interactive when onClick is not provided', () => {
      render(<ProductCard product={mockProduct} />)

      const card = screen.queryByRole('button')
      expect(card).not.toBeInTheDocument()
    })

    it('should show selected state when isSelected is true', () => {
      const { container } = render(
        <ProductCard product={mockProduct} isSelected={true} onClick={jest.fn()} />
      )

      const card = container.querySelector('[aria-pressed="true"]')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have minimum 48px touch target height', () => {
      const { container } = render(<ProductCard product={mockProduct} />)

      const card = container.firstChild as HTMLElement
      const minHeight = parseInt(card.style.minHeight || '0')
      expect(minHeight).toBeGreaterThanOrEqual(144) // 48px * 3
    })

    it('should have proper ARIA labels', () => {
      render(<ProductCard product={mockProduct} onClick={jest.fn()} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-label', 'เลือกสินค้า ทุเรียนหมอนทอง')
    })

    it('should have proper ARIA pressed state', () => {
      render(<ProductCard product={mockProduct} isSelected={true} onClick={jest.fn()} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    it('should have tabindex for keyboard navigation', () => {
      render(<ProductCard product={mockProduct} onClick={jest.fn()} />)

      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('should pass accessibility audit', async () => {
      const { container } = render(<ProductCard product={mockProduct} />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Loading State', () => {
    it('should not trigger onClick when isLoading is true', () => {
      const handleClick = jest.fn()
      render(<ProductCard product={mockProduct} isLoading={true} onClick={handleClick} />)

      const card = screen.getByRole('button')
      fireEvent.click(card)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ProductCard product={mockProduct} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})

describe('ProductCardSkeleton', () => {
  it('should render skeleton loading state', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Check for animated skeleton elements
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should apply custom className', () => {
    const { container } = render(<ProductCardSkeleton className="custom-skeleton" />)

    expect(container.firstChild).toHaveClass('custom-skeleton')
  })

  it('should have consistent layout with ProductCard', () => {
    const { container } = render(<ProductCardSkeleton />)

    // Should have image skeleton
    expect(container.querySelector('.aspect-square')).toBeInTheDocument()
  })
})
