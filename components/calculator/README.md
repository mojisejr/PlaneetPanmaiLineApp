# Calculator UI Components

Calculator UI components for the Praneet Panmai Line App calculator feature. These components provide a complete cart management interface with Thai language support and age-appropriate design for elderly users (35+).

## Components

### CalculatorDisplay

Main cart display component showing all items with quantity controls and pricing.

**Features:**
- Cart overview with all items
- Large 48px touch target controls
- Remove item functionality
- Loading and empty states
- Thai language labels
- Reference product indicators

**Usage:**
```tsx
import { CalculatorDisplay } from '@/components/calculator'

<CalculatorDisplay
  items={cartItems}
  onQuantityChange={(productId, newQty) => updateCart(productId, newQty)}
  onRemoveItem={(productId) => removeFromCart(productId)}
  loading={false}
/>
```

### QuantitySelector

Quantity control with large + and - buttons for easy interaction.

**Features:**
- 48px minimum touch targets
- Keyboard navigation (arrow keys)
- Min/max boundary enforcement
- ARIA labels for accessibility
- Thai labels: "เพิ่มจำนวน", "ลดจำนวน"

**Usage:**
```tsx
import { QuantitySelector } from '@/components/calculator'

<QuantitySelector
  quantity={5}
  onQuantityChange={(newQty) => setQuantity(newQty)}
  min={1}
  max={100}
/>
```

### PriceSummary

Price breakdown with tier pricing and savings display.

**Features:**
- Thai currency formatting (฿)
- Tier pricing breakdown
- Savings calculation
- Empty state handling
- Labels: "สรุปราคา", "รวมทั้งหมด", etc.

**Usage:**
```tsx
import { PriceSummary } from '@/components/calculator'

<PriceSummary
  items={summaryItems}
  total={5000}
  totalSavings={500}
  totalBeforeSavings={5500}
/>
```

### AddToCartButton

Action button with loading and success states.

**Features:**
- Loading state: "กำลังเพิ่ม..."
- Success state: "เพิ่มเรียบร้อย ✓"
- Unavailable state: "สินค้าไม่พร้อมจำหน่าย"
- Auto-hide success message (2 seconds)
- 48px minimum touch target

**Usage:**
```tsx
import { AddToCartButton } from '@/components/calculator'

<AddToCartButton
  onAddToCart={async () => {
    await addProductToCart(productId, quantity)
  }}
  isAvailable={product.is_available_in_store}
/>
```

## Example: Complete Calculator Interface

```tsx
'use client'

import { useState } from 'react'
import {
  CalculatorDisplay,
  PriceSummary,
  type CalculatorItem,
  type PriceSummaryItem,
} from '@/components/calculator'

export function CalculatorPage() {
  const [cartItems, setCartItems] = useState<CalculatorItem[]>([])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity, subtotal: calculateSubtotal(item, newQuantity) }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((items) => items.filter((item) => item.product.id !== productId))
  }

  // Convert to summary items
  const summaryItems: PriceSummaryItem[] = cartItems.map((item) => ({
    name: item.product.variety_name,
    quantity: item.quantity,
    basePrice: item.product.base_price,
    appliedTier: item.appliedTier,
    subtotal: item.subtotal,
  }))

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const totalBeforeSavings = cartItems.reduce(
    (sum, item) => sum + item.product.base_price * item.quantity,
    0
  )
  const totalSavings = totalBeforeSavings - total

  return (
    <div className="space-y-4">
      <CalculatorDisplay
        items={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
      />
      
      <PriceSummary
        items={summaryItems}
        total={total}
        totalSavings={totalSavings}
        totalBeforeSavings={totalBeforeSavings}
      />
    </div>
  )
}
```

## Accessibility Features

- **Touch Targets**: Minimum 48px (exceeds WCAG 2.1 AA standard of 44px)
- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Optimized for screen reader navigation
- **High Contrast**: 4.5:1 contrast ratio for text
- **Focus Indicators**: Clear focus outlines
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Thai Language Support

All text labels are in Thai:
- "รายการสินค้า" - Items list
- "จำนวน" - Quantity
- "เพิ่มจำนวน" - Increase quantity
- "ลดจำนวน" - Decrease quantity
- "สรุปราคา" - Price summary
- "รวมทั้งหมด" - Total
- "ส่วนลดจากราคาพิเศษ" - Discount from special pricing
- "เพิ่มลงตะกร้า" - Add to cart
- "กำลังเพิ่ม..." - Adding...
- "เพิ่มเรียบร้อย ✓" - Added successfully

## Currency Formatting

Thai Baht (฿) formatting with Thai locale:
```typescript
฿500.00
฿1,250.50
฿10,000.00
```

## Mobile-First Design

- Optimized for LINE WebView
- Minimum width: 320px
- Touch-friendly spacing
- Responsive layouts
- Fast load times (≤3 seconds target)

## TypeScript Support

All components are fully typed with TypeScript:
- Strict mode compliance
- Exported prop types
- Type-safe callbacks
- Database type integration

## Testing

Test specifications are included in `calculator-display.test.tsx`. To run tests, install a test framework like Jest or Vitest:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Then add to package.json:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
