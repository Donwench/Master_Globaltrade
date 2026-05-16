import { z } from 'zod';
import { VALIDATION_RULES } from './constants';

// ===== AUTH SCHEMAS =====

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(VALIDATION_RULES.MIN_NAME_LENGTH, 'Name is required')
    .max(VALIDATION_RULES.MAX_NAME_LENGTH, 'Name is too long'),
  role: z.enum(['buyer', 'supplier', 'manufacturer', 'freight_forwarder', 'customs_broker', 'sales_agent']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

// ===== COMPANY SCHEMAS =====

export const CompanySchema = z.object({
  name: z
    .string()
    .min(2, 'Company name is required')
    .max(255, 'Company name is too long'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  phone: z
    .string()
    .regex(VALIDATION_RULES.PHONE_REGEX, 'Invalid phone number')
    .optional(),
  website: z
    .string()
    .url('Invalid URL')
    .optional(),
  country: z
    .string()
    .min(2, 'Country is required'),
  city: z
    .string()
    .min(2, 'City is required')
    .optional(),
  state: z
    .string()
    .optional(),
  postalCode: z
    .string()
    .optional(),
  address: z
    .string()
    .optional(),
  companyType: z
    .string()
    .min(1, 'Company type is required'),
  industry: z
    .string()
    .optional(),
  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional(),
});

export type CompanyInput = z.infer<typeof CompanySchema>;

// ===== PRODUCT SCHEMAS =====

export const ProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name is required')
    .max(255, 'Product name is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description is too long')
    .optional(),
  categoryId: z
    .string()
    .optional(),
  unitPrice: z
    .number()
    .positive('Unit price must be positive'),
  currency: z
    .string()
    .default('USD'),
  minOrderQuantity: z
    .number()
    .positive('Minimum order quantity must be positive'),
  unitOfMeasure: z
    .string()
    .min(1, 'Unit of measure is required'),
  originCountry: z
    .string()
    .min(2, 'Origin country is required'),
  leadTimeDays: z
    .number()
    .positive('Lead time must be positive'),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// ===== RFQ SCHEMAS =====

export const RFQSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(255, 'Title is too long'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long'),
  categoryId: z
    .string()
    .optional(),
  quantity: z
    .number()
    .positive('Quantity must be positive'),
  unitOfMeasure: z
    .string()
    .min(1, 'Unit of measure is required'),
  currency: z
    .string()
    .default('USD'),
  deliveryCountry: z
    .string()
    .min(2, 'Delivery country is required'),
  incoterm: z
    .string()
    .min(2, 'Incoterm is required'),
  urgency: z
    .enum(['low', 'normal', 'high', 'urgent'])
    .default('normal'),
  expireDays: z
    .number()
    .positive('Expire days must be positive')
    .default(30),
});

export type RFQInput = z.infer<typeof RFQSchema>;

// ===== HELPER FUNCTIONS =====

export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
}

export function validatePhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
