'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { ShoppingCart, Plus, Minus, Trash2, Calculator } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ProductWithTiers, PriceTier } from '@/types/database'

// Extended CartItem for this component
type CalculatorCartItem = {
  product: ProductWithTiers
  quantity: number
  tier_applied?: PriceTier
  subtotal: number
}

interface CalculatorLayoutProps {
  memberDisplayName: string
}

/**
 * Calculator Layout Component
 * Manages product catalog display and cart functionality
 * Mobile-first design optimized for LINE WebView
 */
export function CalculatorLayout({ memberDisplayName }: CalculatorLayoutProps) {
  const [products, setProducts] = useState<ProductWithTiers[]>([])
  const [cart, setCart] = useState<CalculatorCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            *,
            price_tiers (
              id,
              product_id,
              min_quantity,
              max_quantity,
              special_price,
              is_active,
              created_at,
              updated_at
            )
          `)
          .eq('is_active', true)
          .order('variety_name')
          .order('size')
        
        if (fetchError) {
          throw fetchError
        }
        
        setProducts(data as ProductWithTiers[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดรายการสินค้า')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Calculate tier-based pricing
  const calculateItemPrice = (product: ProductWithTiers, quantity: number): { price: number; tierApplied?: typeof product.price_tiers[0] } => {
    if (!product.price_tiers || product.price_tiers.length === 0) {
      return { price: product.base_price * quantity }
    }

    // Sort tiers by min_quantity descending to find best match
    const sortedTiers = [...product.price_tiers]
      .filter(tier => tier.is_active)
      .sort((a, b) => b.min_quantity - a.min_quantity)

    // Find applicable tier
    const applicableTier = sortedTiers.find(tier => {
      const meetsMin = quantity >= tier.min_quantity
      const meetsMax = tier.max_quantity === null || quantity <= tier.max_quantity
      return meetsMin && meetsMax
    })

    if (applicableTier) {
      return {
        price: applicableTier.special_price * quantity,
        tierApplied: applicableTier
      }
    }

    return { price: product.base_price * quantity }
  }

  // Add item to cart
  const addToCart = (product: ProductWithTiers) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        // Update quantity
        const updated = [...prev]
        const newQuantity = updated[existingIndex].quantity + 1
        const { price, tierApplied } = calculateItemPrice(product, newQuantity)
        
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
          subtotal: price,
          tier_applied: tierApplied
        }
        return updated
      } else {
        // Add new item
        const { price, tierApplied } = calculateItemPrice(product, 1)
        return [...prev, {
          product,
          quantity: 1,
          subtotal: price,
          tier_applied: tierApplied
        }]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta)
          
          if (newQuantity === 0) {
            return null // Will be filtered out
          }
          
          const { price, tierApplied } = calculateItemPrice(item.product, newQuantity)
          
          return {
            ...item,
            quantity: newQuantity,
            subtotal: price,
            tier_applied: tierApplied
          }
        }
        return item
      }).filter(Boolean) as CalculatorCartItem[]
      
      return updated
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
    
    // Calculate savings (base price - tier price)
    const savings = cart.reduce((sum, item) => {
      const baseTotal = item.product.base_price * item.quantity
      return sum + (baseTotal - item.subtotal)
    }, 0)
    
    return { subtotal, savings }
  }, [cart])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <Card className="shadow-lg">
          <CardContent className="py-12">
            <LoadingSpinner size="lg" text="กำลังโหลดรายการสินค้า..." />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl p-4">
        <ErrorDisplay
          title="ไม่สามารถโหลดรายการสินค้า"
          message={error}
          error={new Error(error)}
          onRetry={() => window.location.reload()}
          className="shadow-lg"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-800">
                ปราณีต พันธุ์ไม้ จันทบุรี
              </h1>
              <p className="text-sm text-muted-foreground">
                เครื่องคำนวณราคาต้นทุเรียน - สวัสดี {memberDisplayName}
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Calculator className="h-6 w-6" />
              <span className="hidden text-sm font-medium sm:inline">คำนวณราคา</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl p-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Product Grid - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>รายการสินค้า</CardTitle>
                <CardDescription>
                  เลือกสินค้าที่ต้องการคำนวณราคา ({products.length} รายการ)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>ไม่มีสินค้าในขณะนี้</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {products.map(product => (
                      <Card key={product.id} className="overflow-hidden border-2 transition-all hover:border-green-300 hover:shadow-md">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">{product.variety_name}</CardTitle>
                          <CardDescription>
                            {product.size} • {product.plant_shape}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-2xl font-bold text-green-700">
                              ฿{product.base_price.toFixed(2)}
                            </p>
                            {product.is_available_in_store ? (
                              <p className="text-xs font-medium text-green-600">✓ มีในร้าน</p>
                            ) : (
                              <p className="text-xs text-muted-foreground">อ้างอิงราคาตลาด</p>
                            )}
                          </div>

                          {/* Tier pricing info */}
                          {product.price_tiers && product.price_tiers.length > 0 && (
                            <div className="rounded-lg bg-green-50 p-2 text-xs">
                              <p className="mb-1 font-semibold text-green-800">ราคาพิเศษ:</p>
                              {product.price_tiers
                                .filter(tier => tier.is_active)
                                .sort((a, b) => a.min_quantity - b.min_quantity)
                                .map((tier, idx) => (
                                  <p key={idx} className="text-green-700">
                                    {tier.min_quantity}-{tier.max_quantity || '∞'} ลูก: ฿{tier.special_price.toFixed(2)}/ลูก
                                  </p>
                                ))}
                            </div>
                          )}

                          <Button
                            onClick={() => addToCart(product)}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            เพิ่มในตะกร้า
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cart - 1/3 width on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  ตะกร้า
                </CardTitle>
                <CardDescription>
                  {cart.length} รายการ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <ShoppingCart className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">ตะกร้าว่างเปล่า</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="max-h-96 space-y-3 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.product.id} className="rounded-lg border bg-white p-3">
                          <div className="mb-2 flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{item.product.variety_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.product.size} • {item.product.plant_shape}
                              </p>
                              {item.tier_applied && (
                                <p className="mt-1 text-xs font-medium text-green-600">
                                  ราคาพิเศษ ฿{item.tier_applied.special_price.toFixed(2)}/ลูก
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="ลบสินค้า"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(item.product.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-bold text-green-700">
                              ฿{item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 border-t pt-4">
                      {totals.savings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">ส่วนลด:</span>
                          <span className="font-semibold text-green-600">
                            -฿{totals.savings.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold">
                        <span>ยอดรวม:</span>
                        <span className="text-green-700">
                          ฿{totals.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                    >
                      ล้างตะกร้า
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
