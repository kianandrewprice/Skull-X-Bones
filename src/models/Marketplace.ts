export interface Product {
  id: string;
  vendorId: string;
  vendorType: 'artist' | 'team' | 'label' | 'collective';
  name: string;
  description: string;
  category: 'merchandise' | 'digital' | 'music' | 'tickets' | 'other';
  images: string[];
  price: number;
  currency: string;
  stock: number;
  sku: string;
  isActive: boolean;
  variants?: ProductVariant[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: { [key: string]: string }; // e.g., { "size": "L", "color": "Black" }
  price?: number;
  stock: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}
