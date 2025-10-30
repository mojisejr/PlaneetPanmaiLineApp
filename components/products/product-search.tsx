/**
 * Product Search Component
 * Provides search functionality for durian plant variety names with Thai language support
 */

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

export const ProductSearch = React.forwardRef<HTMLInputElement, ProductSearchProps>(
  (
    {
      value,
      onChange,
      placeholder = 'ค้นหาพันธุ์ทุเรียน...',
      className,
      disabled = false,
      'aria-label': ariaLabel = 'ค้นหาพันธุ์ทุเรียน',
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    
    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    
    const handleClear = () => {
      onChange('')
      inputRef.current?.focus()
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    }
    
    return (
      <div className={cn('relative w-full', className)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className={cn(
            'h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 text-base',
            'placeholder:text-gray-400',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            'transition-colors duration-200',
            // Mobile optimization - larger touch target
            'min-h-[44px]',
            // Thai font support
            'font-sans'
          )}
          {...props}
        />
        
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            aria-label="ล้างคำค้นหา"
            className={cn(
              'absolute inset-y-0 right-0 flex items-center pr-3',
              'text-gray-400 hover:text-gray-600',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md',
              // Mobile optimization
              'min-w-[44px] justify-center'
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)

ProductSearch.displayName = 'ProductSearch'
