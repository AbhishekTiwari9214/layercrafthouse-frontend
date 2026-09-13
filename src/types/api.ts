export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  authProvider?: "local" | "google" | "linked";
  avatar?: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface TrackingStep {
  key: string;
  label: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
  completedAt: string | null;
}

export interface TrackingScan {
  date: string;
  activity: string;
  location: string;
  status: string;
  label: string;
}

export interface OrderTracking {
  trackingNumber: string;
  currentStatus: string;
  currentLabel: string;
  courierName?: string;
  source?: "shiprocket" | "estimated" | string;
  steps: TrackingStep[];
  estimatedDelivery: string | null;
  scans?: TrackingScan[];
}

export interface OrderItem {
  productId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string | null;
  slug: string | null;
}

export interface Order {
  id: string;
  transactionId: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentReference: string;
  contactEmail?: string;
  contactPhone?: string;
  shippingAddress?: Address;
  items: OrderItem[];
  tracking: OrderTracking;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentReference: string;
  contactEmail?: string;
  contactPhone?: string;
  shippingAddress?: Address;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  tracking?: OrderTracking;
  createdAt: string;
}

export interface CheckoutContact {
  email: string;
  phone: string;
}

export interface CheckoutPayload {
  paymentMethod?: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: Address;
}

export interface RazorpayOrderPayload {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

export interface CheckoutStartResponse {
  transaction: Transaction;
  razorpay: RazorpayOrderPayload;
}

export interface VerifyPaymentPayload {
  transactionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
