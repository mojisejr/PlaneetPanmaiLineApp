/**
 * Tests for ProductFilters component
 * Validates filtering functionality, accessibility, and user interactions
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ProductFilters } from './product-filters'

describe('ProductFilters', () => {
  const mockOnSizeChange = jest.fn()
  const mockOnPlantShapeChange = jest.fn()
  const mockOnAvailabilityChange = jest.fn()
  const mockOnClearFilters = jest.fn()
  
  const defaultProps = {
    selectedSize: null,
    onSizeChange: mockOnSizeChange,
    availableSizes: ['เล็ก', 'กลาง', 'ใหญ่'],
    selectedPlantShape: null as 'กระโดง' | 'ข้าง' | null,
    onPlantShapeChange: mockOnPlantShapeChange,
    availableOnly: false,
    onAvailabilityChange: mockOnAvailabilityChange,
    onClearFilters: mockOnClearFilters,
    hasActiveFilters: false,
    filteredCount: 10,
    totalCount: 10,
  }
  
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  describe('Rendering', () => {
    it('renders filter header with icon', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByText('ตัวกรอง')).toBeInTheDocument()
    })
    
    it('displays results count', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByText('แสดง 10 จาก 10 รายการ')).toBeInTheDocument()
    })
    
    it('renders all available size options', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByText('เล็ก')).toBeInTheDocument()
      expect(screen.getByText('กลาง')).toBeInTheDocument()
      expect(screen.getByText('ใหญ่')).toBeInTheDocument()
    })
    
    it('renders plant shape options', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByText('กระโดง')).toBeInTheDocument()
      expect(screen.getByText('ข้าง')).toBeInTheDocument()
    })
    
    it('renders availability checkbox', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByLabelText('แสดงเฉพาะสินค้าที่มีในร้าน')).toBeInTheDocument()
    })
    
    it('shows clear filters button when filters are active', () => {
      render(<ProductFilters {...defaultProps} hasActiveFilters={true} />)
      expect(screen.getByLabelText('ล้างตัวกรองทั้งหมด')).toBeInTheDocument()
    })
    
    it('hides clear filters button when no filters are active', () => {
      render(<ProductFilters {...defaultProps} hasActiveFilters={false} />)
      expect(screen.queryByLabelText('ล้างตัวกรองทั้งหมด')).not.toBeInTheDocument()
    })
  })
  
  describe('Size Filter Interactions', () => {
    it('calls onSizeChange when size button is clicked', () => {
      render(<ProductFilters {...defaultProps} />)
      fireEvent.click(screen.getByText('กลาง'))
      expect(mockOnSizeChange).toHaveBeenCalledWith('กลาง')
    })
    
    it('calls onSizeChange with null when selected size is clicked again', () => {
      render(<ProductFilters {...defaultProps} selectedSize="กลาง" />)
      fireEvent.click(screen.getByText('กลาง'))
      expect(mockOnSizeChange).toHaveBeenCalledWith(null)
    })
    
    it('applies selected styling to active size', () => {
      render(<ProductFilters {...defaultProps} selectedSize="กลาง" />)
      const button = screen.getByLabelText('เลือกขนาด กลาง')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })
  
  describe('Plant Shape Filter Interactions', () => {
    it('calls onPlantShapeChange when plant shape button is clicked', () => {
      render(<ProductFilters {...defaultProps} />)
      fireEvent.click(screen.getByText('กระโดง'))
      expect(mockOnPlantShapeChange).toHaveBeenCalledWith('กระโดง')
    })
    
    it('calls onPlantShapeChange with null when selected shape is clicked again', () => {
      render(<ProductFilters {...defaultProps} selectedPlantShape="กระโดง" />)
      fireEvent.click(screen.getByText('กระโดง'))
      expect(mockOnPlantShapeChange).toHaveBeenCalledWith(null)
    })
    
    it('applies selected styling to active plant shape', () => {
      render(<ProductFilters {...defaultProps} selectedPlantShape="ข้าง" />)
      const button = screen.getByLabelText('เลือกรูปแบบต้น ข้าง')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })
  
  describe('Availability Filter Interactions', () => {
    it('calls onAvailabilityChange when checkbox is toggled', () => {
      render(<ProductFilters {...defaultProps} />)
      const checkbox = screen.getByLabelText('แสดงเฉพาะสินค้าที่มีในร้าน')
      fireEvent.click(checkbox)
      expect(mockOnAvailabilityChange).toHaveBeenCalledWith(true)
    })
    
    it('reflects checked state correctly', () => {
      render(<ProductFilters {...defaultProps} availableOnly={true} />)
      const checkbox = screen.getByLabelText('แสดงเฉพาะสินค้าที่มีในร้าน')
      expect(checkbox).toBeChecked()
    })
  })
  
  describe('Clear Filters', () => {
    it('calls onClearFilters when clear button is clicked', () => {
      render(<ProductFilters {...defaultProps} hasActiveFilters={true} />)
      fireEvent.click(screen.getByLabelText('ล้างตัวกรองทั้งหมด'))
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('Accessibility', () => {
    it('has proper ARIA labels for size filter group', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByRole('group', { name: 'เลือกขนาด' })).toBeInTheDocument()
    })
    
    it('has proper ARIA labels for plant shape filter group', () => {
      render(<ProductFilters {...defaultProps} />)
      expect(screen.getByRole('group', { name: 'เลือกรูปแบบต้น' })).toBeInTheDocument()
    })
    
    it('has live region for results count', () => {
      render(<ProductFilters {...defaultProps} />)
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })
    
    it('has proper aria-pressed states on filter buttons', () => {
      render(<ProductFilters {...defaultProps} selectedSize="เล็ก" />)
      const button = screen.getByLabelText('เลือกขนาด เล็ก')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })
  
  describe('Edge Cases', () => {
    it('handles empty available sizes array', () => {
      render(<ProductFilters {...defaultProps} availableSizes={[]} />)
      expect(screen.queryByText('ขนาด')).not.toBeInTheDocument()
    })
    
    it('updates results count correctly when filtered', () => {
      render(<ProductFilters {...defaultProps} filteredCount={3} totalCount={10} />)
      expect(screen.getByText('แสดง 3 จาก 10 รายการ')).toBeInTheDocument()
    })
  })
})
