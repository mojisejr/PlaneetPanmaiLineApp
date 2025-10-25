import { z } from 'zod'

// Member validation schemas
export const memberSchema = z.object({
  line_user_id: z.string().min(1, 'Line User ID is required'),
  display_name: z.string().min(1, 'Display name is required').max(255, 'Display name too long'),
  contact_info: z.string().max(500, 'Contact information too long').optional(),
  is_active: z.boolean().default(true)
})

export const updateMemberSchema = memberSchema.partial()

// Product validation schemas
export const productSchema = z.object({
  variety_name: z.string().min(1, 'Variety name is required').max(255, 'Variety name too long'),
  size: z.string().min(1, 'Size is required').max(100, 'Size description too long'),
  plant_shape: z.enum(['กระโดง', 'ข้าง'], {
    errorMap: () => ({ message: 'Plant shape must be either กระโดง or ข้าง' })
  }),
  base_price: z.number().positive('Base price must be positive'),
  is_available_in_store: z.boolean().default(false),
  image_url: z.string().url('Invalid image URL').optional().nullable(),
  description: z.string().max(1000, 'Description too long').optional().nullable(),
  is_active: z.boolean().default(true)
})

export const updateProductSchema = productSchema.partial()

// Price tier validation schemas
const priceTierBaseSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  min_quantity: z.number().int().positive('Minimum quantity must be positive'),
  max_quantity: z.number().int().positive('Maximum quantity must be positive').optional(),
  special_price: z.number().positive('Special price must be positive'),
  is_active: z.boolean().default(true)
})

export const priceTierSchema = priceTierBaseSchema.refine(
  (data) => {
    if (data.max_quantity !== undefined) {
      return data.max_quantity >= data.min_quantity
    }
    return true
  },
  {
    message: 'Maximum quantity must be greater than or equal to minimum quantity',
    path: ['max_quantity']
  }
)

export const updatePriceTierSchema = priceTierBaseSchema.partial()

// Calculator validation schemas
export const cartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive')
})

export const calculatorStateSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number().nonnegative(),
  total_savings: z.number().nonnegative()
})

// LINE LIFF validation schemas
export const lineProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  displayName: z.string().min(1, 'Display name is required'),
  pictureUrl: z.string().url('Invalid picture URL').optional(),
  statusMessage: z.string().optional()
})

// Form validation helpers
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  errors: z.ZodIssue[]
} {
  const result = schema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues
    }
  }

  return {
    success: true,
    data: result.data
  }
}

// Type inference helpers
export type MemberInput = z.infer<typeof memberSchema>
export type MemberUpdateInput = z.infer<typeof updateMemberSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductUpdateInput = z.infer<typeof updateProductSchema>
export type PriceTierInput = z.infer<typeof priceTierBaseSchema>
export type PriceTierUpdateInput = z.infer<typeof updatePriceTierSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type LineProfileInput = z.infer<typeof lineProfileSchema>
